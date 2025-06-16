import React, { useState, useEffect } from 'react';
import './styles/Dashboard.css';
import '../components/styles/DonationMetrics.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRocket,
  faBuilding,
  faFileImport,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import OnboardingModal from '../components/OnboardingModal';
import DonationImportModal from '../components/csv/DonationImportModal';
import DonationMetricsPanel from '../components/DonationMetricsPanel';
import { fetchDonations, type DonationData, initializeDatabase } from '../utils/supabaseClient';
import { type DonationMetrics } from '../utils/openaiClient';

const Dashboard: React.FC = () => {
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [donations, setDonations] = useState<DonationData[]>([]);
  const [metrics, setMetrics] = useState<DonationMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentMetricsView, setCurrentMetricsView] = useState('Donations');

  // Initialize database and fetch existing donations and metrics on component mount
  useEffect(() => {
    const setupAndLoadData = async () => {
      setIsLoading(true);
      
      // First initialize the database
      try {
        const { success, error } = await initializeDatabase();
        if (!success) {
          console.error('Failed to initialize database:', error);
          setDbError(`Database initialization failed: ${error}`);
        } else {
          console.log('Database initialized successfully');
        }
      } catch (err) {
        console.error('Error during database initialization:', err);
        setDbError('Database initialization error');
      }
      
      // Then load donations
      try {
        const { data, error } = await fetchDonations();
        if (error) {
          console.error('Error fetching donations:', error);
        } else if (data && data.length > 0) {
          setDonations(data);
          // If we have metrics in localStorage, use them temporarily while new ones generate
          const savedMetrics = localStorage.getItem('donationMetrics');
          if (savedMetrics) {
            setMetrics(JSON.parse(savedMetrics));
          }
        }
      } catch (err) {
        console.error('Error in donation fetch:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    setupAndLoadData();
  }, []);
  
  const handleOpenOnboardingModal = () => {
    setShowOnboardingModal(true);
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };
  
  const handleCloseOnboardingModal = () => {
    setShowOnboardingModal(false);
    // Re-enable body scrolling when modal is closed
    document.body.style.overflow = 'auto';
  };
  
  const handleOpenImportModal = () => {
    setShowImportModal(true);
    document.body.style.overflow = 'hidden';
  };
  
  const handleCloseImportModal = () => {
    setShowImportModal(false);
    document.body.style.overflow = 'auto';
  };
  
  const handleImportComplete = (importedDonations: DonationData[], generatedMetrics: DonationMetrics | null) => {
    // Update state with new donations and metrics
    setDonations(prev => [...prev, ...importedDonations]);
    
    if (generatedMetrics) {
      setMetrics(generatedMetrics);
      // Save metrics to localStorage for persistence
      localStorage.setItem('donationMetrics', JSON.stringify(generatedMetrics));
    }
    
    // Close the import modal
    handleCloseImportModal();
  };

  const handleMetricsViewChange = (view: string) => {
    setCurrentMetricsView(view);
    setFilterOpen(false);
  };

  // Render content based on state
  const renderContent = () => {
    // Show loading state
    if (isLoading) {
      return (
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      );
    }
    
    // Show database error if there is one
    if (dbError) {
      return (
        <div className="dashboard-error">
          <h2> Service Unavailable </h2>
        </div>
      );
    }
    
    // Show empty state if no donations
    if (donations.length === 0) {
      return (
        <div className="dashboard-empty">
          <div className="empty-state-icon">
            <FontAwesomeIcon icon={faRocket} />
          </div>
          <h2>Welcome to your Giving Dashboard!</h2>
          <p>Get started by importing your donation data or setting up your organization.</p>
          <div className="empty-state-actions">
            <button className="primary-button" onClick={handleOpenImportModal}>
              <FontAwesomeIcon icon={faFileImport} />
              Import Donations
            </button>
            <button className="secondary-button" onClick={handleOpenOnboardingModal}>
              <FontAwesomeIcon icon={faBuilding} />
              Set Up Organization
            </button>
          </div>
        </div>
      );
    }

    // Show dashboard with metrics
    return (
      <div className="dashboard-content">
        <div className="manager-header">
          <h2>Donation Insights</h2>
          <p className="manager-description">Track your giving impact and donor engagement</p>
        </div>
        
        <div className="manager-controls">
          <div className="filter-dropdown">
            <button 
              className="filter-button" 
              onClick={() => setFilterOpen(!filterOpen)}
            >
              {currentMetricsView} <FontAwesomeIcon icon={faChevronDown} />
            </button>
            {filterOpen && (
              <div className="filter-menu">
                <button onClick={() => handleMetricsViewChange('Donations')}>Donations</button>
                <button onClick={() => handleMetricsViewChange('Campaigns')}>Campaigns</button>
                <button onClick={() => handleMetricsViewChange('Donors')}>Donors</button>
                <button onClick={() => handleMetricsViewChange('Impact')}>Impact</button>
              </div>
            )}
          </div>
          <div className="action-buttons">
            <button className="import-button" onClick={handleOpenImportModal}>
              <FontAwesomeIcon icon={faFileImport} /> Import Donations
            </button>
          </div>
        </div>
        
        <DonationMetricsPanel 
          metrics={metrics} 
          isLoading={false} 
        />
      </div>
    );
  };

  return (
    <div className="content-body">
      {renderContent()}
      
      {/* Modals */}
      <OnboardingModal 
        showModal={showOnboardingModal} 
        onClose={handleCloseOnboardingModal} 
      />
      
      <DonationImportModal
        isOpen={showImportModal}
        onClose={handleCloseImportModal}
        onImportComplete={handleImportComplete}
      />
    </div>
  );
};

export default Dashboard;
