import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faFile } from '@fortawesome/free-solid-svg-icons';

interface CSVUploaderProps {
  onFileLoaded: (data: string) => void;
  onError: (error: string) => void;
}

const CSVUploader: React.FC<CSVUploaderProps> = ({ onFileLoaded, onError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      onError('Please upload a valid CSV file');
      return;
    }

    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        onFileLoaded(text);
      }
    };
    reader.onerror = () => {
      onError('Error reading file');
    };
    reader.readAsText(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="csv-uploader">
      <div 
        className={`upload-area ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        
        <FontAwesomeIcon icon={fileName ? faFile : faUpload} size="2x" />
        
        {fileName ? (
          <div className="file-info">
            <p className="file-name">{fileName}</p>
            <p className="file-status">File selected</p>
          </div>
        ) : (
          <div className="upload-instructions">
            <p>Drag and drop a CSV file here</p>
            <p>or</p>
            <button 
              className="upload-button"
              onClick={handleButtonClick}
            >
              Select File
            </button>
            <p className="file-hint">Only CSV files are supported</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CSVUploader;
