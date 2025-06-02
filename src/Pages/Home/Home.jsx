import React, { useEffect, useState } from "react";
import appwriteService from "../../appwrite/config";
import { Container, Card } from "../../components";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../../components/Loader/Loader";
import styles from "./Home.module.css";
import "../styles.css"; 

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const authStatus = useSelector((state) => state?.auth?.status);

  useEffect(() => {
    appwriteService.getPosts().then((fetchedPosts) => {
      if (fetchedPosts) {
        setPosts(fetchedPosts.documents);
        setFeaturedPosts(fetchedPosts.documents.slice(0, 3));
      }
      setLoading(false);
    });
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
    <div className={styles.homePage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <Container>
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>
                Welcome to <span className={styles.brandHighlight}>Our Blog</span>
              </h1>
              <p className={styles.heroDescription}>
                Discover amazing stories, insights, and knowledge from our community of writers. 
                Join thousands of readers who find inspiration here every day.
              </p>
              <div className={styles.heroActions}>
                {!authStatus ? (
                  <>
                    <Link to="/login" className={`${styles.btn} ${styles.btnPrimary}`}>
                      Start Reading
                    </Link>
                    <Link to="/signup" className={`${styles.btn} ${styles.btnSecondary}`}>
                      Join Community
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/add-post" className={`${styles.btn} ${styles.btnPrimary}`}>
                      Write Your Story
                    </Link>
                    <Link to="/all-posts" className={`${styles.btn} ${styles.btnSecondary}`}>
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
                    <img src="/logo.png" alt="Blog Logo" className={styles.heroLogo} />
                  </div>
                  <h3>Share Your Ideas</h3>
                  <p>Express yourself and connect with readers worldwide</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Rest of the component remains the same */}
      {/* Featured Posts Section */}
      {posts.length > 0 && (
        <section className={styles.featuredSection}>
          <Container>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Featured Stories</h2>
              <p className={styles.sectionDescription}>
                Handpicked stories from our community
              </p>
            </div>
            <div className={styles.featuredGrid}>
              {featuredPosts.map((post, index) => (
                <div key={post.$id} className={`${styles.featuredCard} ${styles[`featured${index + 1}`]}`}>
                  <Card {...post} variant="featured" />
                </div>
              ))}
            </div>
            <div className={styles.sectionFooter}>
              <Link to="/all-posts" className={`${styles.btn} ${styles.btnOutline}`}>
                View All Posts
              </Link>
            </div>
          </Container>
        </section>
      )}

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <Container>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{posts.length}+</div>
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
              Join our community of writers and share your unique perspective with the world.
            </p>
            {!authStatus ? (
              <Link to="/signup" className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLarge}`}>
                Get Started Today
              </Link>
            ) : (
              <Link to="/add-post" className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLarge}`}>
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