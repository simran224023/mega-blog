import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./UserProfileDropdown.module.css";
import { FiUser, FiFileText, FiSettings, FiCalendar } from "react-icons/fi";

const UserProfileDropdown = ({ isOpen, onClose }) => {
  const userData = useSelector((state) => state.auth.userData);
  const dropdownRef = useRef(null);

  // Format join date
  const formatJoinDate = () => {
    if (!userData?.$createdAt) return "N/A";
    const date = new Date(userData.$createdAt);
    return date.toLocaleDateString("en-US", { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <div className={styles.dropdownHeader}>
        <div className={styles.userAvatar}>
          {userData?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className={styles.userInfo}>
          <h3 className={styles.userName}>{userData?.name}</h3>
          <p className={styles.userEmail}>{userData?.email}</p>
        </div>
      </div>
      
      <div className={styles.dropdownDivider}></div>
      
      <ul className={styles.dropdownMenu}>
        <li>
          <Link to="/profile" className={styles.menuItem} onClick={onClose}>
            <FiUser className={styles.menuIcon} />
            <span>My Profile</span>
          </Link>
        </li>
        <li>
          <Link to="/my-posts" className={styles.menuItem} onClick={onClose}>
            <FiFileText className={styles.menuIcon} />
            <span>My Posts</span>
          </Link>
        </li>
        <li>
          <Link to="/settings" className={styles.menuItem} onClick={onClose}>
            <FiSettings className={styles.menuIcon} />
            <span>Settings</span>
          </Link>
        </li>
      </ul>
      
      <div className={styles.dropdownDivider}></div>
      
      <div className={styles.dropdownFooter}>
        <div className={styles.accountInfo}>
          {/* Removed the duplicate email field here */}
          <div className={styles.accountInfoItem}>
            <FiCalendar className={styles.infoIcon} />
            <span className={styles.infoLabel}>Joined:</span>
            <span className={styles.infoValue}>{formatJoinDate()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileDropdown;