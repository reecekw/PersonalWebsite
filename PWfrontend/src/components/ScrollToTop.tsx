import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  // This hook grabs the current URL path
  const { pathname } = useLocation();

  // This effect runs every time the path changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // It returns null because it works invisibly in the background
  return null;
};

export default ScrollToTop;