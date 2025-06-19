import React, { useState } from 'react';
import './styles/DonorManager.css';
import CSVImportModal from '../components/csv/CSVImportModal';
import '../components/csv/CSVImport.css';
import Controls from '../components/controls/Controls';
import Stub from '../components/stub/Stub';
import donorManagerStubProps from '../models/DonationManagerStub';

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
  const [donors, setDonors] = useState<Donor[]>([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

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

      <Controls
        filterOptions={{
          defaultOption: 'All Donors',
          options: ['All Donors', 'Recent', 'Top Donors', 'Inactive']
        }}
        onPrimaryAction={() => setIsImportModalOpen(true)}
      />

      <div className="donors-container">
        {donors.length === 0 ? (
          // Empty state
          <Stub 
            {...donorManagerStubProps}
            onPrimaryAction={() => setIsImportModalOpen(true)}
            onSecondaryAction={() => console.log('Add donor clicked')}
          />
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
