import React from "react";
import Loader from "../Loader/Loader";
import styles from "./Button.module.css";

const Button = ({
  children,
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  onClick,
  type = "button",
  className = "",
  icon,
  fullWidth = false,
  loadingText = "Processing...",
  ...props
}) => {
  console.log(className);
  const buttonClass = [
    styles.btn,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    loading && styles.loading,
    loading && styles.loadingButton,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const isDisabled = disabled || loading;
  console.log("isDisabled", isDisabled);
  console.log("buttonClass", buttonClass);
  console.log("loading", loading);
  return (
    <button
      className={buttonClass}
      onClick={onClick}
      disabled={isDisabled}
      type={type}
      {...props}
    >
      {/* {loading ? (
        <>
          <Loader variant="button" size="small" />
          <span className={styles.loadingText}>{loadingText}</span>
        </>
      ) : (
        <>
          {icon && <span className={styles.buttonIcon}>{icon}</span>}

          {children}
        </>
      )} */}
      {loading ? <span className={styles.circleLoader}></span> : children}
    </button>
  );
};

export default Button;
