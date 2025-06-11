import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChevronDown, 
  faPlus, 
  faHandHoldingDollar,
  faFileImport
} from '@fortawesome/free-solid-svg-icons';
import './styles/FundraisingManager.css';
import './styles/Dashboard.css';

interface Campaign {
  id?: string;
  name: string;
  description: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: string;
}

const FundraisingManager: React.FC = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState('All Campaigns');
  const [campaigns] = useState<Campaign[]>([]);
  // const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const handleFilterChange = (filter: string) => {
    setCurrentFilter(filter);
    setFilterOpen(false);
  };

  // const handleImportClick = () => {
  //   setIsImportModalOpen(true);
  // };

  return (
    <div className="content-body fundraising-manager-container">
      <div className="manager-header">
        <h2>Fundraising Manager</h2>
        <p className="manager-description">
          Organize your fundraising campaigns, track donations, and manage donor relationships.
        </p>
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
        <div className="action-buttons">
          <button className="import-button" onClick={() => {}}>
            <FontAwesomeIcon icon={faFileImport} /> Import Campaigns
          </button>
          <button className="add-button">
            <FontAwesomeIcon icon={faPlus} /> Add Campaign
          </button>
        </div>
      </div>

      <div className="campaigns-container">
        {campaigns.length === 0 ? (
          // Empty state
          <div className="empty-state">
            <div className="empty-state-icon">
              <FontAwesomeIcon icon={faHandHoldingDollar} />
            </div>
            <h3>No campaigns yet</h3>
            <p>Create your first fundraising campaign to start collecting donations.</p>
            <div className="empty-state-actions">
              <button className="primary-button" onClick={() => {}}>
                <FontAwesomeIcon icon={faFileImport} /> Import Campaigns
              </button>
              <button className="primary-button">
                <FontAwesomeIcon icon={faPlus} /> Create Campaign
              </button>
            </div>
          </div>
        ) : (
          // Campaign list would go here
          <div className="campaign-list">
            {/* Campaign list implementation */}
          </div>
        )}
      </div>
    </div>
  );
};

export default FundraisingManager;
