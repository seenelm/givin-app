import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faEye, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { fetchCSVFiles, storeCSVFile, type CSVFileData } from '../utils/supabaseClient';
import Controls from '../components/controls/Controls';
import Stub from '../components/stub/Stub';
import dataLibraryStubProps from '../models/DataLibraryStub';
import CSVImportModal from '../components/import/ImportModal';
import CSVManager from '../components/csv/CSVManager';
import './styles/DataLibrary.css'

interface CSVFileWithDate extends CSVFileData {
  dateUploaded: Date;
}

const DataLibrary = () => {
  const [csvFiles, setCsvFiles] = useState<CSVFileWithDate[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load files from Supabase on component mount
  useEffect(() => {
    // Load CSV files from Supabase
    loadCSVFiles();
  }, []);

  // Load CSV files from Supabase
  const loadCSVFiles = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await fetchCSVFiles();
      
      if (error) throw new Error(error);
      
      if (data) {
        // Convert to CSVFileWithDate
        const filesWithDates = data.map(file => ({
          ...file,
          dateUploaded: new Date(file.created_at || Date.now())
        }));
        
        setCsvFiles(filesWithDates);
      }
    } catch (err) {
      console.error('Error loading CSV files:', err);
      setError(err instanceof Error ? err.message : 'Failed to load CSV files');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setShowUploadModal(false);
      
      // Upload CSV files to Supabase
      if (e.target.files[0].name.toLowerCase().endsWith('.csv')) {
        try {
          setIsLoading(true);
          const file = e.target.files[0];
          
          // Read the file content
          const reader = new FileReader();
          reader.onload = async (event) => {
            if (event.target?.result) {
              const content = event.target.result as string;
              
              // Prepare CSV file data for Supabase
              const csvFileData = {
                name: file.name,
                content: content,
                size: file.size
              };
              
              // Upload to Supabase
              const { success, error } = await storeCSVFile(csvFileData);
              
              if (!success) {
                console.error('Failed to upload CSV to Supabase:', error);
                setError(`Failed to upload CSV: ${error}`);
              }
              
              // Refresh the list of CSV files
              loadCSVFiles();
            }
          };
          
          reader.readAsText(file);
        } catch (err) {
          console.error('Error uploading CSV file:', err);
          setError(err instanceof Error ? err.message : 'Failed to upload CSV file');
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  const viewCSVFile = (id: string) => {
    setSelectedFileId(id);
  };
  
  const handleBackFromCSVView = () => {
    setSelectedFileId(null);
    // Refresh the list of CSV files
    loadCSVFiles();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="content-body data-library-container">
      {selectedFileId ? (
        <CSVManager 
          fileId={selectedFileId} 
          onBack={handleBackFromCSVView} 
        />
      ) : (
        <>
          <div className="manager-header">
            <h2>Data Library</h2>
            <p className="manager-description">
              Store and manage your organization's data files, documents, and resources.
            </p>
          </div>
          
          <Controls 
            filterOptions={{
              defaultOption: 'All Files',
              options: ['All Files', 'CSV Files', 'Excel Files', 'Recently Uploaded']
            }}
            onFilterChange={(filter) => console.log(`Filter changed to: ${filter}`)}
            onPrimaryAction={() => setShowUploadModal(true)}
          />

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading files...</p>
            </div>
          ) : (
            <div className="data-files-container">
              
              <div className="donors-container">
                {csvFiles.length === 0 ? (
                  <Stub 
                    {...{
                      ...dataLibraryStubProps,
                      stubTitle: "No CSV Files Found",
                      stubDescription: "Upload CSV files to analyze, highlight, and store important data.",
                      primaryButtonText: "Upload CSV"
                    }}
                    onPrimaryAction={() => setShowUploadModal(true)}
                    onSecondaryAction={() => {}}
                    showSecondaryButton={false}
                    secondaryButtonText=""
                    secondaryButtonIcon={faFileAlt}
                  />
                ) : (
                  <div className="donor-list">
                    <table className="donor-table">
                      <thead>
                        <tr>
                          <th>File Name</th>
                          <th>Size</th>
                          <th>Date Uploaded</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {csvFiles.map(file => (
                          <tr key={file.id}>
                            <td>{file.name}</td>
                            <td>{formatFileSize(file.size)}</td>
                            <td>{formatDate(file.dateUploaded)}</td>
                            <td className="donor-actions">
                              <button 
                                className="action-button view"
                                onClick={() => viewCSVFile(file.id || '')}
                                title="View and highlight CSV data"
                              >
                                <FontAwesomeIcon icon={faEye} />
                              </button>
                              <button className="action-button download">
                                <FontAwesomeIcon icon={faDownload} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {showUploadModal && (
        <CSVImportModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onImportComplete={handleFileUpload}
          title="Upload Data Files"
        />
      )}
    </div>
  );
};

export default DataLibrary;
