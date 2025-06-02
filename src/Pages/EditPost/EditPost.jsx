import React, { useEffect, useState } from "react";
import { PostForm } from "../../components";
import appWriteService from "../../appwrite/config";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import styles from "./EditPost.module.css";
import "../styles.css";

const EditPost = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) {
      appWriteService.getPost(slug).then((post) => {
        if (post) {
          setPost(post);
        } else {
          navigate("/");
        }
        setLoading(false);
      }).catch((error) => {
        console.error("Error fetching post:", error);
        navigate("/");
        setLoading(false);
      });
    } else {
      navigate("/");
    }
  }, [slug, navigate]);

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