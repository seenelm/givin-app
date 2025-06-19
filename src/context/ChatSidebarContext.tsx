import React, { createContext, useState, useContext, type ReactNode, useEffect } from 'react';

interface ChatSidebarContextType {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  width: number;
  setWidth: (width: number) => void;
  defaultWidth: number;
  isMobileModalOpen: boolean;
  toggleMobileModal: () => void;
  isMobile: boolean;
}

const defaultWidth = 350;

const ChatSidebarContext = createContext<ChatSidebarContextType>({
  isCollapsed: false,
  toggleCollapse: () => {},
  width: defaultWidth,
  setWidth: () => {},
  defaultWidth,
  isMobileModalOpen: false,
  toggleMobileModal: () => {},
  isMobile: false
});

export const ChatSidebarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [width, setWidth] = useState(defaultWidth);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if the screen is mobile size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed(prev => !prev);
  };

  const toggleMobileModal = () => {
    setIsMobileModalOpen(prev => !prev);
  };

  return (
    <ChatSidebarContext.Provider 
      value={{ 
        isCollapsed, 
        toggleCollapse, 
        width, 
        setWidth,
        defaultWidth,
        isMobileModalOpen,
        toggleMobileModal,
        isMobile
      }}
    >
      {children}
    </ChatSidebarContext.Provider>
  );
};

export const useChatSidebar = () => useContext(ChatSidebarContext);
