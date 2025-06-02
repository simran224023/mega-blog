import React, { useEffect } from "react";
import styles from "./Toast.module.css";

const Toast = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const getToastIcon = (type) => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      default:
        return "ℹ️";
    }
  };

  return (
    <div className={`${styles.toast} ${styles[toast.type]}`}>
      <div className={styles.toastIcon}>
        {getToastIcon(toast.type)}
      </div>
      <div className={styles.toastContent}>
        <p className={styles.toastMessage}>{toast.message}</p>
      </div>
      <button
        className={styles.toastClose}
        onClick={() => onRemove(toast.id)}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;