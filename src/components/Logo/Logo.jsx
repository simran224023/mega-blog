import React from "react";
import styles from "./Logo.module.css";

const Logo = ({ width = "auto", size = "medium", variant = "default" }) => {
  const logoClasses = [styles.logo, styles[size], styles[variant]]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={logoClasses} style={{ width }}>
      <div className={styles.logoContainer}>
        <img
          src="/logo.png" 
          alt="Blog Logo"
          className={styles.logoImage}
          onError={(e) => {
            // Fallback to text logo if image fails
            e.target.style.display = "none";
            e.target.nextElementSibling.style.display = "flex";
          }}
        />
        {/* Fallback logo */}
        <div className={styles.logoIconFallback} style={{ display: "none" }}>
          <span className={styles.blogIcon}>📝</span>
        </div>
        <span className={styles.logoText}>Mega Blog</span>
      </div>
    </div>
  );
};

export default Logo;
