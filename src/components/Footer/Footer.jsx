import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./Footer.module.css";
import { Logo } from "../index";
import {
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

function Footer() {
  const authStatus = useSelector((state) => state?.auth?.status);
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: "Features", href: "#features" },
      { name: "All Posts", href: "/all-posts" },
      { name: "Categories", href: "#categories" },
      { name: "Authors", href: "#authors" },
    ],
    company: [
      { name: "About Us", href: "#about" },
      { name: "Our Team", href: "#team" },
      { name: "Careers", href: "#careers" },
      { name: "Press Kit", href: "#press" },
    ],
    resources: [
      { name: "Mega Blog", href: "/" },
      { name: "Newsletter", href: "#newsletter" },
      { name: "Help Center", href: "#help" },
      { name: "Community", href: "#community" },
    ],
    legal: [
      { name: "Privacy Policy", href: "#privacy" },
      { name: "Terms of Service", href: "#terms" },
      { name: "Cookie Policy", href: "#cookies" },
      { name: "GDPR", href: "#gdpr" },
    ],
  };

  const socialLinks = [
    { name: "Twitter", icon: <FaTwitter />, href: "#twitter" },
    { name: "Facebook", icon: <FaFacebook />, href: "#facebook" },
    { name: "Instagram", icon: <FaInstagram />, href: "#instagram" },
    { name: "LinkedIn", icon: <FaLinkedinIn />, href: "#linkedin" },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.footerMain}>
        <div className={styles.container}>
          {/* Top Section */}
          <div className={styles.footerTop}>
            <div className={styles.footerBrand}>
              <Logo size="large" />
              <p className={styles.footerDescription}>
                Discover amazing stories, insights, and knowledge from our
                community of passionate writers. Join thousands of readers who
                find inspiration here.
              </p>
              <div className={styles.socialLinks}>
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className={styles.socialLink}
                    aria-label={social.name}
                  >
                    <span>{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className={styles.newsletter}>
              <h3 className={styles.newsletterTitle}>Stay Updated</h3>
              <p className={styles.newsletterDescription}>
                Get the latest posts and updates delivered to your inbox.
              </p>
              <form className={styles.newsletterForm}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={styles.newsletterInput}
                  required
                />
                <button type="submit" className={styles.newsletterButton}>
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Links Section */}
          <div className={styles.footerLinks}>
            <div className={styles.linkGroup}>
              <h4 className={styles.linkGroupTitle}>Product</h4>
              <ul className={styles.linkList}>
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href} className={styles.footerLink}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.linkGroup}>
              <h4 className={styles.linkGroupTitle}>Company</h4>
              <ul className={styles.linkList}>
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href} className={styles.footerLink}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.linkGroup}>
              <h4 className={styles.linkGroupTitle}>Resources</h4>
              <ul className={styles.linkList}>
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href} className={styles.footerLink}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.linkGroup}>
              <h4 className={styles.linkGroupTitle}>Legal</h4>
              <ul className={styles.linkList}>
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href} className={styles.footerLink}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className={styles.footerBottom}>
        <div className={styles.container}>
          <div className={styles.footerBottomContent}>
            <p className={styles.copyright}>
              © {currentYear} Blog Platform. All rights reserved.
            </p>
            <div className={styles.footerBottomLinks}>
              <span className={styles.madeWith}>
                Made with ❤️ for writers and readers
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
