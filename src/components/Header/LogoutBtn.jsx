import React, { useState } from "react";
import { useDispatch } from "react-redux";
import authService from "../../appwrite/auth";
import { logout } from "../../store/authSlice";
import { useToast } from "../../hooks/useToast";
import Button from "../Button/Button";
import styles from "./LogoutBtn.module.css";

function LogoutBtn({ onLogoutSuccess }) {
  const dispatch = useDispatch();
  const { error, success } = useToast();
  const [loading, setLoading] = useState(false);

  const logoutHandler = async () => {
    setLoading(true);
    try {
      await authService.logout();
      dispatch(logout());
      success("Logout successful!");
      if (onLogoutSuccess) {
        onLogoutSuccess();
      }
    } catch (err) {
      error("Logout failed. Please try again.");
      console.error("Logout error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="danger"
      size="small"
      onClick={logoutHandler}
      disabled={loading}
      className={`${styles.logoutBtn} ${loading ? styles.loading : ""}`}
    >
      {loading ? <div className={styles.circleLoader}></div> : <>⏻ Logout</>}
    </Button>
  );
}

export default LogoutBtn;
