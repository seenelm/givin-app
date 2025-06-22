import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { parseCSV, parseMultipleDatasets, hasMultipleDatasets, type CSVData, type MultipleCSVDatasets } from '../../utils/csvParser';
import { storeCSVFile, type CSVFileData } from '../../utils/supabaseClient';
import './CSVUploader.css';

interface CSVUploaderProps {
  onUploadComplete?: (fileData: CSVFileData, csvData: CSVData | MultipleCSVDatasets) => void;
  onError?: (error: string) => void;
  detectMultipleDatasets?: boolean;
}

const CSVUploader: React.FC<CSVUploaderProps> = ({
  onUploadComplete,
  onError,
  detectMultipleDatasets = true
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    // Check if file is CSV
    if (!file.name.toLowerCase().endsWith('.csv')) {
      if (onError) onError('Please upload a CSV file');
      return;
    }
    
    setFileName(file.name);
    setIsUploading(true);
    setProgress(10);
    
    try {
      // Read the file
      const fileContent = await readFileAsText(file);
      setProgress(30);
      
      // Check if the CSV likely contains multiple datasets
      let csvData: CSVData | MultipleCSVDatasets;
      
      if (detectMultipleDatasets && hasMultipleDatasets(fileContent)) {
        // Parse as multiple datasets
        csvData = parseMultipleDatasets(fileContent);
        setProgress(50);
      } else {
        // Parse as a single dataset
        csvData = parseCSV(fileContent);
        setProgress(50);
      }
      
      // Store in Supabase
      const fileData: CSVFileData = {
        name: file.name,
        content: fileContent,
        size: file.size
      };
      
      const { success, data, error } = await storeCSVFile(fileData);
      setProgress(90);
      
      if (!success || error) {
        throw new Error(error || 'Failed to store CSV file');
      }
      
      setProgress(100);
      
      // Call the callback with the stored file data and parsed CSV data
      if (onUploadComplete && data) {
        onUploadComplete(data, csvData);
      }
    } catch (error) {
      console.error('Error uploading CSV:', error);
      if (onError) onError(error instanceof Error ? error.message : 'Failed to upload CSV file');
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  return (
    <div className="csv-uploader">
      <div className="upload-container">
        <input
          type="file"
          id="csv-file-input"
          accept=".csv"
          onChange={handleFileChange}
          disabled={isUploading}
          style={{ display: 'none' }}
        />
        
        <label htmlFor="csv-file-input" className="upload-label">
          {isUploading ? (
            <div className="upload-progress">
              <FontAwesomeIcon icon={faSpinner} spin />
              <div className="progress-info">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="progress-text">
                  {fileName ? `Uploading ${fileName}...` : 'Uploading...'}
                </div>
              </div>
            </div>
          ) : (
            <>
              <FontAwesomeIcon icon={faUpload} size="2x" />
              <span>Select CSV File to Upload</span>
              <span className="upload-hint">or drag and drop here</span>
            </>
          )}
        </label>
      </div>
    </div>
  );
};

export default CSVUploader;
