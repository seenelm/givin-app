import React, { useRef, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Chat from './Chat';
import { useChatSidebar } from '../context/ChatSidebarContext';
import '../assets/styles/resizable-chat-sidebar.css';

const ResizableChatSidebar: React.FC = () => {
  const { isCollapsed, toggleCollapse, width, setWidth } = useChatSidebar();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);

  // Handle resize functionality
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      setIsResizing(true);
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      // Calculate the new width based on the mouse position
      const containerRect = sidebarRef.current?.parentElement?.getBoundingClientRect();
      if (!containerRect) return;
      
      // Calculate from right edge of the screen to mouse position
      const newWidth = containerRect.right - e.clientX;
      
      // Set min and max width constraints
      const minWidth = 250;
      const maxWidth = Math.min(600, containerRect.width * 0.6);
      
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    const resizeHandle = resizeHandleRef.current;
    resizeHandle?.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      resizeHandle?.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, setWidth]);

  return (
    <div 
      ref={sidebarRef}
      className={`resizable-chat-sidebar ${isCollapsed ? 'collapsed' : ''}`}
      style={{ width: isCollapsed ? '40px' : `${width}px` }}
    >
      <div 
        ref={resizeHandleRef}
        className="resize-handle"
        title="Drag to resize"
      ></div>
      
      <button 
        className="collapse-button"
        onClick={toggleCollapse}
        aria-label={isCollapsed ? "Expand chat" : "Collapse chat"}
        title={isCollapsed ? "Expand chat" : "Collapse chat"}
      >
        <FontAwesomeIcon icon={isCollapsed ? faChevronRight : faChevronLeft} />
      </button>
      
      <div className="chat-content">
        {!isCollapsed && <Chat />}
      </div>
    </div>
  );
};

export default ResizableChatSidebar;
