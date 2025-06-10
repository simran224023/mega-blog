import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { usePostService } from "../../hooks/usePostService";
import appwriteService from "../../appwrite/config";
import { Container } from "../../components";
import parse from "html-react-parser";
import { useToast } from "../../hooks/useToast";
import ConfirmModal from "../../components/Modal/ConfirmModal";
import Loader from "../../components/Loader/Loader";
import styles from "./Post.module.css";
import "../styles.css";
import { FiCalendar, FiUser, FiEdit, FiTrash2 } from "react-icons/fi";

export default function Post() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { success: showSuccess, error: showError } = useToast(); 

  const { 
    currentPost: post, 
    loading, 
    getPostById, 
    deleteExistingPost 
  } = usePostService();
  
  const userData = useSelector((state) => state.auth.userData);
  const { displayPreferences } = useSelector((state) => state.userPreferences);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [authorName, setAuthorName] = useState("");

  // Strict check to ensure current user is the author
  const isAuthor = post && userData ? post.userId === userData.$id : false;

  useEffect(() => {
    if (slug) {
      getPostById(slug).catch(() => {
        navigate("/");
      });
    } else {
      navigate("/");
    }
  }, [slug, navigate, getPostById]);

  // Format creation date
  const formatCreationDate = () => {
    if (!post?.$createdAt) return "";
    const date = new Date(post.$createdAt);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Set author name
  useEffect(() => {
    if (post && userData) {
      if (post.userId === userData.$id) {
        setAuthorName("You");
      } else {
        // For a real app, you'd want to implement a function to get user by ID
        setAuthorName(`User ${post.userId.substring(0, 6)}`);
      }
    }
  }, [post, userData]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const deleteSuccess = await deleteExistingPost(post.$id, post.featuredImage); 
      if (deleteSuccess) {
        navigate("/");
      } else {
        showError("Failed to delete post");
      }
    } catch (err) {
      showError("Failed to delete post");
      console.error("Delete error:", err);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // Apply compact view class if enabled
  const contentClass = displayPreferences?.compactView
    ? `${styles.postContent} ${styles.compactContent}`
    : styles.postContent;

  if (loading) {
    return (
      <Loader variant="logo" fullScreen text="Loading post..." size="large" />
    );
  }

  return post ? (
    <>
      <div className={styles.pageContainer}>
        <Container>
          <div className={styles.postContainer}>
            <div className={styles.postImageContainer}>
              {post.featuredImage && (
                <img
                  src={appwriteService.getFileView(post.featuredImage)}
                  alt={post.title}
                  className={styles.postImage}
                  onError={(e) => {
                    console.error("Failed to load post image");
                    e.target.style.display = "none";
                  }}
                />
              )}
              
              <div className={styles.postImageMeta}>
                <div className={styles.dateDisplay}>
                  <FiCalendar className={styles.metaIcon} />
                  <span>{formatCreationDate()}</span>
                </div>
                
                {/* Edit and delete icons */}
                {isAuthor && (
                  <div className={styles.iconActions}>
                    <Link to={`/edit-post/${post.$id}`}>
                      <FiEdit className={styles.actionIcon} />
                    </Link>
                    <FiTrash2 
                      className={styles.actionIcon} 
                      onClick={() => setShowDeleteModal(true)}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className={styles.postHeader}>
              <h1 className={styles.postTitle}>{post.title}</h1>

              <div className={styles.postMeta}>
                <div className={styles.metaItem}>
                  <FiUser className={styles.metaIcon} />
                  <span className={styles.metaText}>
                    By <strong>{authorName}</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className={contentClass}>{parse(post.content)}</div>
          </div>
        </Container>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Post"
        message={`Are you sure you want to delete "${post.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        loading={deleting}
      />
    </>
  ) : null;
}