import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../../appwrite/config";
import { Container } from "../../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { useToast } from "../../hooks/useToast";
import Button from "../../components/Button/Button";
import ConfirmModal from "../../components/Modal/ConfirmModal";
import Loader from "../../components/Loader/Loader";
import styles from "./Post.module.css";
import "../styles.css";

export default function Post() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { slug } = useParams();
  const navigate = useNavigate();
  const { success, error } = useToast();

  const userData = useSelector((state) => state.auth.userData);
  const isAuthor = post && userData ? post.userId === userData.$id : false;

  useEffect(() => {
    if (slug) {
      appwriteService
        .getPost(slug)
        .then((post) => {
          if (post) {
            setPost(post);
          } else {
            error("Post not found");
            navigate("/");
          }
          setLoading(false);
        })
        .catch((err) => {
          error("Failed to load post");
          navigate("/");
          setLoading(false);
        });
    } else {
      navigate("/");
    }
  }, [slug, navigate, success, error]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const status = await appwriteService.deletePost(post.$id);
      if (status) {
        await appwriteService.deleteFile(post.featuredImage);
        success("Post deleted successfully!");
        navigate("/");
      } else {
        error("Failed to delete post");
      }
    } catch (err) {
      error("Failed to delete post");
      console.error("Delete error:", err);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

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

              {isAuthor && (
                <div className={styles.postActions}>
                  <Link to={`/edit-post/${post.$id}`}>
                    <Button variant="success" size="small">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="small"
                    onClick={() => setShowDeleteModal(true)}
                    disabled={loading}
                    className={`${loading ? styles.loading : ""}`}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </div>

            <div className={styles.postHeader}>
              <h1 className={styles.postTitle}>{post.title}</h1>
            </div>

            <div className={styles.postContent}>{parse(post.content)}</div>
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
