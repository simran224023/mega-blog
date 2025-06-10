import React, { useEffect, useState } from "react";
import { PostForm } from "../../components";
import { useSelector } from "react-redux";
import { usePostService } from "../../hooks/usePostService";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import { useToast } from "../../hooks/useToast";
import styles from "./EditPost.module.css";
import "../styles.css";

const EditPost = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { error } = useToast();
  
  const { currentPost: post, loading, getPostById } = usePostService();
  const userData = useSelector((state) => state.auth.userData);
  
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    if (slug) {
      getPostById(slug)
        .then(post => {
          // Check if the current user is the author
          if (userData && post && post.userId !== userData.$id) {
            setUnauthorized(true);
            error("You can only edit your own posts");
            setTimeout(() => navigate("/"), 2000);
          }
        })
        .catch(() => {
          navigate("/");
        });
    } else {
      navigate("/");
    }
  }, [slug, navigate, userData, error, getPostById]);

  if (loading) {
    return (
      <Loader 
        variant="logo" 
        fullScreen 
        text="Loading post for editing..." 
        size="large"
      />
    );
  }

  if (unauthorized) {
    return (
      <div className={styles.cleanErrorPage}>
        <div className={styles.errorContent}>
          <div className={styles.errorIcon}>⚠️</div>
          <h2 className={styles.errorTitle}>Unauthorized</h2>
          <p className={styles.errorMessage}>
            You can only edit posts that you've created. Redirecting...
          </p>
        </div>
      </div>
    );
  }

  return post ? (
    <PostForm post={post} />
  ) : (
    <div className={styles.cleanErrorPage}>
      <div className={styles.errorContent}>
        <div className={styles.errorIcon}>⚠️</div>
        <h2 className={styles.errorTitle}>Post not found</h2>
        <p className={styles.errorMessage}>
          The post you're looking for doesn't exist or has been deleted.
        </p>
      </div>
    </div>
  );
};

export default EditPost;