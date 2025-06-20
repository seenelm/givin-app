import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faFileImport } from '@fortawesome/free-solid-svg-icons';
import FileUploader from './FileUploader';
import '../styles/CSVImport.css';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (e: React.ChangeEvent<HTMLInputElement>) => void;
  title?: string;
}

const ImportModal: React.FC<ImportModalProps> = ({ 
  isOpen, 
  onClose,
  onImportComplete,
  title = 'Upload File'
}) => {
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileSelected = (fileInputEvent: React.ChangeEvent<HTMLInputElement>) => {
    onImportComplete(fileInputEvent);
    onClose();
  };

  const handleFileError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="modal-overlay">
      <div className="csv-import-modal">
        <div className="modal-header">
          <h2>
            <FontAwesomeIcon icon={faFileImport} className="modal-icon" />
            {title}
          </h2>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        <div className="modal-content">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <FileUploader 
            onFileSelected={handleFileSelected}
            onError={handleFileError}
          />
          
          <div className="modal-footer">
            <button 
              className="secondary-button"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
