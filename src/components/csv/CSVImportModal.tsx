import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faFileImport } from '@fortawesome/free-solid-svg-icons';
import CSVUploader from './CSVUploader';
import CSVPreview from './CSVPreview';
import ColumnMapper from './ColumnMapper';
import ImportSummary, { type ImportResult } from './ImportSummary';
import { parseCSV, type CSVData } from '../../utils/csvParser';

interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (data: any[]) => void;
}

type ImportStepType = 'upload' | 'preview' | 'map_columns' | 'processing' | 'summary';

const IMPORT_STEPS = {
  UPLOAD: 'upload' as ImportStepType,
  PREVIEW: 'preview' as ImportStepType,
  MAP_COLUMNS: 'map_columns' as ImportStepType,
  PROCESSING: 'processing' as ImportStepType,
  SUMMARY: 'summary' as ImportStepType
};

const CSVImportModal: React.FC<CSVImportModalProps> = ({ 
  isOpen, 
  onClose,
  onImportComplete
}) => {
  const [step, setStep] = useState<ImportStepType>(IMPORT_STEPS.UPLOAD);
  const [csvData, setCsvData] = useState<CSVData | null>(null);
  //const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    //setColumnMapping(mapping);
    setStep(IMPORT_STEPS.PROCESSING);
    
    // Process the import with a slight delay to show the processing state
    setTimeout(() => {
      processImport(mapping);
    }, 1000);
  };

  const processImport = (mapping: Record<string, string>) => {
    if (!csvData) return;
    
    try {
      // Transform the data according to the mapping
      const transformedData = csvData.rows.map((row) => {
        const transformedRow: Record<string, any> = {};
        
        // Apply the mapping
        Object.entries(mapping).forEach(([fieldId, csvHeader]) => {
          transformedRow[fieldId] = row[csvHeader];
        });
        
        return transformedRow;
      });
      
      // Simulate validation and processing
      const errors: Array<{ row: number; message: string }> = [];
      const warnings: Array<{ row: number; message: string }> = [];
      
      // Example validation: check if email is valid
      transformedData.forEach((row, index) => {
        if (row.email && !isValidEmail(row.email)) {
          errors.push({
            row: index + 1,
            message: `Invalid email format: ${row.email}`
          });
        }
        
        // Example warning: missing optional fields
        if (!row.phone) {
          warnings.push({
            row: index + 1,
            message: 'Phone number is missing'
          });
        }
      });
      
      // Create import result
      const result: ImportResult = {
        totalRows: csvData.rows.length,
        successCount: csvData.rows.length - errors.length,
        errorCount: errors.length,
        warningCount: warnings.length,
        errors,
        warnings
      };
      
      setImportResult(result);
      
      // If no errors, pass the transformed data to the parent component
      if (errors.length === 0) {
        onImportComplete(transformedData);
      }
      
      // Move to summary step
      setStep(IMPORT_STEPS.SUMMARY);
      
    } catch (err) {
      setError(`Error processing import: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setStep(IMPORT_STEPS.MAP_COLUMNS);
    }
  };
  
  const isValidEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
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
          <ColumnMapper 
            csvHeaders={csvData.headers}
            onMappingComplete={handleMappingComplete}
          />
        ) : null;
      
      case IMPORT_STEPS.PROCESSING:
        return (
          <div className="processing-state">
            <div className="spinner"></div>
            <p>Processing your import...</p>
          </div>
        );
      
      case IMPORT_STEPS.SUMMARY:
        return importResult ? (
          <ImportSummary 
            result={importResult}
            onClose={onClose}
            onRetry={handleRetry}
          />
        ) : null;
      
      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="csv-import-modal">
        <div className="modal-header">
          <h2>
            <FontAwesomeIcon icon={faFileImport} /> Import Donors
          </h2>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        <div className="modal-body">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <div className="import-steps">
            <div className={`step ${step === IMPORT_STEPS.UPLOAD ? 'active' : ''} ${step !== IMPORT_STEPS.UPLOAD && 'completed'}`}>
              1. Upload CSV
            </div>
            <div className={`step ${step === IMPORT_STEPS.PREVIEW ? 'active' : ''} ${step !== IMPORT_STEPS.UPLOAD && step !== IMPORT_STEPS.PREVIEW ? 'completed' : ''}`}>
              2. Preview Data
            </div>
            <div className={`step ${step === IMPORT_STEPS.MAP_COLUMNS ? 'active' : ''} ${step === IMPORT_STEPS.PROCESSING || step === IMPORT_STEPS.SUMMARY ? 'completed' : ''}`}>
              3. Map Columns
            </div>
            <div className={`step ${step === IMPORT_STEPS.SUMMARY ? 'active' : ''}`}>
              4. Complete
            </div>
          </div>
          
          <div className="step-content">
            {renderStepContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSVImportModal;
