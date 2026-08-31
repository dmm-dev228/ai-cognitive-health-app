import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/*
 * ScrollToTop
 * -----------
 * Resets the page scroll position whenever the route changes.
 *
 * This ensures that navigating to a new page starts the user
 * at the top of that page across desktop, tablet, and mobile.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
}

export default ScrollToTop;