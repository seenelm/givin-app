import React from 'react';
import type { CSVData } from '../../utils/csvParser';

interface CSVPreviewProps {
  data: CSVData;
  maxRows?: number;
}

const CSVPreview: React.FC<CSVPreviewProps> = ({ data, maxRows = 5 }) => {
  const previewRows = data.rows.slice(0, maxRows);
  
  return (
    <div className="csv-preview">
      <h3>CSV Preview</h3>
      <p className="preview-info">
        Showing {previewRows.length} of {data.rows.length} rows
      </p>
      
      <div className="table-container">
        <table className="preview-table">
          <thead>
            <tr>
              <th>#</th>
              {data.headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {previewRows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="row-number">{rowIndex + 1}</td>
                {data.headers.map((header, colIndex) => (
                  <td key={colIndex}>{row[header]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {data.rows.length > maxRows && (
        <p className="more-rows">
          ...and {data.rows.length - maxRows} more rows
        </p>
      )}
      
      <div className="preview-summary">
        <p>
          <strong>Total rows:</strong> {data.rows.length}
        </p>
        <p>
          <strong>Columns:</strong> {data.headers.length}
        </p>
      </div>
    </div>
  );
};

export default CSVPreview;
