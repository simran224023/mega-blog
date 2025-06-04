import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useToast } from "../../hooks/useToast";
import Button from "../../components/Button/Button";
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiX,
  FiAlertTriangle,
} from "react-icons/fi";
import authService from "../../appwrite/auth";
import { logout } from "../../store/authSlice";
import styles from "./SecuritySettings.module.css";

function SecuritySettings() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { success, error: showError } = useToast();

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Password visibility toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
  });

  // Check password match in real-time
  const passwordsMatch =
    newPassword && confirmPassword && newPassword === confirmPassword;
  const passwordMismatch = confirmPassword && newPassword !== confirmPassword;

  // Handle user logout
  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout on client side even if server logout fails
      dispatch(logout());
      navigate("/login");
    }
  };

  // Password strength check
  useEffect(() => {
    if (newPassword) {
      const strength = {
        score: 0,
        hasMinLength: newPassword.length >= 8,
        hasUppercase: /[A-Z]/.test(newPassword),
        hasLowercase: /[a-z]/.test(newPassword),
        hasNumber: /\d/.test(newPassword),
      };

      // Calculate score based on criteria (0-4)
      strength.score = [
        strength.hasMinLength,
        strength.hasUppercase,
        strength.hasLowercase,
        strength.hasNumber,
      ].filter(Boolean).length;

      setPasswordStrength(strength);
    } else {
      setPasswordStrength({
        score: 0,
        hasMinLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
      });
    }
  }, [newPassword]);

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Password validation
    if (newPassword !== confirmPassword) {
      showError("New passwords don't match");
      return;
    }

    if (newPassword.length < 8) {
      showError("Password must be at least 8 characters");
      return;
    }

    if (passwordStrength.score < 3) {
      showError("Please create a stronger password");
      return;
    }

    setPasswordLoading(true);
    try {
      const result = await authService.updatePassword(
        currentPassword,
        newPassword
      );

      if (result.success) {
        success(
          "Password updated successfully. Please use your new password next time you log in."
        );
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        if (result.requiresLogout) {
          showError(
            "Current password is incorrect. You will be logged out for security reasons."
          );

          // Delay logout by 3 seconds to allow user to see the error message
          setTimeout(() => {
            handleLogout();
          }, 3000);
        } else {
          showError(
            result.message ||
              "Failed to update password. Please try again later."
          );
        }
      }
    } catch (err) {
      showError("An unexpected error occurred. Please try again later.");
      console.error("Password update error:", err);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className={styles.securityContainer}>
      <div className={styles.securityGrid}>
        {/* Password Change Section */}
        <div className={styles.securityCard}>
          <div className={styles.securityCardHeader}>
            <h3 className={styles.cardTitle}>Change Password</h3>
          </div>

          <div className={styles.securityWarningBox}>
            <FiAlertTriangle className={styles.warningIcon} />
            <p className={styles.warningText}>
              For security reasons, entering an incorrect current password will
              automatically log you out.
            </p>
          </div>

          <form onSubmit={handlePasswordChange}>
            <div className={styles.formGroup}>
              <label htmlFor="currentPassword" className={styles.label}>
                Current Password
              </label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>
                  <FiLock />
                </span>
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={styles.input}
                  placeholder="Enter your current password"
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  aria-label={
                    showCurrentPassword ? "Hide password" : "Show password"
                  }
                >
                  {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="newPassword" className={styles.label}>
                New Password
              </label>
              <div
                className={`${styles.inputWrapper} ${
                  passwordStrength.score >= 3
                    ? styles.inputWrapperSuccess
                    : newPassword
                    ? styles.inputWrapperNeutral
                    : ""
                }`}
              >
                <span className={styles.inputIcon}>
                  <FiLock />
                </span>
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={styles.input}
                  placeholder="Create a strong password"
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={
                    showNewPassword ? "Hide password" : "Show password"
                  }
                >
                  {showNewPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              {newPassword && (
                <div className={styles.passwordStrengthMeter}>
                  <div className={styles.strengthBars}>
                    <div
                      className={`${styles.strengthBar} ${
                        passwordStrength.score >= 1 ? styles.strengthActive : ""
                      } ${
                        passwordStrength.score === 1 ? styles.strengthWeak : ""
                      }`}
                    ></div>
                    <div
                      className={`${styles.strengthBar} ${
                        passwordStrength.score >= 2 ? styles.strengthActive : ""
                      } ${
                        passwordStrength.score === 2
                          ? styles.strengthMedium
                          : ""
                      }`}
                    ></div>
                    <div
                      className={`${styles.strengthBar} ${
                        passwordStrength.score >= 3 ? styles.strengthActive : ""
                      } ${
                        passwordStrength.score === 3 ? styles.strengthGood : ""
                      }`}
                    ></div>
                    <div
                      className={`${styles.strengthBar} ${
                        passwordStrength.score >= 4 ? styles.strengthActive : ""
                      } ${
                        passwordStrength.score === 4
                          ? styles.strengthStrong
                          : ""
                      }`}
                    ></div>
                  </div>
                  <span className={styles.strengthLabel}>
                    {passwordStrength.score === 0 && "Too weak"}
                    {passwordStrength.score === 1 && "Weak"}
                    {passwordStrength.score === 2 && "Fair"}
                    {passwordStrength.score === 3 && "Good"}
                    {passwordStrength.score === 4 && "Strong"}
                  </span>
                </div>
              )}

              {newPassword && (
                <div className={styles.passwordRequirements}>
                  <div
                    className={`${styles.requirement} ${
                      passwordStrength.hasMinLength ? styles.requirementMet : ""
                    }`}
                  >
                    <span className={styles.requirementIcon}>
                      {passwordStrength.hasMinLength ? <FiCheck /> : <FiX />}
                    </span>
                    <span>At least 8 characters</span>
                  </div>
                  <div
                    className={`${styles.requirement} ${
                      passwordStrength.hasUppercase ? styles.requirementMet : ""
                    }`}
                  >
                    <span className={styles.requirementIcon}>
                      {passwordStrength.hasUppercase ? <FiCheck /> : <FiX />}
                    </span>
                    <span>At least 1 uppercase letter</span>
                  </div>
                  <div
                    className={`${styles.requirement} ${
                      passwordStrength.hasLowercase ? styles.requirementMet : ""
                    }`}
                  >
                    <span className={styles.requirementIcon}>
                      {passwordStrength.hasLowercase ? <FiCheck /> : <FiX />}
                    </span>
                    <span>At least 1 lowercase letter</span>
                  </div>
                  <div
                    className={`${styles.requirement} ${
                      passwordStrength.hasNumber ? styles.requirementMet : ""
                    }`}
                  >
                    <span className={styles.requirementIcon}>
                      {passwordStrength.hasNumber ? <FiCheck /> : <FiX />}
                    </span>
                    <span>At least 1 number</span>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirm New Password
              </label>
              <div
                className={`${styles.inputWrapper} ${
                  passwordMismatch
                    ? styles.inputWrapperError
                    : passwordsMatch
                    ? styles.inputWrapperSuccess
                    : ""
                }`}
              >
                <span className={styles.inputIcon}>
                  <FiLock />
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={styles.input}
                  placeholder="Confirm your new password"
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
                {passwordsMatch && (
                  <span className={styles.validIcon}>
                    <FiCheck />
                  </span>
                )}
                {passwordMismatch && (
                  <span className={styles.invalidIcon}>
                    <FiX />
                  </span>
                )}
              </div>
              {passwordMismatch && (
                <span className={styles.errorText}>Passwords do not match</span>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="large"
              loading={passwordLoading}
              disabled={
                passwordLoading ||
                !passwordsMatch ||
                passwordStrength.score < 3 ||
                !currentPassword
              }
              className={`${styles.actionButton} `}
              children="Update Password"
            ></Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SecuritySettings;
