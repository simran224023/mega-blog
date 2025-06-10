import React, { useState } from "react";
import { useDispatch } from "react-redux";
import authService from "../../appwrite/auth";
import { logout } from "../../store/authSlice";
import { clearPosts } from "../../store/postSlice";
import { resetPreferences } from "../../store/userPreferencesSlice";
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
      dispatch(clearPosts());
      dispatch(resetPreferences());
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
      loading={loading}
      className={`${styles.logoutBtn}`}
      children="⏻ Logout"
    ></Button>
  );
}

export default LogoutBtn;
