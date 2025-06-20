import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faDownload, faEye, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import './styles/DataLibrary.css'
import Controls from '../components/controls/Controls';
import Stub from '../components/stub/Stub';
import dataLibraryStubProps from '../models/DataLibraryStub';
import CSVImportModal from '../components/import/ImportModal';

interface DataFile {
  id: string;
  name: string;
  size: number;
  type: string;
  dateUploaded: Date;
  description?: string;
}

const DataLibrary = () => {
  const [files, setFiles] = useState<DataFile[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Load files from localStorage on component mount
  useEffect(() => {
    const savedFiles = localStorage.getItem('dataLibraryFiles');
    if (savedFiles) {
      try {
        // Parse the dates back to Date objects
        const parsedFiles = JSON.parse(savedFiles, (key, value) => {
          if (key === 'dateUploaded') return new Date(value);
          return value;
        });
        setFiles(parsedFiles);
      } catch (error) {
        console.error('Error loading files from localStorage:', error);
      }
    }
  }, []);

  // Save files to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('dataLibraryFiles', JSON.stringify(files));
  }, [files]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        type: file.type,
        dateUploaded: new Date(),
        description: ''
      }));
      
      setFiles(prev => [...prev, ...newFiles]);
      setShowUploadModal(false);
    }
  };

  const deleteFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
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

      <div className="donors-container">
        {files.length === 0 ? (
          <Stub 
            {...dataLibraryStubProps}
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
                  <th>Type</th>
                  <th>Size</th>
                  <th>Date Uploaded</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {files.map(file => (
                  <tr key={file.id}>
                    <td>{file.name}</td>
                    <td>{file.type.split('/').pop()?.toUpperCase() || 'Unknown'}</td>
                    <td>{formatFileSize(file.size)}</td>
                    <td>{formatDate(file.dateUploaded)}</td>
                    <td className="donor-actions">
                      <button className="action-button view">
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button className="action-button download">
                        <FontAwesomeIcon icon={faDownload} />
                      </button>
                      <button 
                        className="action-button delete"
                        onClick={() => deleteFile(file.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
