import React from "react";
import styles from "./Loader.module.css";

const Loader = ({ 
  size = "medium", 
  variant = "spinner", 
  overlay = false,
  text = "",
  fullScreen = false,
  className = ""
}) => {
  const getLoaderContent = () => {
    switch (variant) {
      case "spinner":
        return <div className={`${styles.spinner} ${styles[size]}`}></div>;
      case "dots":
        return (
          <div className={styles.dots}>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
          </div>
        );
      case "pulse":
        return <div className={`${styles.pulse} ${styles[size]}`}></div>;
      case "logo":
        return (
          <div className={`${styles.logoLoader} ${styles[size]}`}>
            <img 
              src="/logo.png" 
              alt="Loading..." 
              className={styles.logoImage}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div className={styles.logoFallback} style={{ display: 'none' }}>
              ⚡
            </div>
          </div>
        );
      case "button":
        return <div className={`${styles.buttonSpinner} ${styles[size]}`}></div>;
      default:
        return <div className={`${styles.spinner} ${styles[size]}`}></div>;
    }
  };

  const containerClass = [
    fullScreen ? styles.fullScreenContainer : 
    overlay ? styles.overlayContainer : 
    styles.inlineContainer,
    className
  ].filter(Boolean).join(" ");

  return (
    <div className={containerClass}>
      <div className={styles.loaderContent}>
        {getLoaderContent()}
        {text && <p className={styles.loaderText}>{text}</p>}
      </div>
    </div>
  );
};

export default Loader;