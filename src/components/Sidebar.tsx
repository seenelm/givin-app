import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import '../assets/styles/sidebar.css';
import givinLogo from '../assets/images/logo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faUsers, 
  faHome,
  faBars,
  faTimes,
  faRobot
} from '@fortawesome/free-solid-svg-icons';

type SidebarProps = {
  title?: string;
};

const Sidebar: React.FC<SidebarProps> = ({ title = "Givin" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMobileMenuOpen && !target.closest('.sidebar') && !target.closest('.mobile-menu-toggle')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <button 
        className="mobile-menu-toggle" 
        onClick={toggleMobileMenu}
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
      >
        <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
      </button>
      
      {isMobileMenuOpen && <div className="sidebar-overlay visible" onClick={() => setIsMobileMenuOpen(false)} />}
      
      <div className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <img src={givinLogo} alt="Givin Logo" className="sidebar-logo" />
          <h2>{title}</h2>
        </div>
        
        <div className="sidebar-section">
          <h3 className="section-title">Tools</h3>
          <ul className="sidebar-menu">
            <li className="sidebar-menu-item">
              <button 
                className={`sidebar-button ${currentPath === '/fundraising-manager' ? 'active' : ''}`}
                onClick={() => navigate('/fundraising-manager')}
              >
                <span className="icon">
                  <FontAwesomeIcon icon={faChartLine} />
                </span>
                <span className="button-text">Fundraising Manager</span>
              </button>
            </li>
            <li className="sidebar-menu-item">
              <button 
                className={`sidebar-button ${currentPath === '/donor-manager' ? 'active' : ''}`}
                onClick={() => navigate('/donor-manager')}
              >
                <span className="icon">
                  <FontAwesomeIcon icon={faUsers} />
                </span>
                <span className="button-text">Donor Manager</span>
              </button>
            </li>
            <li className="sidebar-menu-item">
              <button 
                className={`sidebar-button ${currentPath === '/givin-assistant' ? 'active' : ''}`}
                onClick={() => navigate('/givin-assistant')}
              >
                <span className="icon">
                  <FontAwesomeIcon icon={faRobot} />
                </span>
                <span className="button-text">Givin Assistant</span>
              </button>
            </li>
          </ul>
        </div>
        
        {/* Dashboard link at the bottom */}
        <div className="sidebar-section">
          <ul className="sidebar-menu">
            <li className="sidebar-menu-item">
              <button 
                className={`sidebar-button ${currentPath === '/dashboard' ? 'active' : ''}`}
                onClick={() => navigate('/dashboard')}
              >
                <span className="icon">
                  <FontAwesomeIcon icon={faHome} />
                </span>
                <span className="button-text">Dashboard</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
