import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./AuthLayout.module.css";

export default function Protected({ children, authentication = true }) {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const authStatus = useSelector((state) => state?.auth?.status);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (authentication && authStatus !== authentication) {
        navigate("/login");
      } else if (!authentication && authStatus !== authentication) {
        navigate("/");
      }
      setLoader(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [authentication, authStatus, navigate]);
  return <div className={styles.protectedContent}>{children}</div>;
}
