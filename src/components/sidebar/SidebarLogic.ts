import { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router';

// Create a context for sidebar state
export const SidebarContext = createContext<{
  isCollapsed: boolean;
  toggleSidebar: () => void;
}>({
  isCollapsed: false,
  toggleSidebar: () => {}
});

// Hook to use sidebar context
export const useSidebar = () => useContext(SidebarContext);

export interface SidebarProps {
  title?: string;
}

export const useSidebarLogic = (props: SidebarProps = {}) => {
  const { title = "DonorLoop" } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
  };

  return {
    title,
    navigate: navigateTo,
    currentPath,
    isMobile,
    isCollapsed,
    toggleSidebar
  };
};
