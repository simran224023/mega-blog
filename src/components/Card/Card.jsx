import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { usePostService } from "../../hooks/usePostService";
import appwriteService from "../../appwrite/config";
import authService from "../../appwrite/auth";
import { useToast } from "../../hooks/useToast";
import Button from "../Button/Button";
import ConfirmModal from "../Modal/ConfirmModal";
import Loader from "../Loader/Loader";
import styles from "./Card.module.css";
import {
  FiCalendar,
  FiUser,
  FiArrowRight
} from "react-icons/fi";

function Card({
  $id,
  title,
  featuredImage,
  imageStyle = "cover",
  variant = "default",
  userId,
  $createdAt,
  author, // We'll now accept an author object from enhanced posts
}) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [authorName, setAuthorName] = useState("");

  const userData = useSelector((state) => state.auth.userData);
  const { displayPreferences } = useSelector((state) => state.userPreferences);
  const { success: showSuccess, error: showError } = useToast(); 
  const { deleteExistingPost } = usePostService();

  // Check if the current user is the author of this post
  const isAuthor = userData && userId ? userData.$id === userId : false;

  // Check if compact view is enabled
  const isCompactView = displayPreferences?.compactView || false;

  // Format creation date to match the design (Jun 1, 2025)
  const formatCreationDate = () => {
    if (!$createdAt) return "";
    const date = new Date($createdAt);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Set author name - use provided author object if available, otherwise fetch
  useEffect(() => {
    const setAuthor = async () => {
      // If author is already provided from enhanced post
      if (author && author.name) {
        setAuthorName(isAuthor ? "You" : author.name);
        return;
      }

      // Otherwise, fetch the author
      if (userId) {
        if (isAuthor && userData?.name) {
          setAuthorName("You");
        } else {
          try {
            const authorData = await authService.getUserById(userId);
            setAuthorName(authorData.name);
          } catch (err) {
            console.error("Error fetching author:", err);
            setAuthorName(`User ${userId.substring(0, 4)}`);
          }
        }
      } else {
        setAuthorName("Anonymous");
      }
    };

    setAuthor();
  }, [userId, isAuthor, userData, author]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const deleteSuccess = await deleteExistingPost($id, featuredImage);s
      if (deleteSuccess) {
        window.location.reload();
      } else {
        showError("Failed to delete post");
      }
    } catch (err) {
      showError("Failed to delete post");
      console.error("Delete error:", err);
    } finally {
      setDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  // Determine card classes based on variant and view mode
  const cardClass = [
    styles.card,
    variant === "featured" && styles.featured,
    isCompactView && styles.compactCard,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <div className={cardClass}>
        <div className={styles.imageContainer}>
          {imageLoading && (
            <div className={styles.imagePlaceholder}>
              <Loader variant="logo" size="large" />
            </div>
          )}

          {!imageError ? (
            <img
              src={appwriteService.getFileView(featuredImage)}
              alt={title}
              className={styles.cardImage}
              style={{ objectFit: imageStyle }}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          ) : (
            <div className={styles.imageFallback}>
              <span className={styles.fallbackIcon}>🖼️</span>
              <span className={styles.fallbackText}>Image not available</span>
            </div>
          )}
        </div>

        <div className={styles.cardContent}>
          <h3 className={styles.cardTitle}>
            <Link to={`/post/${$id}`} className={styles.titleLink}>
              {title}
            </Link>
          </h3>

          <div className={styles.cardMeta}>
            <div className={styles.authorInfo}>
              <FiUser className={styles.metaIcon} />
              <span className={styles.authorName}>{authorName}</span>
            </div>
            <div className={styles.dateInfo}>
              <FiCalendar className={styles.metaIcon} />
              <span className={styles.postDate}>{formatCreationDate()}</span>
            </div>
          </div>
          <div className={styles.cardFooter}>
            <Link to={`/post/${$id}`} className={styles.readMoreLink}>
              <Button variant="outline" size="small">
                Read More{" "}
                {isCompactView ? (
                  <FiArrowRight style={{ marginLeft: "4px" }} />
                ) : (
                  "→"
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Post"
        message={`Are you sure you want to delete "${title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        loading={deleting}
      />
    </>
  );
}

export default Card;