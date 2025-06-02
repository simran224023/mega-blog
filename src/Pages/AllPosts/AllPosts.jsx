import React, { useState, useEffect } from "react";
import appWriteService from "../../appwrite/config";
import { Card, Container } from "../../components";
import Loader from "../../components/Loader/Loader";
import styles from "./AllPosts.module.css";
import "../styles.css"
const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await appWriteService.getPosts([]);
        if (posts) {
          setPosts(posts.documents);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <Loader
        variant="logo"
        fullScreen
        text="Loading amazing content..."
        size="large"
      />
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.editorContainer}>
        <div className={styles.editorHeader}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>All Posts</h1>
            <p className={styles.pageSubtitle}>
              Discover all the amazing content from our community
            </p>
          </div>
        </div>
      </div>
      <Container>
        <div className={styles.contentWrapper}>
          {posts.length === 0 ? (
            <div className={styles.enhancedEmptyState}>
              <div className={styles.emptyStateIconWrapper}>
                <span className={styles.emptyStateIcon}>📝</span>
              </div>
              <h2 className={styles.emptyStateTitle}>No posts found</h2>
              <p className={styles.emptyStateText}>
                Be the first to create a post and share your thoughts!
              </p>
            </div>
          ) : (
            <div className={styles.enhancedPostsGrid}>
              {posts.map((post) => (
                <Card key={post.$id} {...post} variant="enhanced" />
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default AllPosts;
