import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faUsers, 
  faHome
} from '@fortawesome/free-solid-svg-icons';
import givinLogo from '../../assets/images/logo.svg';
import '../../assets/styles/sidebar.css';
import { type SidebarProps, useSidebarLogic } from './SidebarLogic';

export const SidebarView: React.FC<SidebarProps> = (props) => {
  const {
    title,
    navigate,
    currentPath,
    isMobile
  } = useSidebarLogic(props);

  // Mobile tab bar
  if (isMobile) {
    return (
      <div className="mobile-tab-bar">
        <button 
          className={`tab-button ${currentPath === '/dashboard' ? 'active' : ''}`}
          onClick={() => navigate('/dashboard')}
        >
          <FontAwesomeIcon icon={faHome} />
          <span>Dashboard</span>
        </button>
        
        <button 
          className={`tab-button ${currentPath === '/fundraising-manager' ? 'active' : ''}`}
          onClick={() => navigate('/fundraising-manager')}
        >
          <FontAwesomeIcon icon={faChartLine} />
          <span>Fundraising</span>
        </button>
        
        <button 
          className={`tab-button ${currentPath === '/donor-manager' ? 'active' : ''}`}
          onClick={() => navigate('/donor-manager')}
        >
          <FontAwesomeIcon icon={faUsers} />
          <span>Donors</span>
        </button>
      </div>
    );
  }

  // Desktop sidebar
  return (
    <div className="sidebar">
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
  );
};
