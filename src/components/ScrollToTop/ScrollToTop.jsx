import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when route changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth" // You can use "auto" for instant scroll
    });
  }, [pathname]);

  return null; // This component doesn't render anything
}

export default ScrollToTop;