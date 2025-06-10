import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./AuthLayout.module.css";

export default function Protected({ children, authentication = true }) {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state?.auth?.status);
  const userData = useSelector((state) => state?.auth?.userData);

  useEffect(() => {
    if (authentication) {
      if (!authStatus || !userData) {
        navigate("/login");
      }
    } 
    else {
      if (authStatus && userData) {
        navigate("/");
      }
    }
  }, [authentication, authStatus, userData, navigate]);

  return <div className={styles.protectedContent}>{children}</div>;
}