import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { Container } from "../../components";
import { useToast } from "../../hooks/useToast";
import Button from "../../components/Button/Button";
import SecuritySettings from "../../components/SecuritySettings/SecuritySettings";
import {
  fetchUserPreferences,
  updateUserPreferences,
} from "../../store/userPreferencesSlice";
import styles from "./Settings.module.css";
import "../styles.css";

const Settings = () => {
  const [loader, setLoader] = useState(false);
  const userData = useSelector((state) => state.auth.userData);
  const { profile, displayPreferences, loading, initialized } = useSelector(
    (state) => state.userPreferences
  );

  const location = useLocation();

  // Initialize activeTab from location state if available
  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || "general"
  );

  const dispatch = useDispatch();
  const { success, error: showError } = useToast();

  // Local state for form values
  const [localFormState, setLocalFormState] = useState({
    bio: "",
    darkMode: false,
    compactView: false,
  });

  // Load user preferences
  useEffect(() => {
    if (userData && !initialized) {
      dispatch(fetchUserPreferences(userData.$id));
    }

    // Apply current theme on component mount (based on Redux state)
    if (displayPreferences.darkMode) {
      document.documentElement.classList.add("dark-theme");
    } else {
      document.documentElement.classList.remove("dark-theme");
    }
  }, [dispatch, userData, initialized, displayPreferences.darkMode]);

  // Initialize local form state from Redux state
  useEffect(() => {
    setLocalFormState({
      bio: profile.bio || "",
      darkMode: displayPreferences.darkMode || false,
      compactView: displayPreferences.compactView || false,
    });
  }, [
    profile.bio,
    displayPreferences.darkMode,
    displayPreferences.compactView,
  ]);

  // Handle tab changes from location.state updates
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  // Handle input changes (only updates local state)
  const handleBioChange = (e) => {
    setLocalFormState({
      ...localFormState,
      bio: e.target.value,
    });
  };

  // Handle display preference changes (only updates local state)
  const handleDisplayPreferenceChange = (setting, checked) => {
    setLocalFormState({
      ...localFormState,
      [setting]: checked,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!userData) {
        showError("You must be logged in to update settings");
        return;
      }
      setLoader(true);
      // Prepare preferences object with local form state
      const updatedPreferences = {
        profile: {
          ...profile,
          bio: localFormState.bio,
        },
        displayPreferences: {
          ...displayPreferences,
          darkMode: localFormState.darkMode,
          compactView: localFormState.compactView,
        },
      };

      // Save preferences
      await dispatch(
        updateUserPreferences({
          userId: userData.$id,
          preferences: updatedPreferences,
        })
      ).unwrap();

      // Apply dark mode theme after successful update
      if (localFormState.darkMode) {
        document.documentElement.classList.add("dark-theme");
      } else {
        document.documentElement.classList.remove("dark-theme");
      }

      success("Settings updated successfully");
    } catch (err) {
      console.error("Error updating settings:", err);
      showError("Failed to update settings. Please try again.");
    } finally {
      setLoader(false);
    }
  };

  // Render based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "security":
        return <SecuritySettings />;
      case "general":
      default:
        return (
          <form onSubmit={handleSubmit} className={styles.settingsForm}>
            <div className={styles.settingsSection}>
              <h2 className={styles.sectionTitle}>Profile Information</h2>

              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={userData?.name || ""}
                  className={styles.input}
                  disabled
                />
                <p className={styles.fieldNote}>
                  Name cannot be changed. Contact support for assistance.
                </p>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userData?.email || ""}
                  className={styles.input}
                  disabled
                />
                <p className={styles.fieldNote}>
                  To change your email, please contact support.
                </p>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="bio" className={styles.label}>
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={localFormState.bio}
                  onChange={handleBioChange}
                  className={styles.textarea}
                  rows="4"
                  placeholder="Tell us a bit about yourself..."
                ></textarea>
              </div>
            </div>

            <div className={styles.settingsSection}>
              <h2 className={styles.sectionTitle}>Preferences</h2>

              <div className={styles.checkboxGroup}>
                <h3 className={styles.checkboxGroupTitle}>
                  Display Preferences
                </h3>

                <div className={styles.checkbox}>
                  <input
                    type="checkbox"
                    id="darkMode"
                    checked={localFormState.darkMode}
                    onChange={(e) =>
                      handleDisplayPreferenceChange(
                        "darkMode",
                        e.target.checked
                      )
                    }
                  />
                  <label htmlFor="darkMode">Enable dark mode</label>
                </div>

                <div className={styles.checkbox}>
                  <input
                    type="checkbox"
                    id="compactView"
                    checked={localFormState.compactView}
                    onChange={(e) =>
                      handleDisplayPreferenceChange(
                        "compactView",
                        e.target.checked
                      )
                    }
                  />
                  <label htmlFor="compactView">
                    Use compact view for posts
                  </label>
                </div>
              </div>
            </div>

            <div className={styles.formActions}>
              <Button
                type="submit"
                variant="primary"
                size="large"
                disabled={loader}
                loading={loader}
                children="Save Changes"
              />
            </div>
          </form>
        );
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Container>
        <div className={styles.settingsContainer}>
          <div className={styles.settingsHeader}>
            <h1 className={styles.pageTitle}>Account Settings</h1>
            <p className={styles.pageDescription}>
              Manage your account preferences and settings
            </p>
          </div>

          <div className={styles.settingsTabs}>
            <button
              className={`${styles.tabButton} ${
                activeTab === "general" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("general")}
            >
              General
            </button>
            <button
              className={`${styles.tabButton} ${
                activeTab === "security" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("security")}
            >
              Security
            </button>
          </div>

          {renderTabContent()}
        </div>
      </Container>
    </div>
  );
};

export default Settings;
