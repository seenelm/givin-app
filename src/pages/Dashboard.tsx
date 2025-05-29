import React from 'react';
import './styles/Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faUsers, 
  faRobot,
  faMoneyBillWave,
  faHandshake,
  faCheckCircle,
  faExclamationTriangle,
  faCalendarCheck,
  faPiggyBank,
  faChartPie,
  faUserPlus,
  faEnvelope,
  faListCheck
} from '@fortawesome/free-solid-svg-icons';

const Dashboard: React.FC = () => {
  return (
    <div className="content-body">
      <div className="manager-header">
        <h2>Organization Overview</h2>
        <p className="manager-description">
          Your organization at a glance - monitor key metrics, manage relationships, and stay on top of important tasks.
        </p>
      </div>
      
      {/* Financial Health Section */}
      <div className="dashboard-section">
        <div className="section-header">
          <h3><FontAwesomeIcon icon={faMoneyBillWave} /> Financial Health</h3>
        </div>
        <div className="dashboard-stats">
          <div className="stat-card">
            <h4>Total Raised</h4>
            <p className="stat-value">$24,500</p>
            <p className="stat-trend positive">+12% from last month</p>
          </div>
          <div className="stat-card">
            <h4>Monthly Recurring</h4>
            <p className="stat-value">$1,850</p>
            <p className="stat-trend positive">+5% from last month</p>
          </div>
          <div className="stat-card">
            <h4>Avg. Donation</h4>
            <p className="stat-value">$75</p>
            <p className="stat-trend neutral">Same as last month</p>
          </div>
          <div className="stat-card">
            <h4>Donor Retention</h4>
            <p className="stat-value">78%</p>
            <p className="stat-trend positive">+3% from last month</p>
          </div>
        </div>
        
        <div className="financial-charts">
          <div className="chart-card">
            <h4><FontAwesomeIcon icon={faChartPie} /> Revenue Breakdown</h4>
            <div className="chart-placeholder">
              <div className="revenue-breakdown">
                <div className="revenue-item">
                  <div className="revenue-color individual"></div>
                  <div className="revenue-label">Individual Donations (65%)</div>
                </div>
                <div className="revenue-item">
                  <div className="revenue-color corporate"></div>
                  <div className="revenue-label">Corporate Giving (20%)</div>
                </div>
                <div className="revenue-item">
                  <div className="revenue-color grants"></div>
                  <div className="revenue-label">Grants (10%)</div>
                </div>
                <div className="revenue-item">
                  <div className="revenue-color other"></div>
                  <div className="revenue-label">Other (5%)</div>
                </div>
              </div>
            </div>
          </div>
          <div className="chart-card">
            <h4><FontAwesomeIcon icon={faPiggyBank} /> Fundraising Progress</h4>
            <div className="chart-placeholder">
              <div className="campaign-progress">
                <div className="campaign">
                  <div className="campaign-name">Annual Gala</div>
                  <div className="progress-container">
                    <div className="progress-bar accent-color" style={{width: '75%'}}></div>
                  </div>
                  <div className="campaign-stats">$15,000 of $20,000 (75%)</div>
                </div>
                <div className="campaign">
                  <div className="campaign-name">Summer Program</div>
                  <div className="progress-container">
                    <div className="progress-bar accent-color" style={{width: '40%'}}></div>
                  </div>
                  <div className="campaign-stats">$6,000 of $15,000 (40%)</div>
                </div>
                <div className="campaign">
                  <div className="campaign-name">Building Fund</div>
                  <div className="progress-container">
                    <div className="progress-bar accent-color" style={{width: '25%'}}></div>
                  </div>
                  <div className="campaign-stats">$12,500 of $50,000 (25%)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Relationship Management Section */}
      <div className="dashboard-section">
        <div className="section-header">
          <h3><FontAwesomeIcon icon={faHandshake} /> Relationship Management</h3>
        </div>
        <div className="relationship-metrics">
          <div className="metric-card">
            <div className="metric-icon">
              <FontAwesomeIcon icon={faUsers} />
            </div>
            <div className="metric-content">
              <h4>Total Donors</h4>
              <p className="metric-value">327</p>
              <p className="metric-detail">42 new this month</p>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">
              <FontAwesomeIcon icon={faUserPlus} />
            </div>
            <div className="metric-content">
              <h4>Acquisition Rate</h4>
              <p className="metric-value">14.8%</p>
              <p className="metric-detail">+2.3% from last month</p>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">
              <FontAwesomeIcon icon={faEnvelope} />
            </div>
            <div className="metric-content">
              <h4>Email Engagement</h4>
              <p className="metric-value">32%</p>
              <p className="metric-detail">Open rate for last campaign</p>
            </div>
          </div>
        </div>
        
        <div className="donor-segments">
          <h4>Donor Segments</h4>
          <div className="segments-container">
            <div className="segment-card">
              <h5>Major Donors</h5>
              <p className="segment-count">18 donors</p>
              <p className="segment-total">$15,200 this year</p>
            </div>
            <div className="segment-card">
              <h5>Monthly Givers</h5>
              <p className="segment-count">76 donors</p>
              <p className="segment-total">$1,850 monthly</p>
            </div>
            <div className="segment-card">
              <h5>First-Time Donors</h5>
              <p className="segment-count">42 donors</p>
              <p className="segment-total">$2,310 this month</p>
            </div>
            <div className="segment-card">
              <h5>Lapsed Donors</h5>
              <p className="segment-count">24 donors</p>
              <p className="segment-total">$4,800 potential</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tasks Section */}
      <div className="dashboard-section">
        <div className="section-header">
          <h3><FontAwesomeIcon icon={faListCheck} /> Tasks</h3>
        </div>
        
        <div className="tasks-container">
          <div className="tasks-column">
            <h4>Recommended Tasks</h4>
            <div className="task-list">
              <div className="task-item priority-high">
                <div className="task-icon">
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                </div>
                <div className="task-content">
                  <h5>Follow up with major donors</h5>
                  <p>5 donors haven't received a thank you call</p>
                </div>
                <div className="task-action">
                  <button className="task-button">Start</button>
                </div>
              </div>
              
              <div className="task-item priority-medium">
                <div className="task-icon">
                  <FontAwesomeIcon icon={faCalendarCheck} />
                </div>
                <div className="task-content">
                  <h5>Plan donor appreciation event</h5>
                  <p>Annual event needs planning within 2 weeks</p>
                </div>
                <div className="task-action">
                  <button className="task-button">Start</button>
                </div>
              </div>
              
              <div className="task-item priority-medium">
                <div className="task-icon">
                  <FontAwesomeIcon icon={faEnvelope} />
                </div>
                <div className="task-content">
                  <h5>Send monthly newsletter</h5>
                  <p>Due in 3 days</p>
                </div>
                <div className="task-action">
                  <button className="task-button">Start</button>
                </div>
              </div>
              
              <div className="task-item priority-low">
                <div className="task-icon">
                  <FontAwesomeIcon icon={faChartLine} />
                </div>
                <div className="task-content">
                  <h5>Review campaign performance</h5>
                  <p>Summer campaign ended last week</p>
                </div>
                <div className="task-action">
                  <button className="task-button">Start</button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="tasks-column">
            <h4>Recent Activity</h4>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon completed">
                  <FontAwesomeIcon icon={faCheckCircle} />
                </div>
                <div className="activity-content">
                  <h5>New donation received</h5>
                  <p>$500 from Sarah Johnson</p>
                  <p className="activity-time">Today, 10:23 AM</p>
                </div>
              </div>
              
              <div className="activity-item">
                <div className="activity-icon completed">
                  <FontAwesomeIcon icon={faCheckCircle} />
                </div>
                <div className="activity-content">
                  <h5>Email campaign sent</h5>
                  <p>Summer Program Update</p>
                  <p className="activity-time">Yesterday, 2:15 PM</p>
                </div>
              </div>
              
              <div className="activity-item">
                <div className="activity-icon completed">
                  <FontAwesomeIcon icon={faCheckCircle} />
                </div>
                <div className="activity-content">
                  <h5>New donor added</h5>
                  <p>Michael Smith joined as monthly donor</p>
                  <p className="activity-time">Yesterday, 11:05 AM</p>
                </div>
              </div>
              
              <div className="activity-item">
                <div className="activity-icon completed">
                  <FontAwesomeIcon icon={faCheckCircle} />
                </div>
                <div className="activity-content">
                  <h5>Grant application submitted</h5>
                  <p>Community Foundation - $10,000</p>
                  <p className="activity-time">May 26, 9:30 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Actions Section */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button className="action-button" onClick={() => window.location.href = '/fundraising-manager'}>
            <FontAwesomeIcon icon={faChartLine} /> Create Campaign
          </button>
          <button className="action-button" onClick={() => window.location.href = '/donor-manager'}>
            <FontAwesomeIcon icon={faUsers} /> Add Donor
          </button>
          <button className="action-button" onClick={() => window.location.href = '/givin-assistant'}>
            <FontAwesomeIcon icon={faRobot} /> Ask Assistant
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

