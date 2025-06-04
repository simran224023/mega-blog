import React from "react";
import { createPortal } from "react-dom";
import Button from "../Button/Button"; // Import your Button component
import styles from "./ConfirmModal.module.css";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
  loading = false,
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <div className={`${styles.modalIcon} ${styles[type]}`}>
            {type === "danger" ? "⚠️" : "❓"}
          </div>
          <h2 className={styles.modalTitle}>{title}</h2>
        </div>

        <div className={styles.modalBody}>
          <p className={styles.modalMessage}>{message}</p>
        </div>

        <div className={styles.modalFooter}>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>

          <Button
            variant="danger"
            onClick={onConfirm}
            disabled={loading}
            loading={loading}
            children={confirmText}
          ></Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmModal;
