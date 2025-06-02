import React from "react";
import { createPortal } from "react-dom";
import { useToast } from "../../hooks/useToast";
import Toast from "./Toast";
import styles from "./ToastContainer.module.css";

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return createPortal(
    <div className={styles.toastContainer}>
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>,
    document.body
  );
};

export default ToastContainer;