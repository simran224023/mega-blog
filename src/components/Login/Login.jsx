import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import authService from "../../appwrite/auth";
import { login as authLogin } from "../../store/authSlice";
import { useToast } from "../../hooks/useToast";
import Button from "../Button/Button";
import styles from "./Login.module.css";

// Import icons from a library like react-icons or create SVG components
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const loginUser = async (data) => {
    setLoading(true);
    setAuthError(null);
    
    try {
      const session = await authService.login(data);
      
      if (session) {
        const userData = await authService.getCurrentUser();
        if (userData) {
          dispatch(authLogin({ userData }));
          success(`Welcome back, ${userData.name}! Login successful`);
          navigate("/");
        } else {
          throw new Error("Failed to get user data");
        }
      } else {
        throw new Error("Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      
      // Handle different types of errors
      if (err.message.includes("Invalid credentials") || err.message.includes("Invalid password")) {
        setError("password", {
          type: "manual",
          message: "Incorrect password"
        });
        setAuthError("password");
      } else if (err.message.includes("not found") || err.message.includes("User not found")) {
        setError("email", {
          type: "manual",
          message: "No account found with this email"
        });
        setAuthError("email");
      } else if (err.message.includes("too many requests") || err.message.includes("rate limit")) {
        setAuthError("tooManyAttempts");
        error("Too many login attempts. Please try again later.");
      } else {
        setAuthError("unknown");
        error("Login failed. Please check your credentials and try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        {/* Header - Left side */}
        <div className={styles.loginHeader}>
          <div className={styles.headerContent}>
            <div className={styles.logoContainer}>
              <img src="/logo.png" alt="Blog Logo" className={styles.logo} />
              <h1 className={styles.brandName}>Mega Blog</h1>
            </div>
            <h2 className={styles.title}>Welcome Back</h2>
            <p className={styles.subtitle}>Please sign in to your account</p>
          </div>

          <div className={styles.decorativeElements}>
            <div className={styles.circle1}></div>
            <div className={styles.circle2}></div>
            <div className={styles.circle3}></div>
          </div>
        </div>

        {/* Right side - Form and Footer */}
        <div className={styles.rightSection}>
          {/* Form */}
          <form onSubmit={handleSubmit(loginUser)} className={styles.loginForm} noValidate>
            {authError === "unknown" && (
              <div className={styles.authErrorMessage}>
                <FiAlertCircle />
                <span>We couldn't sign you in. Please check your details and try again.</span>
              </div>
            )}
            
            {authError === "tooManyAttempts" && (
              <div className={styles.authErrorMessage}>
                <FiAlertCircle />
                <span>Too many login attempts. Please try again later or reset your password.</span>
              </div>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <div className={`${styles.inputWrapper} ${errors.email ? styles.inputWrapperError : ""}`}>
                <span className={styles.inputIcon}>
                  <FiMail />
                </span>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className={styles.input}
                  autoComplete="email"
                  {...register("email", {
                    required: "Email is required"
                  })}
                />
              </div>
              {errors.email && (
                <span className={styles.errorText}>{errors.email.message}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <div className={`${styles.inputWrapper} ${errors.password ? styles.inputWrapperError : ""}`}>
                <span className={styles.inputIcon}>
                  <FiLock />
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={styles.input}
                  autoComplete="current-password"
                  {...register("password", {
                    required: "Password is required"
                  })}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex="-1"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && (
                <span className={styles.errorText}>
                  {errors.password.message}
                </span>
              )}
              {authError === "password" && !errors.password && (
                <span className={styles.errorText}>
                  Incorrect password. Please try again.
                </span>
              )}
            </div>

            <div className={styles.formOptions}>
              <label className={styles.checkboxWrapper}>
                <input 
                  type="checkbox" 
                  className={styles.checkbox}
                  {...register("rememberMe")}
                />
                <span className={styles.checkboxLabel}>Remember me</span>
              </label>
              <Link to="/forgot-password" className={styles.forgotLink}>
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              className={loading ? styles.loadingButton : ""}
              disabled={loading || isSubmitting}
            >
              {loading ? (
                <span className={styles.circleLoader}></span>
              ) : (
                "Sign In"
              )}
            </Button>

            {/* Footer */}
            <div className={styles.loginFooter}>
              <p className={styles.footerText}>
                Don't have an account?{" "}
                <Link to="/signup" className={styles.signupLink}>
                  Create Account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;