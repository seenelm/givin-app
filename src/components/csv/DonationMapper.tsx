import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt, faCheck } from '@fortawesome/free-solid-svg-icons';
// import type { DonationData } from '../../utils/supabaseClient';

interface DonationMapperProps {
  csvHeaders: string[];
  onMappingComplete: (mapping: Record<string, string>) => void;
}

// These match our target donation data structure
const DONATION_FIELDS = [
  { id: 'amount', label: 'Amount', required: true, type: 'number' },
  { id: 'date', label: 'Date', required: true, type: 'date' },
  { id: 'campaign', label: 'Campaign', required: true, type: 'string' },
  { id: 'donor_id', label: 'Donor ID', required: true, type: 'string' },
  // Add any additional metadata fields you want to suggest
  { id: 'donor_name', label: 'Donor Name', required: false, type: 'string', isMetadata: true },
  { id: 'donor_email', label: 'Donor Email', required: false, type: 'string', isMetadata: true },
  { id: 'payment_method', label: 'Payment Method', required: false, type: 'string', isMetadata: true },
  { id: 'notes', label: 'Notes', required: false, type: 'string', isMetadata: true },
];

const DonationMapper: React.FC<DonationMapperProps> = ({ csvHeaders, onMappingComplete }) => {
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [autoMapped, setAutoMapped] = useState(false);

  // Try to automatically map columns based on name similarity
  useEffect(() => {
    if (!autoMapped && csvHeaders.length > 0) {
      const initialMapping: Record<string, string> = {};
      
      DONATION_FIELDS.forEach(field => {
        // Look for exact or similar matches
        const matchedHeader = csvHeaders.find(header => {
          const normalizedHeader = header.toLowerCase().replace(/[_\s-]/g, '');
          const normalizedField = field.id.toLowerCase();
          const normalizedLabel = field.label.toLowerCase().replace(/[_\s-]/g, '');
          
          return (
            normalizedHeader === normalizedField ||
            normalizedHeader === normalizedLabel ||
            normalizedHeader.includes(normalizedField) ||
            normalizedField.includes(normalizedHeader)
          );
        });
        
        if (matchedHeader) {
          initialMapping[field.id] = matchedHeader;
        }
      });
      
      setMapping(initialMapping);
      setAutoMapped(true);
    }
  }, [csvHeaders, autoMapped]);

  const handleMappingChange = (fieldId: string, csvHeader: string) => {
    setMapping(prev => ({
      ...prev,
      [fieldId]: csvHeader
    }));
  };

  const isValidMapping = () => {
    // Check if all required fields are mapped
    return DONATION_FIELDS.filter(field => field.required)
      .every(field => mapping[field.id]);
  };

  const handleSubmit = () => {
    if (isValidMapping()) {
      onMappingComplete(mapping);
    }
  };

  return (
    <div className="column-mapper">
      <h3>Map CSV Columns to Donation Fields</h3>
      <p className="mapper-description">
        Match your CSV columns to the appropriate donation fields. Required fields are marked with an asterisk (*).
      </p>
      
      <div className="mapping-container">
        {DONATION_FIELDS.map(field => (
          <div key={field.id} className="field-mapping-row">
            <div className="field-info">
              <label>
                {field.label}{field.required && <span className="required">*</span>}
                {field.isMetadata && <span className="metadata-tag">metadata</span>}
              </label>
              <small>{field.type}</small>
            </div>
            
            <div className="mapping-arrow">
              <FontAwesomeIcon icon={faExchangeAlt} />
            </div>
            
            <div className="csv-field-selector">
              <select
                value={mapping[field.id] || ''}
                onChange={(e) => handleMappingChange(field.id, e.target.value)}
                className={field.required && !mapping[field.id] ? 'required-missing' : ''}
              >
                <option value="">-- Select CSV Column --</option>
                {csvHeaders.map((header, index) => (
                  <option key={index} value={header}>{header}</option>
                ))}
              </select>
            </div>
            
            {mapping[field.id] && (
              <div className="mapping-status">
                <FontAwesomeIcon icon={faCheck} className="mapped-icon" />
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mapping-actions">
        <button
          className="primary-button"
          disabled={!isValidMapping()}
          onClick={handleSubmit}
        >
          Confirm Mapping
        </button>
        <p className="mapping-status-text">
          {isValidMapping() 
            ? 'All required fields are mapped' 
            : 'Please map all required fields'}
        </p>
      </div>
    </div>
  );
};

export default DonationMapper;
