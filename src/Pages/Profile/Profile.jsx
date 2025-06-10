import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { usePostService } from "../../hooks/usePostService";
import { Container, Card } from "../../components";
import Loader from "../../components/Loader/Loader";
import styles from "./Profile.module.css";
import "../styles.css";
import {
  FiMail,
  FiCalendar,
  FiFileText,
  FiSettings,
  FiLock,
} from "react-icons/fi";

const Profile = () => {
  const navigate = useNavigate();
  const { userPosts, loading, getUserPosts } = usePostService();
  const userData = useSelector((state) => state.auth.userData);
  const authStatus = useSelector((state) => state.auth.status);
  // Function to navigate to settings with specific tab
  const goToSecuritySettings = (e) => {
    e.preventDefault();
    navigate("/settings", { state: { activeTab: "security" } });
  };
  useEffect(() => {
    if (!authStatus) {
      navigate("/login");
      return;
    }

    if (userData) {
      getUserPosts(userData.$id);
    }
  }, [userData, authStatus, navigate, getUserPosts]);

  // Format join date
  const formatJoinDate = () => {
    if (!userData?.$createdAt) return "N/A";
    const date = new Date(userData.$createdAt);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Loader
        variant="logo"
        fullScreen
        text="Loading your profile..."
        size="large"
      />
    );
  }

  return (
    <div className={styles.pageContainer}>
      <Container>
        <div className={styles.profileContainer}>
          <div className={styles.profileHeader}>
            <div className={styles.profileImage}>
              {userData?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className={styles.profileInfo}>
              <h1 className={styles.profileName}>{userData?.name}</h1>
              <div className={styles.profileMeta}>
                <div className={styles.metaItem}>
                  <FiMail className={styles.metaIcon} />
                  <span className={styles.metaText}>{userData?.email}</span>
                </div>
                <div className={styles.metaItem}>
                  <FiCalendar className={styles.metaIcon} />
                  <span className={styles.metaText}>
                    Member since {formatJoinDate()}
                  </span>
                </div>
                <div className={styles.metaItem}>
                  <FiFileText className={styles.metaIcon} />
                  <span className={styles.metaText}>
                    {userPosts.length} Posts
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.profileContent}>
            <div className={styles.profileSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Recent Posts</h2>
                <Link to="/my-posts" className={styles.viewAllLink}>
                  View All Posts
                </Link>
              </div>

              {userPosts.length === 0 ? (
                <div className={styles.emptyPosts}>
                  <p>You haven't created any posts yet.</p>
                  <Link to="/add-post" className={styles.createPostButton}>
                    Create Your First Post
                  </Link>
                </div>
              ) : (
                <div className={styles.postsGrid}>
                  {userPosts.slice(0, 3).map((post) => (
                    <Card key={post.$id} {...post} variant="default" />
                  ))}
                </div>
              )}
            </div>

            <div className={styles.profileSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Account Settings</h2>
              </div>
              <div className={styles.settingsOptions}>
                <Link to="/settings" className={styles.settingsOption}>
                  <span className={styles.optionIcon}>
                    <FiSettings size={20} />
                  </span>
                  <div className={styles.optionContent}>
                    <h3 className={styles.optionTitle}>General Settings</h3>
                    <p className={styles.optionDescription}>
                      Manage your account preferences and settings
                    </p>
                  </div>
                </Link>
                <Link
                  to="/settings"
                  className={styles.settingsOption}
                  onClick={goToSecuritySettings}
                >
                  <span className={styles.optionIcon}>
                    <FiLock size={20} />
                  </span>
                  <div className={styles.optionContent}>
                    <h3 className={styles.optionTitle}>Security</h3>
                    <p className={styles.optionDescription}>
                      Update your password and security settings
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Profile;
