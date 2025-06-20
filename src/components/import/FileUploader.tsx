import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faFile } from '@fortawesome/free-solid-svg-icons';

interface FileUploaderProps {
  onFileSelected: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onError: (error: string) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelected, onError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Supported file extensions
  const supportedFormats = ['.csv', '.pdf', '.docx', '.txt', '.xlsx', '.xls'];
  const acceptString = supportedFormats.join(',');

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
      processFile(file, e);
    }
  };

  const processFile = (file: File, event?: React.ChangeEvent<HTMLInputElement>) => {
    // Check if the file extension is supported
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!supportedFormats.includes(fileExtension)) {
      onError(`Unsupported file format. Please upload one of the following formats: ${supportedFormats.join(', ')}`);
      return;
    }

    setFileName(file.name);
    
    if (event) {
      onFileSelected(event);
    } else {
      // If no event is available (e.g., from drag and drop)
      // Create a synthetic event with the file
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      
      const syntheticEvent = {
        target: {
          files: dataTransfer.files
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      onFileSelected(syntheticEvent);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="file-uploader">
      <div 
        className={`upload-area ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={acceptString}
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
            <p>Drag and drop a file here</p>
            <p>or</p>
            <button 
              className="upload-button"
              onClick={handleButtonClick}
            >
              Select File
            </button>
            <p className="file-hint">
              Supported formats: CSV, PDF, DOCX, TXT, XLSX, XLS
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
