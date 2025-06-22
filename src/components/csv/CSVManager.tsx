import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTable, faChevronLeft, faDownload } from '@fortawesome/free-solid-svg-icons';
import { type CSVData, parseCSV, convertToCSV, type MultipleCSVDatasets, parseMultipleDatasets, hasMultipleDatasets } from '../../utils/csvParser';
import { 
  type CSVFileData, 
  type CSVUserPreference, 
  fetchCSVFileById, 
  fetchCSVUserPreference 
} from '../../utils/supabaseClient';
import CSVUploader from './CSVUploader';
import CSVViewer from './CSVViewer';
import './CSVManager.css';

interface CSVManagerProps {
  fileId?: string;
  onBack?: () => void;
}

const CSVManager: React.FC<CSVManagerProps> = ({ fileId, onBack }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [csvData, setCSVData] = useState<CSVData | null>(null);
  const [multipleDatasets, setMultipleDatasets] = useState<MultipleCSVDatasets | null>(null);
  const [hasMultipleSheets, setHasMultipleSheets] = useState<boolean>(false);
  const [activeDatasetIndex, setActiveDatasetIndex] = useState<number>(0);
  const [fileData, setFileData] = useState<CSVFileData | null>(null);
  const [userPreference, setUserPreference] = useState<CSVUserPreference | null>(null);
  const [showUploader, setShowUploader] = useState<boolean>(!fileId);

  useEffect(() => {
    if (fileId) {
      loadCSVFile(fileId);
    } else {
      setShowUploader(true);
    }
  }, [fileId]);

  const loadCSVFile = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch file data
      const { data: file, error: fileError } = await fetchCSVFileById(id);
      
      if (fileError || !file) {
        throw new Error(fileError || 'Failed to load CSV file');
      }
      
      setFileData(file);
      
      // Check if the CSV contains multiple datasets
      const hasMultiple = hasMultipleDatasets(file.content);
      setHasMultipleSheets(hasMultiple);
      
      if (hasMultiple) {
        // Parse as multiple datasets
        const parsedMultipleData = parseMultipleDatasets(file.content);
        setMultipleDatasets(parsedMultipleData);
        
        // Set the first dataset as active
        if (parsedMultipleData.datasets.length > 0) {
          setCSVData(parsedMultipleData.datasets[0]);
        }
      } else {
        // Parse as a single dataset
        const parsedData = parseCSV(file.content);
        setCSVData(parsedData);
      }
      
      // Fetch user preferences
      const { data: preferences } = await fetchCSVUserPreference(id);
      if (preferences) {
        setUserPreference(preferences);
      }
      
      setShowUploader(false);
    } catch (err) {
      console.error('Error loading CSV file:', err);
      setError(err instanceof Error ? err.message : 'Failed to load CSV file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadComplete = (file: CSVFileData, data: CSVData | MultipleCSVDatasets) => {
    setFileData(file);
    
    if ('datasets' in data) {
      // It's multiple datasets
      setMultipleDatasets(data);
      setHasMultipleSheets(true);
      if (data.datasets.length > 0) {
        setCSVData(data.datasets[0]);
      }
    } else {
      // It's a single dataset
      setCSVData(data);
      setHasMultipleSheets(false);
    }
    
    setShowUploader(false);
  };

  const handleUploadError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handlePreferencesChange = (preferences: CSVUserPreference) => {
    setUserPreference(preferences);
  };

  const handleDatasetChange = (index: number) => {
    if (multipleDatasets && index >= 0 && index < multipleDatasets.datasets.length) {
      setActiveDatasetIndex(index);
      setCSVData(multipleDatasets.datasets[index]);
    }
  };

  const handleDownload = () => {
    if (!csvData || !fileData) return;
    
    // Create filtered CSV based on preferences
    let dataToDownload = csvData;
    
    if (userPreference) {
      // Filter by highlighted columns if any
      if (userPreference.highlighted_columns.length > 0) {
        const filteredHeaders = csvData.headers.filter(header => 
          userPreference.highlighted_columns.includes(header)
        );
        
        const filteredRows = csvData.rows.map(row => {
          const filteredRow: Record<string, string> = {};
          filteredHeaders.forEach(header => {
            filteredRow[header] = row[header];
          });
          return filteredRow;
        });
        
        dataToDownload = {
          headers: filteredHeaders,
          rows: filteredRows,
          rawData: [filteredHeaders, ...filteredRows.map(row => filteredHeaders.map(h => row[h]))]
        };
      }
      
      // Filter by highlighted rows if any
      if (userPreference.highlighted_rows.length > 0) {
        dataToDownload = {
          ...dataToDownload,
          rows: dataToDownload.rows.filter((_, index) => 
            userPreference.highlighted_rows.includes(index)
          ),
          rawData: [
            dataToDownload.headers,
            ...userPreference.highlighted_rows.map(index => 
              dataToDownload.headers.map(h => dataToDownload.rows[index][h])
            )
          ]
        };
      }
    }
    
    // Convert to CSV string
    const csvString = convertToCSV(dataToDownload);
    
    // Create download link
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `highlighted_${fileData.name}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="csv-manager">
      <div className="csv-manager-header">
        {onBack && (
          <button className="back-button" onClick={onBack}>
            <FontAwesomeIcon icon={faChevronLeft} /> Back
          </button>
        )}
        
        <h2 className={hasMultipleSheets ? 'has-multiple-sheets' : ''}>
          <FontAwesomeIcon icon={faTable} className="header-icon" />
          {fileData ? fileData.name : 'CSV Manager'}
        </h2>
        
        {fileData && csvData && userPreference && (
          userPreference.highlighted_rows.length > 0 || userPreference.highlighted_columns.length > 0
        ) && (
          <button className="download-button" onClick={handleDownload}>
            <FontAwesomeIcon icon={faDownload} /> Download Highlighted Data
          </button>
        )}
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading CSV data...</p>
        </div>
      ) : showUploader ? (
        <CSVUploader 
          onUploadComplete={handleUploadComplete}
          onError={handleUploadError}
        />
      ) : (
        <>
          {hasMultipleSheets && multipleDatasets && (
            <div className="dataset-tabs">
              {multipleDatasets.datasets.map((_, index) => (
                <button
                  key={index}
                  className={`dataset-tab ${index === activeDatasetIndex ? 'active' : ''}`}
                  onClick={() => handleDatasetChange(index)}
                >
                  Sheet {index + 1}
                </button>
              ))}
            </div>
          )}
          
          {csvData && fileData && (
            <CSVViewer 
              csvData={csvData}
              fileId={fileData.id}
              initialPreferences={userPreference || undefined}
              onPreferencesChange={handlePreferencesChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default CSVManager;
