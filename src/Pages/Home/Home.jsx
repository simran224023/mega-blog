import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../../store/postSlice";
import { Container, Card } from "../../components";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import styles from "./Home.module.css";
import "../styles.css";

const Home = () => {
  const dispatch = useDispatch();
  const { posts, loading } = useSelector((state) => state.posts);
  const authStatus = useSelector((state) => state?.auth?.status);
  const featuredPosts = posts?.slice(0, 3);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

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
    <div className={styles.homePage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <Container>
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>
                Welcome to{" "}
                <span className={styles.brandHighlight}>Our Blog</span>
              </h1>
              <p className={styles.heroDescription}>
                Discover amazing stories, insights, and knowledge from our
                community of writers. Join thousands of readers who find
                inspiration here every day.
              </p>
              <div className={styles.heroActions}>
                {!authStatus ? (
                  <>
                    <Link
                      to="/login"
                      className={`${styles.btn} ${styles.btnPrimary}`}
                    >
                      Start Reading
                    </Link>
                    <Link
                      to="/signup"
                      className={`${styles.btn} ${styles.btnSecondary}`}
                    >
                      Join Community
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/add-post"
                      className={`${styles.btn} ${styles.btnPrimary}`}
                    >
                      Write Your Story
                    </Link>
                    <Link
                      to="/all-posts"
                      className={`${styles.btn} ${styles.btnSecondary}`}
                    >
                      Explore Posts
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className={styles.heroVisual}>
              <div className={styles.heroCard}>
                <div className={styles.cardPattern}></div>
                <div className={styles.cardContent}>
                  <div className={styles.cardIcon}>
                    <img
                      src="/logo.png"
                      alt="Blog Logo"
                      className={styles.heroLogo}
                    />
                  </div>
                  <h3>Share Your Ideas</h3>
                  <p>Express yourself and connect with readers worldwide</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Posts Section */}
      <section className={styles.featuredSection}>
        <Container>
          {authStatus && posts && posts.length > 0 ? (
            <div>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Featured Stories</h2>
                <p className={styles.sectionDescription}>
                  Handpicked stories from our community
                </p>
              </div>
              <div className={styles.featuredGrid}>
                {featuredPosts.map((post) => (
                  <Card key={post.$id} {...post} variant="featured" />
                ))}
              </div>
            </div>
          ) : (
            // Enhanced styled message for non-logged-in users
            <div className={styles.loginPromptContainer}>
              <div className={styles.loginPromptCard}>
                <div className={styles.loginPromptPattern}></div>
                <div className={styles.loginPromptContent}>
                  <div className={styles.loginPromptIcon}>
                    <img
                      src="/logo.png"
                      alt="Blog Logo"
                      className={styles.loginPromptLogo}
                    />
                  </div>
                  <h3>Unlock Premium Content</h3>
                  <p>
                    Join our community to read amazing stories from our writers
                    and contribute your own!
                  </p>
                  <div className={styles.loginPromptActions}>
                    <Link
                      to="/login"
                      className={`${styles.btn} ${styles.btnPrimary}`}
                    >
                      Log In
                    </Link>
                    <Link
                      to="/signup"
                      className={`${styles.btn} ${styles.btnPrimary}`}
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className={styles.sectionFooter}>
            <Link
              to={authStatus ? "/all-posts" : "/login"}
              className={`${styles.btn} ${styles.btnOutline}`}
            >
              {authStatus ? "View All Posts" : "Log In to View All Posts"}
            </Link>
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <Container>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{posts?.length || 0}+</div>
              <div className={styles.statLabel}>Published Posts</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>1K+</div>
              <div className={styles.statLabel}>Active Readers</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>50+</div>
              <div className={styles.statLabel}>Contributors</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>24/7</div>
              <div className={styles.statLabel}>Available</div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <Container>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to Share Your Story?</h2>
            <p className={styles.ctaDescription}>
              Join our community of writers and share your unique perspective
              with the world.
            </p>
            {!authStatus ? (
              <Link
                to="/signup"
                className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLarge}`}
              >
                Get Started Today
              </Link>
            ) : (
              <Link
                to="/add-post"
                className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLarge}`}
              >
                Create Your First Post
              </Link>
            )}
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Home;