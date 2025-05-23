import React, { useState } from 'react';
import './styles/DonorManager.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faPlus, faUsers } from '@fortawesome/free-solid-svg-icons';

const DonorManager: React.FC = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState('All Donors');

  const handleFilterChange = (filter: string) => {
    setCurrentFilter(filter);
    setFilterOpen(false);
  };

  return (
    <div className="content-body">
      <div className="manager-header">
        <h2>Donor Manager</h2>
        <p className="manager-description">
          Track and manage your donors, their contact information, and donation history.
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
              <button onClick={() => handleFilterChange('All Donors')}>All Donors</button>
              <button onClick={() => handleFilterChange('Recent')}>Recent</button>
              <button onClick={() => handleFilterChange('Top Donors')}>Top Donors</button>
              <button onClick={() => handleFilterChange('Inactive')}>Inactive</button>
            </div>
          )}
        </div>
        <button className="add-button">
          <FontAwesomeIcon icon={faPlus} /> Add Donor
        </button>
      </div>

      <div className="donors-container">
        {/* Empty state */}
        <div className="empty-state">
          <div className="empty-state-icon">
            <FontAwesomeIcon icon={faUsers} />
          </div>
          <h3>No donors yet</h3>
          <p>Add your first donor to start tracking donations and building relationships with your supporters.</p>
          <button className="primary-button">
            <FontAwesomeIcon icon={faPlus} /> Add Donor
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonorManager;
