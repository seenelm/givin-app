import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useChatSidebar } from '../../context/ChatSidebarContext';
import Chat from './Chat';
import '../../assets/styles/floating-chat.css';

const FloatingChatButton: React.FC = () => {
  const { isMobile, isMobileModalOpen, toggleMobileModal } = useChatSidebar();

  // Only render on mobile devices
  if (!isMobile) return null;

  return (
    <>
      {/* Floating button */}
      <button 
        className={`floating-chat-button ${isMobileModalOpen ? 'hidden' : ''}`}
        onClick={toggleMobileModal}
        aria-label="Open chat assistant"
      >
        <FontAwesomeIcon icon={faComment} />
      </button>

      {/* Chat modal */}
      {isMobileModalOpen && (
        <div className="chat-modal-overlay">
          <div className="chat-modal">
            <Chat />
           
          </div>
          <button 
              className="close-modal-button"
              onClick={toggleMobileModal}
              aria-label="Close chat"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
        </div>
      )}
    </>
  );
};

export default FloatingChatButton;
