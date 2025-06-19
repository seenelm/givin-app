import React, { useState } from 'react';
import './styles/FundraisingManager.css';
// import './styles/Dashboard.css';
import Controls from '../components/controls/Controls';
import Stub from '../components/stub/Stub';
import fundraisingManagerStubProps from '../models/FundraisingManagerStub';

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
  const [campaigns] = useState<Campaign[]>([]);

  return (
    <div className="content-body fundraising-manager-container">
      <div className="manager-header">
        <h2>Fundraising Manager</h2>
        <p className="manager-description">
          Organize your fundraising campaigns, track donations, and manage donor relationships.
        </p>
      </div>

      <Controls
        filterOptions={{
          defaultOption: 'All Campaigns',
          options: ['All Campaigns', 'Active', 'Upcoming', 'Completed']
        }}
        onFilterChange={(option) => console.log(`Filter changed to: ${option}`)}
        onPrimaryAction={() => console.log('Create campaign')}
      />

      <div className="campaigns-container">
        {campaigns.length === 0 ? (
          // Empty state
          <Stub {...fundraisingManagerStubProps} />
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
