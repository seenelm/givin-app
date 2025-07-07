import React, { useState, useEffect } from 'react';
import './styles/DonorManager.css';
import Controls from '../components/controls/Controls';
import Stub from '../components/stub/Stub';
import donorManagerStubProps from '../models/DonationManagerStub';
import { fetchDonors } from '../utils/supabaseClient';

// Update Donor interface to match the actual database schema
interface Donor {
  donorid: string;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  city?: string;
  state?: string;
  tp_guid?: string;
  created_at?: string;
}

const DonorManager: React.FC = () => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDonors = async () => {
      try {
        setLoading(true);
        // Use the new fetchAllDonors function instead of fetchDonors
        const { data, error } = await fetchDonors();
        
        if (error) {
          throw new Error(error);
        }
        
        if (data) {
          console.log('Setting donors data:', data.length, 'records');
          setDonors(data);
        }
      } catch (err) {
        console.error('Failed to load donors:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadDonors();
  }, []);



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
        {loading ? (
          <div className="loading-state">Loading donors...</div>
        ) : error ? (
          <div className="error-state">
            <p>Error loading donors: {error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : donors.length === 0 ? (
          <Stub {...donorManagerStubProps} />
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
                  <th>Donor ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {donors.map(donor => (
                  <tr key={donor.donorid || Math.random().toString()}>
                    <td>{donor.firstname} {donor.lastname}</td>
                    <td>{donor.email}</td>
                    <td>{donor.phone || '-'}</td>
                    <td>{donor.city ? `${donor.city}, ${donor.state || ''}` : '-'}</td>
                    <td>{donor.donorid || '-'}</td>
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
