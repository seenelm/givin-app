import React from 'react';
import './styles/DataLibrary.css';
import DataFlowChart from '../components/dataflow/DataFlowChart';
import { faUsers, faHandHoldingDollar } from '@fortawesome/free-solid-svg-icons';

const DataLibrary: React.FC = () => {
  // Define data sources (payment processors)
  const dataSources = [
    {
      id: 'givebutter',
      name: 'Givebutter',
      description: 'Modern fundraising platform with social sharing',
      color: 'primary'
    },
    {
      id: 'zeffy',
      name: 'Zeffy',
      description: 'Fee-free fundraising platform',
      color: 'info'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Online payment processing',
      color: 'success'
    }
  ];

  // Define data targets (database collections)
  const dataTargets = [
    {
      id: 'donors',
      name: 'Donors',
      description: 'Donor profiles and contact information',
      icon: faUsers
    },
    {
      id: 'gifts',
      name: 'Gifts',
      description: 'Donation transactions and payment details',
      icon: faHandHoldingDollar
    }
  ];

  // Define connections between sources and targets
  const connections = [
    { sourceId: 'givebutter', targetId: 'donors' },
    { sourceId: 'givebutter', targetId: 'gifts' },
    { sourceId: 'zeffy', targetId: 'donors' },
    { sourceId: 'zeffy', targetId: 'gifts' },
    { sourceId: 'paypal', targetId: 'donors' },
    { sourceId: 'paypal', targetId: 'gifts' }
  ];

  return (
    <div className="data-library-container">
      <div className="manager-header">
        <h2>Data Library</h2>
        <p className="manager-description">
          Explore your data sources and how they integrate with your database.
        </p>
      </div>

      <div className="data-library-content">
        <div className="data-library-section">
          <h3 className="section-title">Data Integration Map</h3>
          <DataFlowChart 
            sources={dataSources}
            targets={dataTargets}
            connections={connections}
          />
        </div>

        <div className="data-library-section">
          <h3 className="section-title">Data Sources</h3>
          <div className="data-sources-grid">
            {dataSources.map(source => (
              <div 
                key={source.id} 
                className="data-source-card"
                style={{ 
                  borderTop: `4px solid var(--${source.color}-color)` 
                }}
              >
                <h4 className="data-source-title">{source.name}</h4>
                <p className="data-source-description">{source.description}</p>
                <div className="data-source-stats">
                  <div className="data-stat">
                    <span className="stat-label">Donors</span>
                    <span className="stat-value">--</span>
                  </div>
                  <div className="data-stat">
                    <span className="stat-label">Gifts</span>
                    <span className="stat-value">--</span>
                  </div>
                  <div className="data-stat">
                    <span className="stat-label">Last Sync</span>
                    <span className="stat-value">--</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="data-library-section">
          <h3 className="section-title">Data Collections</h3>
          <div className="data-collections-grid">
            {dataTargets.map(target => (
              <div key={target.id} className="data-collection-card">
                <div className="collection-icon">
                  <i className={`fas fa-${target.icon.iconName}`}></i>
                </div>
                <div className="collection-content">
                  <h4 className="collection-title">{target.name}</h4>
                  <p className="collection-description">{target.description}</p>
                  <div className="collection-stats">
                    <div className="collection-stat">
                      <span className="stat-label">Total Records</span>
                      <span className="stat-value">--</span>
                    </div>
                    <div className="collection-stat">
                      <span className="stat-label">Last Updated</span>
                      <span className="stat-value">--</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataLibrary;
