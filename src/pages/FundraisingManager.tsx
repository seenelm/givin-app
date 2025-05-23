import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faPlus, faHandHoldingDollar } from '@fortawesome/free-solid-svg-icons';
import './styles/FundraisingManager.css';
import './styles/Dashboard.css';

const FundraisingManager: React.FC = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState('All Campaigns');

  const handleFilterChange = (filter: string) => {
    setCurrentFilter(filter);
    setFilterOpen(false);
  };

  return (
    <>
      <div className="content-body">
        <div className="manager-header">
          <div>
            <h2>Fundraising Manager</h2>
            <p className="manager-description">
              Organize your fundraising campaigns, track donations, and manage donor relationships.
            </p>
          </div>
        </div>

        <div className="manager-controls">
          <div className="filter-dropdown">
            <button 
              className="filter-button" 
              onClick={() => setFilterOpen(!filterOpen)}
            >
              {currentFilter} <FontAwesomeIcon icon={faChevronDown} />
            </button>
            {filterOpen && (
              <div className="filter-menu">
                <button onClick={() => handleFilterChange('All Campaigns')}>All Campaigns</button>
                <button onClick={() => handleFilterChange('Active')}>Active</button>
                <button onClick={() => handleFilterChange('Completed')}>Completed</button>
                <button onClick={() => handleFilterChange('Draft')}>Draft</button>
              </div>
            )}
          </div>
          <button className="add-button">
            <FontAwesomeIcon icon={faPlus} /> Add Campaign
          </button>
        </div>

        <div className="campaigns-container">
          {/* Empty state */}
          <div className="empty-state">
            <div className="empty-state-icon">
              <FontAwesomeIcon icon={faHandHoldingDollar} />
            </div>
            <h3>No campaigns yet</h3>
            <p>Create your first fundraising campaign to start collecting donations.</p>
            <button className="primary-button">
              <FontAwesomeIcon icon={faPlus} /> Create Campaign
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FundraisingManager;
