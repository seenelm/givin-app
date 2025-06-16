import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faFileImport } from '@fortawesome/free-solid-svg-icons';
import CSVUploader from './CSVUploader';
import CSVPreview from './CSVPreview';
import DonationMapper from './DonationMapper';
import ImportSummary, { type ImportResult } from './ImportSummary';
import { parseCSV, type CSVData } from '../../utils/csvParser';
import { type DonationData, storeDonations } from '../../utils/supabaseClient';
import { generateDonationMetrics, type DonationMetrics } from '../../utils/openaiClient';


interface DonationImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (data: DonationData[], metrics: DonationMetrics | null) => void;
}

type ImportStepType = 'upload' | 'preview' | 'map_columns' | 'processing' | 'summary';

const IMPORT_STEPS = {
  UPLOAD: 'upload' as ImportStepType,
  PREVIEW: 'preview' as ImportStepType,
  MAP_COLUMNS: 'map_columns' as ImportStepType,
  PROCESSING: 'processing' as ImportStepType,
  SUMMARY: 'summary' as ImportStepType
};

const DonationImportModal: React.FC<DonationImportModalProps> = ({ 
  isOpen, 
  onClose,
  onImportComplete
}) => {
  const [step, setStep] = useState<ImportStepType>(IMPORT_STEPS.UPLOAD);
  const [csvData, setCsvData] = useState<CSVData | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<DonationMetrics | null>(null);

  if (!isOpen) return null;

  const handleFileLoaded = (csvText: string) => {
    try {
      const parsedData = parseCSV(csvText);
      setCsvData(parsedData);
      setStep(IMPORT_STEPS.PREVIEW);
      setError(null);
    } catch (err) {
      setError(`Error parsing CSV: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleFileError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleMappingComplete = (mapping: Record<string, string>) => {
    setStep(IMPORT_STEPS.PROCESSING);
    
    // Process the import with a slight delay to show the processing state
    setTimeout(() => {
      processImport(mapping);
    }, 1000);
  };

  const processImport = async (mapping: Record<string, string>) => {
    if (!csvData) return;
    
    try {
      // Transform the data according to the mapping
      const transformedData: DonationData[] = csvData.rows.map((row) => {
        // Extract the core fields
        const donation: DonationData = {
          amount: parseFloat(row[mapping.amount]) || 0,
          date: formatDate(row[mapping.date]),
          campaign: row[mapping.campaign] || 'Unknown',
          donor_id: row[mapping.donor_id] || 'unknown',
          metadata: {}
        };
        
        // Add any mapped metadata fields
        Object.entries(mapping).forEach(([fieldId, csvHeader]) => {
          if (!['amount', 'date', 'campaign', 'donor_id'].includes(fieldId) && csvHeader) {
            if (!donation.metadata) donation.metadata = {};
            donation.metadata[fieldId] = row[csvHeader];
          }
        });
        
        return donation;
      });
      
      // Validate the transformed data
      const errors: Array<{ row: number; message: string }> = [];
      const warnings: Array<{ row: number; message: string }> = [];
      
      transformedData.forEach((donation, index) => {
        // Validate amount
        if (isNaN(donation.amount) || donation.amount <= 0) {
          errors.push({
            row: index + 1,
            message: `Invalid donation amount: ${donation.amount}`
          });
        }
        
        // Validate date
        if (!isValidDate(donation.date)) {
          errors.push({
            row: index + 1,
            message: `Invalid date format: ${donation.date}`
          });
        }
        
        // Check for missing campaign
        if (!donation.campaign || donation.campaign === 'Unknown') {
          warnings.push({
            row: index + 1,
            message: 'Missing campaign information'
          });
        }
      });
      
      // Store valid donations in Supabase
      const validDonations = transformedData.filter((_, index) => 
        !errors.some(error => error.row === index + 1)
      );
      
      let supabaseResult: { success: boolean; error: string | null } = { success: true, error: null };
      
      if (validDonations.length > 0) {
        const result = await storeDonations(validDonations);
        supabaseResult = { 
          success: result.success, 
          error: result.error 
        };
      }
      
      // Generate metrics using OpenAI
      let donationMetrics = null;
      if (validDonations.length > 0) {
        donationMetrics = await generateDonationMetrics(validDonations);
        setMetrics(donationMetrics);
      }
      
      // Create import result
      const result: ImportResult = {
        totalRows: csvData.rows.length,
        successCount: validDonations.length,
        errorCount: errors.length,
        warningCount: warnings.length,
        errors,
        warnings,
        additionalInfo: supabaseResult.error 
          ? `Error storing in database: ${supabaseResult.error}` 
          : `Successfully stored ${validDonations.length} donations`
      };
      
      setImportResult(result);
      
      // Move to summary step
      setStep(IMPORT_STEPS.SUMMARY);
      
      // If successful, pass the data and metrics to the parent component
      if (supabaseResult.success && validDonations.length > 0) {
        onImportComplete(validDonations, donationMetrics);
      }
      
    } catch (err) {
      setError(`Error processing import: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setStep(IMPORT_STEPS.MAP_COLUMNS);
    }
  };
  
  // Helper function to format dates to ISO string
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return new Date().toISOString();
    
    // Try to parse the date
    const date = new Date(dateStr);
    
    // Check if valid date
    if (isNaN(date.getTime())) {
      return new Date().toISOString();
    }
    
    return date.toISOString();
  };
  
  // Helper function to validate date
  const isValidDate = (dateStr: string): boolean => {
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
  };

  const handleRetry = () => {
    setStep(IMPORT_STEPS.MAP_COLUMNS);
  };

  const renderStepContent = () => {
    switch (step) {
      case IMPORT_STEPS.UPLOAD:
        return (
          <CSVUploader 
            onFileLoaded={handleFileLoaded}
            onError={handleFileError}
          />
        );
      
      case IMPORT_STEPS.PREVIEW:
        return csvData ? (
          <>
            <CSVPreview data={csvData} />
            <div className="step-actions">
              <button 
                className="secondary-button"
                onClick={() => setStep(IMPORT_STEPS.UPLOAD)}
              >
                Back
              </button>
              <button 
                className="primary-button"
                onClick={() => setStep(IMPORT_STEPS.MAP_COLUMNS)}
              >
                Continue
              </button>
            </div>
          </>
        ) : null;
      
      case IMPORT_STEPS.MAP_COLUMNS:
        return csvData ? (
          <DonationMapper 
            csvHeaders={csvData.headers}
            onMappingComplete={handleMappingComplete}
          />
        ) : null;
      
      case IMPORT_STEPS.PROCESSING:
        return (
          <div className="processing-state">
            <div className="spinner"></div>
            <p>Processing your donation data...</p>
            <p className="processing-detail">This may take a moment as we analyze your data</p>
          </div>
        );
      
      case IMPORT_STEPS.SUMMARY:
        return importResult ? (
          <ImportSummary 
            result={importResult}
            onClose={onClose}
            onRetry={handleRetry}
            additionalInfo={
              metrics ? (
                <div className="metrics-preview">
                  <h4>AI-Generated Insights</h4>
                  <p>We've analyzed your donation data and generated the following insights:</p>
                  <ul className="metrics-list">
                    <li>Total donations: {metrics.totalDonations}</li>
                    <li>Total amount: ${metrics.totalAmount.toFixed(2)}</li>
                    <li>Average donation: ${metrics.averageDonation.toFixed(2)}</li>
                  </ul>
                  <p className="view-dashboard-prompt">
                    View your dashboard for complete metrics and insights.
                  </p>
                </div>
              ) : null
            }
          />
        ) : null;
      
      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="csv-import-modal donation-import-modal">
        <div className="modal-header">
          <h2>
            <FontAwesomeIcon icon={faFileImport} className="header-icon" />
            Import Donation Data
          </h2>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        <div className="modal-progress">
          <div className="progress-step">
            <div className={`step-indicator ${step === IMPORT_STEPS.UPLOAD ? 'active' : step !== IMPORT_STEPS.UPLOAD ? 'completed' : ''}`}>1</div>
            <div className="step-label">Upload CSV</div>
          </div>
          <div className="progress-connector"></div>
          <div className="progress-step">
            <div className={`step-indicator ${step === IMPORT_STEPS.PREVIEW ? 'active' : step !== IMPORT_STEPS.PREVIEW && step !== IMPORT_STEPS.UPLOAD ? 'completed' : ''}`}>2</div>
            <div className="step-label">Preview Data</div>
          </div>
          <div className="progress-connector"></div>
          <div className="progress-step">
            <div className={`step-indicator ${step === IMPORT_STEPS.MAP_COLUMNS ? 'active' : step !== IMPORT_STEPS.MAP_COLUMNS && step !== IMPORT_STEPS.PREVIEW && step !== IMPORT_STEPS.UPLOAD ? 'completed' : ''}`}>3</div>
            <div className="step-label">Map Fields</div>
          </div>
          <div className="progress-connector"></div>
          <div className="progress-step">
            <div className={`step-indicator ${step === IMPORT_STEPS.PROCESSING || step === IMPORT_STEPS.SUMMARY ? 'active' : ''}`}>4</div>
            <div className="step-label">Process</div>
          </div>
        </div>
        
        <div className="modal-content">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
};

export default DonationImportModal;
