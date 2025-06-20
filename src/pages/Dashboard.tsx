import React, { useState, useEffect } from 'react';
import './styles/Dashboard.css';
import '../components/styles/DonationMetrics.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRocket,
  faBuilding,
} from '@fortawesome/free-solid-svg-icons';
import OnboardingModal from '../components/onboarding/OnboardingModal';
import { initializeDatabase } from '../utils/supabaseClient';

const Dashboard: React.FC = () => {
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

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
      
      setIsLoading(false);
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
      return (
        <div className="dashboard-empty">
          <div className="empty-state-icon">
            <FontAwesomeIcon icon={faRocket} />
          </div>
          <h2>Welcome to Givin AI!</h2>
          <p>Get started by importing your donation data or setting up your organization.</p>
          <div className="empty-state-actions">
            {/* <button className="primary-button" onClick={handleOpenImportModal}>
              <FontAwesomeIcon icon={faFileImport} />
              Import Donations
            </button> */}
            <button className="secondary-button" onClick={handleOpenOnboardingModal}>
              <FontAwesomeIcon icon={faBuilding} />
              Set Up Organization
            </button>
          </div>
        </div>
      );
    }


  return (
    <div className="content-body">
      {renderContent()}
      
      {/* Modals */}
      <OnboardingModal 
        showModal={showOnboardingModal} 
        onClose={handleCloseOnboardingModal} 
      />
    </div>
  );
};

export default Dashboard;
