import React, { useState } from 'react';
import './styles/DonorManager.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChevronDown, 
  faPlus, 
  faUsers,
  faFileImport
} from '@fortawesome/free-solid-svg-icons';
import CSVImportModal from '../components/csv/CSVImportModal';
import '../components/csv/CSVImport.css';

interface Donor {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  donationAmount?: string;
  donationDate?: string;
  notes?: string;
}

const DonorManager: React.FC = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState('All Donors');
  const [donors, setDonors] = useState<Donor[]>([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const handleFilterChange = (filter: string) => {
    setCurrentFilter(filter);
    setFilterOpen(false);
  };

  const handleImportClick = () => {
    setIsImportModalOpen(true);
  };

  const handleImportComplete = (importedDonors: Donor[]) => {
    // Add unique IDs to imported donors
    const donorsWithIds = importedDonors.map((donor, index) => ({
      ...donor,
      id: `imported-${Date.now()}-${index}`
    }));
    
    setDonors(prev => [...prev, ...donorsWithIds]);
  };

  return (
    <div className="content-body donor-manager-container">
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
        <div className="action-buttons">
          <button className="import-button" onClick={handleImportClick}>
            <FontAwesomeIcon icon={faFileImport} /> Import CSV
          </button>
          <button className="add-button">
            <FontAwesomeIcon icon={faPlus} /> Add Donor
          </button>
        </div>
      </div>

      <div className="donors-container">
        {donors.length === 0 ? (
          // Empty state
          <div className="empty-state">
            <div className="empty-state-icon">
              <FontAwesomeIcon icon={faUsers} />
            </div>
            <h3>No donors yet</h3>
            <p>Add your first donor to start tracking donations and building relationships with your supporters.</p>
            <div className="empty-state-actions">
              <button className="primary-button" onClick={handleImportClick}>
                <FontAwesomeIcon icon={faFileImport} /> Import Donors
              </button>
              <button className="primary-button">
                <FontAwesomeIcon icon={faPlus} /> Add Donor
              </button>
            </div>
          </div>
        ) : (
          // Donor list
          <div className="donor-list">
            <table className="donor-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Location</th>
                  <th>Last Donation</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {donors.map(donor => (
                  <tr key={donor.id}>
                    <td>{donor.firstName} {donor.lastName}</td>
                    <td>{donor.email}</td>
                    <td>{donor.phone || '-'}</td>
                    <td>{donor.city ? `${donor.city}, ${donor.state || ''}` : '-'}</td>
                    <td>{donor.donationDate || '-'}</td>
                    <td className="donor-actions">
                      <button className="action-button">View</button>
                      <button className="action-button">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* CSV Import Modal */}
      <CSVImportModal 
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportComplete={handleImportComplete}
      />
    </div>
  );
};

export default DonorManager;
