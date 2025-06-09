import React, { createContext, useState, useContext, type ReactNode } from 'react';

interface ChatSidebarContextType {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  width: number;
  setWidth: (width: number) => void;
  defaultWidth: number;
}

const defaultWidth = 350;

const ChatSidebarContext = createContext<ChatSidebarContextType>({
  isCollapsed: false,
  toggleCollapse: () => {},
  width: defaultWidth,
  setWidth: () => {},
  defaultWidth
});

export const ChatSidebarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [width, setWidth] = useState(defaultWidth);

  const toggleCollapse = () => {
    setIsCollapsed(prev => !prev);
  };

  return (
    <ChatSidebarContext.Provider 
      value={{ 
        isCollapsed, 
        toggleCollapse, 
        width, 
        setWidth,
        defaultWidth
      }}
    >
      {children}
    </ChatSidebarContext.Provider>
  );
};

export const useChatSidebar = () => useContext(ChatSidebarContext);
