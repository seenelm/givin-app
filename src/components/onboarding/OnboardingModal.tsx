import React, { useState } from 'react';
import '../../pages/styles/Dashboard.css';

// Types of organizations
const organizationTypes = [
  'Religious Organization',
  'Educational Institution',
  'Human Services',
  'Health Organization',
  'Environmental',
  'Arts & Culture',
  'Animal Welfare',
  'International Development',
  'Community Foundation',
  'Other'
];

interface OnboardingModalProps {
  showModal: boolean;
  onClose: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ showModal, onClose }) => {
  // Step 1: EIN
  const [ein, setEin] = useState<string>('');
  const [einError, setEinError] = useState<string>('');
  
  // Step 2: Fundraising goal
  const [fundraisingGoal, setFundraisingGoal] = useState<string>('');
  const [fundraisingGoalError, setFundraisingGoalError] = useState<string>('');
  
  // Step 3: Organization type
  const [orgType, setOrgType] = useState<string>('');
  const [orgTypeError, setOrgTypeError] = useState<string>('');
  
  // Navigation
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps: number = 3; // Three questions: EIN, fundraising goal, org type
  
  const handleCloseModal = () => {
    onClose();
    // Reset all state when modal is closed
    setEin('');
    setEinError('');
    setFundraisingGoal('');
    setFundraisingGoalError('');
    setOrgType('');
    setOrgTypeError('');
    setCurrentStep(1);
  };
  
  // Input handlers
  const handleEinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEin(value);
    if (einError) setEinError('');
  };
  
  const handleFundraisingGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-numeric characters except decimal point
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setFundraisingGoal(value);
    if (fundraisingGoalError) setFundraisingGoalError('');
  };
  
  const handleOrgTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setOrgType(value);
    if (orgTypeError) setOrgTypeError('');
  };
  
  // Navigation handlers
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const handleContinue = () => {
    // Validate based on current step
    switch (currentStep) {
      case 1: // EIN validation
        if (!ein.trim()) {
          setEinError('Please enter your organization\'s EIN');
          return;
        }
        
        // Basic EIN format validation (9 digits, can be formatted as XX-XXXXXXX)
        const einRegex = /^\d{2}-?\d{7}$/;
        if (!einRegex.test(ein)) {
          setEinError('Please enter a valid 9-digit EIN (format: XX-XXXXXXX)');
          return;
        }
        break;
        
      case 2: // Fundraising goal validation
        if (!fundraisingGoal.trim()) {
          setFundraisingGoalError('Please enter your fundraising goal');
          return;
        }
        
        const goalAmount = parseFloat(fundraisingGoal);
        if (isNaN(goalAmount) || goalAmount <= 0) {
          setFundraisingGoalError('Please enter a valid amount');
          return;
        }
        break;
        
      case 3: // Organization type validation
        if (!orgType) {
          setOrgTypeError('Please select your organization type');
          return;
        }
        break;
    }
    
    // If we're on the last step, submit the form
    if (currentStep >= totalSteps) {
      // Here you would handle the form submission with all collected data
      console.log('Form submitted:', { ein, fundraisingGoal, orgType });
      handleCloseModal();
      return;
    }
    
    // Otherwise, proceed to next step
    setCurrentStep(prev => prev + 1);
  };

  if (!showModal) return null;

  // Render different content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="question-container">
            <h2>What is your organization's EIN?</h2>
            
            <div className="input-container">
              <label htmlFor="ein">EIN</label>
              <input 
                type="text" 
                id="ein" 
                placeholder="XX-XXXXXXX"
                value={ein}
                onChange={handleEinChange}
                className={einError ? 'error' : ''}
              />
              {einError ? (
                <p className="input-error">{einError}</p>
              ) : (
                <p className="input-help">Please enter your 9-digit Employer Identification Number</p>
              )}
            </div>
            
            {/* Navigation buttons moved inside each question container */}
            <div className="navigation-buttons">
              {currentStep > 1 && (
                <button className="back-button" onClick={handleBack}>
                  Back
                </button>
              )}
              
              <button className="continue-button" onClick={handleContinue}>
                {currentStep === totalSteps ? 'Submit' : 'Continue'}
              </button>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="question-container">
            <h2>What is your fundraising goal for 2025?</h2>
            
            <div className="input-container">
              <label htmlFor="fundraisingGoal">Fundraising Goal ($)</label>
              <input 
                type="text" 
                id="fundraisingGoal" 
                placeholder="100000"
                value={fundraisingGoal}
                onChange={handleFundraisingGoalChange}
                className={fundraisingGoalError ? 'error' : ''}
              />
              {fundraisingGoalError ? (
                <p className="input-error">{fundraisingGoalError}</p>
              ) : (
                <p className="input-help">Enter your organization's fundraising target for 2025</p>
              )}
            </div>
            
            {/* Navigation buttons moved inside each question container */}
            <div className="navigation-buttons">
              {currentStep > 1 && (
                <button className="back-button" onClick={handleBack}>
                  Back
                </button>
              )}
              
              <button className="continue-button" onClick={handleContinue}>
                {currentStep === totalSteps ? 'Submit' : 'Continue'}
              </button>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="question-container">
            <h2>What type of organization are you?</h2>
            
            <div className="input-container">
              <label htmlFor="orgType">Organization Type</label>
              <select
                id="orgType"
                value={orgType}
                onChange={handleOrgTypeChange}
                className={orgTypeError ? 'error' : ''}
              >
                <option value="">Select organization type</option>
                {organizationTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {orgTypeError ? (
                <p className="input-error">{orgTypeError}</p>
              ) : (
                <p className="input-help">Select the category that best describes your organization</p>
              )}
            </div>
            
            {/* Navigation buttons moved inside each question container */}
            <div className="navigation-buttons">
              {currentStep > 1 && (
                <button className="back-button" onClick={handleBack}>
                  Back
                </button>
              )}
              
              <button className="continue-button" onClick={handleContinue}>
                {currentStep === totalSteps ? 'Submit' : 'Continue'}
              </button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (!showModal) return null;

  return (
    <div className="full-page-modal">
      <div className="modal-content">
        {/* Close button in corner */}
        <button className="close-modal-button" onClick={handleCloseModal}>
          &times;
        </button>
        
        {/* Progress bar at top */}
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${(currentStep / totalSteps) * 100}%` }}></div>
        </div>
        
        {/* Dynamic step content */}
        {renderStepContent()}
      </div>
    </div>
  );
};

export default OnboardingModal;
