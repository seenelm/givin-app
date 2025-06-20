import React, { useState } from 'react';
import './styles/DonorManager.css';
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
  const [donors] = useState<Donor[]>([]);

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
      />

      <div className="donors-container">
        {donors.length === 0 ? (
          // Empty state
          <Stub 
            {...donorManagerStubProps}
            onPrimaryAction={() => console.log('Add donor clicked')}
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
    </div>
  );
};

export default DonorManager;
