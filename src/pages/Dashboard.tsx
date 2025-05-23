import React from 'react';
import './styles/Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faUsers, 
  faRobot
} from '@fortawesome/free-solid-svg-icons';

const Dashboard: React.FC = () => {
  return (
    <div className="content-body">
      <div className="manager-header">
        <h2>Dashboard</h2>
        <p className="manager-description">
          Welcome to Givin. Track your fundraising campaigns, manage donors, and grow your nonprofit organization.
        </p>
      </div>
      
      <div className="welcome-card">
        <h3>Welcome to Givin</h3>
        <p>Your all-in-one platform for nonprofit fundraising and donor management.</p>
      </div>
      
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button className="action-button" onClick={() => window.location.href = '/fundraising-manager'}>
            <FontAwesomeIcon icon={faChartLine} /> Create Fundraising Campaign
          </button>
          <button className="action-button" onClick={() => window.location.href = '/donor-manager'}>
            <FontAwesomeIcon icon={faUsers} /> Add New Donor
          </button>
          <button className="action-button" onClick={() => window.location.href = '/givin-assistant'}>
            <FontAwesomeIcon icon={faRobot} /> Ask Givin Assistant
          </button>
        </div>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h4>Total Fundraisers</h4>
          <p className="stat-value">0</p>
        </div>
        <div className="stat-card">
          <h4>Total Donors</h4>
          <p className="stat-value">0</p>
        </div>
        <div className="stat-card">
          <h4>Total Raised</h4>
          <p className="stat-value">$0</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

