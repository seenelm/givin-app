import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

export interface ImportResult {
  totalRows: number;
  successCount: number;
  errorCount: number;
  warningCount: number;
  errors?: Array<{
    row: number;
    message: string;
  }>;
  warnings?: Array<{
    row: number;
    message: string;
  }>;
  additionalInfo?: string;
}

interface ImportSummaryProps {
  result: ImportResult;
  onClose: () => void;
  onRetry?: () => void;
  additionalInfo?: React.ReactNode;
}

const ImportSummary: React.FC<ImportSummaryProps> = ({ 
  result, 
  onClose, 
  onRetry,
  additionalInfo
}) => {
  const isSuccess = result.errorCount === 0;
  const hasWarnings = result.warningCount > 0;
  
  return (
    <div className="import-summary">
      <div className={`summary-header ${isSuccess ? 'success' : 'error'}`}>
        {isSuccess ? (
          <FontAwesomeIcon icon={faCheckCircle} size="2x" />
        ) : (
          <FontAwesomeIcon icon={faTimesCircle} size="2x" />
        )}
        
        <h3>
          {isSuccess 
            ? 'Import Completed Successfully' 
            : 'Import Completed with Errors'}
        </h3>
      </div>
      
      <div className="summary-stats">
        <div className="stat-item">
          <span className="stat-label">Total Rows:</span>
          <span className="stat-value">{result.totalRows}</span>
        </div>
        
        <div className="stat-item success">
          <span className="stat-label">Successfully Imported:</span>
          <span className="stat-value">{result.successCount}</span>
        </div>
        
        {result.errorCount > 0 && (
          <div className="stat-item error">
            <span className="stat-label">Failed:</span>
            <span className="stat-value">{result.errorCount}</span>
          </div>
        )}
        
        {result.warningCount > 0 && (
          <div className="stat-item warning">
            <span className="stat-label">Warnings:</span>
            <span className="stat-value">{result.warningCount}</span>
          </div>
        )}
      </div>
      
      {/* Display errors if any */}
      {result.errorCount > 0 && result.errors && (
        <div className="error-list">
          <h4>Errors</h4>
          <ul>
            {result.errors.map((error, index) => (
              <li key={`error-${index}`} className="error-item">
                <FontAwesomeIcon icon={faTimesCircle} />
                <span>Row {error.row}: {error.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Display warnings if any */}
      {hasWarnings && result.warnings && (
        <div className="warning-list">
          <h4>Warnings</h4>
          <ul>
            {result.warnings.map((warning, index) => (
              <li key={`warning-${index}`} className="warning-item">
                <FontAwesomeIcon icon={faExclamationTriangle} />
                <span>Row {warning.row}: {warning.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Render additional info if provided */}
      {additionalInfo && (
        <div className="additional-info">
          {additionalInfo}
        </div>
      )}
      
      <div className="summary-actions">
        {!isSuccess && onRetry && (
          <button className="secondary-button" onClick={onRetry}>
            Retry Import
          </button>
        )}
        
        <button 
          className={isSuccess ? "primary-button" : "secondary-button"} 
          onClick={onClose}
        >
          {isSuccess ? "Done" : "Close"}
        </button>
      </div>
    </div>
  );
};

export default ImportSummary;
