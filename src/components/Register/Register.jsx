import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import authService from "../../appwrite/auth";
import { login } from "../../store/authSlice";
import { useToast } from "../../hooks/useToast";
import Button from "../Button/Button";
import Loader from "../Loader/Loader";
import styles from "./Register.module.css";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiX,
} from "react-icons/fi";

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, dirtyFields, touchedFields },
    trigger,
  } = useForm({
    mode: "onChange", // This enables real-time validation
    criteriaMode: "all", // Show all validation errors
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  // Watch form values for real-time validation
  const watchedValues = watch();
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const email = watch("email");

  // Password strength check
  useEffect(() => {
    if (password) {
      const strength = {
        score: 0,
        hasMinLength: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /\d/.test(password),
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
  }, [password]);

  // Check password match in real-time
  const passwordsMatch =
    password && confirmPassword && password === confirmPassword;
  const passwordMismatch = confirmPassword && password !== confirmPassword;

  // Email validation regex
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const isEmailValid = email && emailRegex.test(email);
  const isEmailInvalid = email && !emailRegex.test(email);

  // Trigger validation on specific fields when their values change
  useEffect(() => {
    if (dirtyFields.email) trigger("email");
    if (dirtyFields.password) trigger("password");
    if (dirtyFields.confirmPassword) trigger("confirmPassword");
  }, [email, password, confirmPassword, dirtyFields, trigger]);

  const createUser = async (data) => {
    setLoading(true);
    try {
      const userData = await authService.createAccount(data);
      if (userData) {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          dispatch(login({ userData: currentUser }));
          success(`Welcome ${data.name}! Account created successfully!`);
          navigate("/");
        } else {
          error("Account created but failed to log in automatically");
        }
      } else {
        error("Failed to create account. Please try again");
      }
    } catch (err) {
      error("Registration failed. Please check your details and try again");
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerCard}>
        {/* Left Side - Header */}
        <div className={styles.registerHeader}>
          <div className={styles.headerContent}>
            <div className={styles.logoContainer}>
              <img src="/logo.png" alt="Blog Logo" className={styles.logo} />
              <h1 className={styles.brandName}>Mega Blog</h1>
            </div>
            <h2 className={styles.title}>Create Account</h2>
            <p className={styles.subtitle}>Join our community of writers</p>
          </div>

          {/* Decorative Elements */}
          <div className={styles.decorativeElements}>
            <div className={styles.circle1}></div>
            <div className={styles.circle2}></div>
            <div className={styles.circle3}></div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className={styles.rightSection}>
          {/* Form */}
          <form
            onSubmit={handleSubmit(createUser)}
            className={styles.registerForm}
          >
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Full Name
              </label>
              <div
                className={`${styles.inputWrapper} ${
                  errors.name
                    ? styles.inputWrapperError
                    : dirtyFields.name
                    ? styles.inputWrapperSuccess
                    : ""
                }`}
              >
                <span className={styles.inputIcon}>
                  <FiUser />
                </span>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  className={`${styles.input} ${
                    errors.name ? styles.inputError : ""
                  }`}
                  {...register("name", {
                    required: "Full name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                    pattern: {
                      value: /^[a-zA-Z ]+$/,
                      message: "Name should only contain letters",
                    },
                  })}
                  autoComplete="name"
                />
                {dirtyFields.name && !errors.name && (
                  <span className={styles.validIcon}>
                    <FiCheck />
                  </span>
                )}
              </div>
              {errors.name && (
                <span className={styles.errorText}>{errors.name.message}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <div
                className={`${styles.inputWrapper} ${
                  isEmailInvalid
                    ? styles.inputWrapperError
                    : isEmailValid
                    ? styles.inputWrapperSuccess
                    : ""
                }`}
              >
                <span className={styles.inputIcon}>
                  <FiMail />
                </span>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className={`${styles.input} ${
                    isEmailInvalid ? styles.inputError : ""
                  }`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: emailRegex,
                      message: "Please enter a valid email address",
                    },
                  })}
                  autoComplete="email"
                />
                {isEmailValid && (
                  <span className={styles.validIcon}>
                    <FiCheck />
                  </span>
                )}
                {isEmailInvalid && (
                  <span className={styles.invalidIcon}>
                    <FiX />
                  </span>
                )}
              </div>
              {errors.email && (
                <span className={styles.errorText}>{errors.email.message}</span>
              )}
              {isEmailInvalid && !errors.email && (
                <span className={styles.errorText}>
                  Please enter a valid email address
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <div
                className={`${styles.inputWrapper} ${
                  errors.password
                    ? styles.inputWrapperError
                    : passwordStrength.score >= 3
                    ? styles.inputWrapperSuccess
                    : ""
                }`}
              >
                <span className={styles.inputIcon}>
                  <FiLock />
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className={`${styles.input} ${
                    errors.password ? styles.inputError : ""
                  }`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message:
                        "Password must contain uppercase, lowercase, and number",
                    },
                  })}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {password && (
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
              {password && (
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
              {errors.password && (
                <span className={styles.errorText}>
                  {errors.password.message}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirm Password
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
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className={`${styles.input} ${
                    passwordMismatch ? styles.inputError : ""
                  }`}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  autoComplete="new-password"
                />
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
              {errors.confirmPassword && (
                <span className={styles.errorText}>
                  {errors.confirmPassword.message}
                </span>
              )}
              {passwordMismatch && !errors.confirmPassword && (
                <span className={styles.errorText}>Passwords do not match</span>
              )}
            </div>

            <div className={styles.formTerms}>
              <label className={styles.checkboxWrapper}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  {...register("terms", {
                    required: "You must agree to the terms and conditions",
                  })}
                />
                <span className={styles.checkboxLabel}>
                  I agree to the{" "}
                  <Link to="#" className={styles.termsLink}>
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link to="#" className={styles.termsLink}>
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.terms && (
                <span className={styles.errorText}>{errors.terms.message}</span>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              loading={loading}
              disabled={loading}
              children="Create Account"
            ></Button>

            {/* Footer integrated into the right section */}
            <div className={styles.registerFooter}>
              <p className={styles.footerText}>
                Already have an account?{" "}
                <Link to="/login" className={styles.loginLink}>
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
