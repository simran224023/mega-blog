import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserPosts } from "../../store/postSlice";
import { Card, Container } from "../../components";
import Loader from "../../components/Loader/Loader";
import styles from "./MyPosts.module.css";
import "../styles.css";

const MyPosts = () => {
  const dispatch = useDispatch();
  const { userPosts, loading } = useSelector((state) => state.posts);
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    if (userData) {
      dispatch(fetchUserPosts(userData.$id));
    }
  }, [dispatch, userData]);

  if (loading) {
    return (
      <Loader
        variant="logo"
        fullScreen
        text="Loading your posts..."
        size="large"
      />
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.editorContainer}>
        <div className={styles.editorHeader}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>My Posts</h1>
            <p className={styles.pageSubtitle}>
              Manage all your created content in one place
            </p>
          </div>
        </div>
      </div>
      <Container>
        <div className={styles.contentWrapper}>
          {userPosts.length === 0 ? (
            <div className={styles.enhancedEmptyState}>
              <div className={styles.emptyStateIconWrapper}>
                <span className={styles.emptyStateIcon}>📝</span>
              </div>
              <h2 className={styles.emptyStateTitle}>No posts yet</h2>
              <p className={styles.emptyStateText}>
                You haven't created any posts yet. Start sharing your thoughts with the world!
              </p>
            </div>
          ) : (
            <div className={styles.enhancedPostsGrid}>
              {userPosts.map((post) => (
                <Card key={post.$id} {...post} variant="enhanced" />
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default MyPosts;