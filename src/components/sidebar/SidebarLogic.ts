import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';

export interface SidebarProps {
  title?: string;
}

export const useSidebarLogic = (props: SidebarProps = {}) => {
  const { title = "Givin" } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Check if device is mobile on mount and when window resizes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Set initial value
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const navigateTo = (path: string) => {
    navigate(path);
  };

  return {
    title,
    navigate: navigateTo,
    currentPath,
    isMobile
  };
};
