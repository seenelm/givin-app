import React, { useState, useRef, useEffect } from 'react';
import './styles/GivinAssistant.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faRobot, faComments } from '@fortawesome/free-solid-svg-icons';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const GivinAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      handleSendMessage();
    }
  };

  const simulateResponse = (userMessage: string) => {
    // Simple response logic based on keywords
    const lowerCaseMessage = userMessage.toLowerCase();
    
    if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
      return "Hello! I'm Givin Assistant. How can I help with your nonprofit organization today?";
    } else if (lowerCaseMessage.includes('fundrais')) {
      return "Fundraising is essential for nonprofits. You can create a new fundraising campaign from the Fundraising Manager section. Would you like some tips on effective fundraising strategies?";
    } else if (lowerCaseMessage.includes('donor')) {
      return "Managing donor relationships is key to nonprofit success. You can add and track donors in the Donor Manager section. Would you like advice on donor retention strategies?";
    } else if (lowerCaseMessage.includes('thank')) {
      return "You're welcome! I'm here to help with any questions about nonprofit management.";
    } else {
      return "I understand you're interested in nonprofit management. Could you provide more details about what specific help you need with your organization?";
    }
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate assistant typing
    setTimeout(() => {
      const assistantMessage: Message = {
        id: messages.length + 2,
        text: simulateResponse(userMessage.text),
        sender: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  return (
    <div className="content-body">
      <div className="assistant-container">
        <div className="assistant-header">
          <h2>Givin Assistant</h2>
          <p className="assistant-description">
            Ask me anything about nonprofit management, fundraising strategies, or donor relations.
          </p>
        </div>
        
        <div className="chat-container">
          <div className="messages-container">
            {messages.length === 0 ? (
              <div className="empty-chat">
                <div className="empty-chat-icon">
                  <FontAwesomeIcon icon={faComments} />
                </div>
                <h3>Start a Conversation</h3>
                <p>
                  Ask Givin Assistant about fundraising strategies, donor management, 
                  nonprofit best practices, or any other questions about your organization.
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`message ${message.sender === 'user' ? 'user-message' : 'assistant-message'}`}
                >
                  {message.sender === 'assistant' && (
                    <div className="message-avatar">
                      <FontAwesomeIcon icon={faRobot} />
                    </div>
                  )}
                  <div className="message-content">
                    {message.text}
                    <div className="message-time">
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))
            )}
            {isTyping && (
              <div className="message assistant-message">
                <div className="message-avatar">
                  <FontAwesomeIcon icon={faRobot} />
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="input-container">
            <input
              type="text"
              className="message-input"
              placeholder="Type your message here..."
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
            <button 
              className="send-button" 
              onClick={handleSendMessage}
              disabled={inputValue.trim() === ''}
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GivinAssistant;
