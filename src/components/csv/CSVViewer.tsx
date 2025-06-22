import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { type CSVData } from '../../utils/csvParser';
import { type CSVUserPreference, storeCSVUserPreference } from '../../utils/supabaseClient';
import './CSVViewer.css';

interface CSVViewerProps {
  csvData: CSVData;
  fileId?: string;
  initialPreferences?: CSVUserPreference;
  onPreferencesChange?: (preferences: CSVUserPreference) => void;
}

const CSVViewer: React.FC<CSVViewerProps> = ({
  csvData,
  fileId,
  initialPreferences,
  onPreferencesChange
}) => {
  const [highlightedRows, setHighlightedRows] = useState<number[]>(initialPreferences?.highlighted_rows || []);
  const [highlightedColumns, setHighlightedColumns] = useState<string[]>(initialPreferences?.highlighted_columns || []);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  useEffect(() => {
    if (initialPreferences) {
      setHighlightedRows(initialPreferences.highlighted_rows || []);
      setHighlightedColumns(initialPreferences.highlighted_columns || []);
    }
  }, [initialPreferences]);

  const toggleRowHighlight = async (rowIndex: number) => {
    let newHighlightedRows: number[];
    
    if (highlightedRows.includes(rowIndex)) {
      newHighlightedRows = highlightedRows.filter(index => index !== rowIndex);
    } else {
      newHighlightedRows = [...highlightedRows, rowIndex];
    }
    
    setHighlightedRows(newHighlightedRows);
    savePreferences(newHighlightedRows, highlightedColumns);
  };
  
  const toggleColumnHighlight = async (columnName: string) => {
    let newHighlightedColumns: string[];
    
    if (highlightedColumns.includes(columnName)) {
      newHighlightedColumns = highlightedColumns.filter(name => name !== columnName);
    } else {
      newHighlightedColumns = [...highlightedColumns, columnName];
    }
    
    setHighlightedColumns(newHighlightedColumns);
    savePreferences(highlightedRows, newHighlightedColumns);
  };
  
  const savePreferences = async (rows: number[], columns: string[]) => {
    if (!fileId) return;
    
    setIsLoading(true);
    
    try {
      const preferences: CSVUserPreference = {
        file_id: fileId,
        highlighted_rows: rows,
        highlighted_columns: columns
      };
      
      const { success, data } = await storeCSVUserPreference(preferences);
      
      if (success && data && onPreferencesChange) {
        onPreferencesChange(data);
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="csv-viewer">
      {isLoading && <div className="csv-loading-overlay">Saving preferences...</div>}
      
      <div className="csv-table-container">
        <table className="csv-table">
          <thead>
            <tr>
              <th className="row-highlight-cell"></th>
              {csvData.headers.map((header, index) => (
                <th 
                  key={index} 
                  className={highlightedColumns.includes(header) ? 'highlighted-column' : ''}
                >
                  <div className="header-content">
                    <span>{header}</span>
                    <button 
                      className="highlight-button"
                      onClick={() => toggleColumnHighlight(header)}
                      title={highlightedColumns.includes(header) ? 'Remove highlight' : 'Highlight column'}
                    >
                      <FontAwesomeIcon 
                        icon={highlightedColumns.includes(header) ? fasStar : farStar} 
                        className={highlightedColumns.includes(header) ? 'highlighted' : ''}
                      />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {csvData.rows.map((row, rowIndex) => (
              <tr 
                key={rowIndex}
                className={highlightedRows.includes(rowIndex) ? 'highlighted-row' : ''}
              >
                <td className="row-highlight-cell">
                  <button 
                    className="highlight-button"
                    onClick={() => toggleRowHighlight(rowIndex)}
                    title={highlightedRows.includes(rowIndex) ? 'Remove highlight' : 'Highlight row'}
                  >
                    <FontAwesomeIcon 
                      icon={highlightedRows.includes(rowIndex) ? fasStar : farStar} 
                      className={highlightedRows.includes(rowIndex) ? 'highlighted' : ''}
                    />
                  </button>
                </td>
                {csvData.headers.map((header, colIndex) => (
                  <td 
                    key={colIndex}
                    className={highlightedColumns.includes(header) ? 'highlighted-column' : ''}
                  >
                    {row[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="csv-stats">
        <div className="stat-item">
          <span className="stat-label">Total Rows:</span>
          <span className="stat-value">{csvData.rows.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Total Columns:</span>
          <span className="stat-value">{csvData.headers.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Highlighted Rows:</span>
          <span className="stat-value">{highlightedRows.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Highlighted Columns:</span>
          <span className="stat-value">{highlightedColumns.length}</span>
        </div>
      </div>
    </div>
  );
};

export default CSVViewer;
