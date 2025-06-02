import React, { useState } from "react";
import { Link } from "react-router-dom";
import appwriteService from "../../appwrite/config";
import { useSelector } from "react-redux";
import { useToast } from "../../hooks/useToast";
import Button from "../Button/Button";
import ConfirmModal from "../Modal/ConfirmModal";
import Loader from "../Loader/Loader";
import styles from "./Card.module.css";

function Card({
  $id,
  title,
  featuredImage,
  imageStyle = "cover",
  variant = "default",
}) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const userData = useSelector((state) => state.auth.userData);
  const isAuthor = userData ? true : false;
  const { success, error } = useToast();

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const result = await appwriteService.deletePost($id);
      if (result) {
        if (featuredImage) {
          await appwriteService.deleteFile(featuredImage);
        }
        success("Post deleted successfully!");
        window.location.reload();
      } else {
        error("Failed to delete post");
      }
    } catch (err) {
      error("Failed to delete post");
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

  const cardClass = [styles.card, variant === "featured" && styles.featured]
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

          {isAuthor && (
            <div className={styles.cardActions}>
              <Link to={`/edit-post/${$id}`}>
                <Button variant="success" size="small">
                  Edit
                </Button>
              </Link>
              <Button
                variant="danger"
                size="small"
                onClick={() => setIsDeleteModalOpen(true)}
                loading={deleting}
                loadingText="Deleting..."
              >
                Delete
              </Button>
            </div>
          )}
        </div>

        <div className={styles.cardContent}>
          <h3 className={styles.cardTitle}>
            <Link to={`/post/${$id}`} className={styles.titleLink}>
              {title}
            </Link>
          </h3>

          <div className={styles.cardFooter}>
            <Link to={`/post/${$id}`} className={styles.readMoreLink}>
              <Button variant="outline" size="small">
                Read More →
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
