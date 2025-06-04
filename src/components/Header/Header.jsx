import React, { useState, useEffect } from "react";
import { Container, Logo, LogoutBtn } from "../index";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserProfileDropdown from "../UserProfile/UserProfileDropdown";
import styles from "./Header.module.css";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const authStatus = useSelector((state) => state?.auth?.status);
  const userData = useSelector((state) => state?.auth?.userData);
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "All Posts", slug: "/all-posts", active: authStatus },
    { name: "My Posts", slug: "/my-posts", active: authStatus },
    { name: "Add Post", slug: "/add-post", active: authStatus },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Sign Up", slug: "/signup", active: !authStatus },
  ];

  const isActiveRoute = (slug) => {
    if (slug === "/" && location.pathname === "/") return true;
    if (slug !== "/" && location.pathname.startsWith(slug)) return true;
    return false;
  };

  const handleNavigation = (slug) => {
    navigate(slug);
    setIsMobileMenuOpen(false);
  };

  const toggleProfileDropdown = (e) => {
    e.stopPropagation();
    setIsProfileOpen(!isProfileOpen);
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest(`.${styles.nav}`)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);
 
  return (
    <header className={styles.header}>
      <Container>
        <nav className={styles.nav}>
          <div className={styles.logoSection}>
            <Link to="/" className={styles.logoLink}>
              <Logo variant="header" size="medium" />
            </Link>
          </div>
          
          <div className={styles.navContent}>
            <ul className={`${styles.navList} ${isMobileMenuOpen ? styles.mobileOpen : ''}`}>
              {navItems.map(
                (item) =>
                  item.active && (
                    <li key={item.name} className={styles.navItem}>
                      <button
                        className={`${styles.navButton} ${
                          isActiveRoute(item.slug) ? styles.activeNavButton : ''
                        }`}
                        onClick={() => handleNavigation(item.slug)}
                        aria-label={`Navigate to ${item.name}`}
                        aria-current={isActiveRoute(item.slug) ? 'page' : undefined}
                      >
                        {item.name}
                      </button>
                    </li>
                  )
              )}
            </ul>
            
            {authStatus && (
              <div className={styles.userSection}>
                <div className={styles.userInfo}>
                  <div 
                    className={styles.userAvatar}
                    onClick={toggleProfileDropdown}
                    aria-label="Open profile menu"
                    role="button"
                    tabIndex={0}
                  >
                    {userData?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className={styles.userName}>
                    Hi, {userData?.name?.split(' ')[0] || 'User'}
                  </span>
                </div>
                <LogoutBtn />
                <UserProfileDropdown 
                  isOpen={isProfileOpen} 
                  onClose={() => setIsProfileOpen(false)} 
                />
              </div>
            )}
            
            <button
              className={styles.mobileMenuButton}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <div className={styles.hamburger}>
                <span className={styles.hamburgerLine}></span>
                <span className={styles.hamburgerLine}></span>
                <span className={styles.hamburgerLine}></span>
              </div>
            </button>
          </div>
        </nav>
      </Container>
    </header>
  );
};

export default Header;