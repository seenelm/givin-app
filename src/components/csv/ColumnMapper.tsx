import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt, faCheck } from '@fortawesome/free-solid-svg-icons';

interface ColumnMapperProps {
  csvHeaders: string[];
  onMappingComplete: (mapping: Record<string, string>) => void;
}

// These would typically come from your donor data model
const DONOR_FIELDS = [
  { id: 'firstName', label: 'First Name', required: true },
  { id: 'lastName', label: 'Last Name', required: true },
  { id: 'email', label: 'Email Address', required: true },
  { id: 'phone', label: 'Phone Number', required: false },
  { id: 'address', label: 'Address', required: false },
  { id: 'city', label: 'City', required: false },
  { id: 'state', label: 'State/Province', required: false },
  { id: 'zipCode', label: 'Zip/Postal Code', required: false },
  { id: 'country', label: 'Country', required: false },
  { id: 'donationAmount', label: 'Donation Amount', required: false },
  { id: 'donationDate', label: 'Donation Date', required: false },
  { id: 'notes', label: 'Notes', required: false },
];

const ColumnMapper: React.FC<ColumnMapperProps> = ({ csvHeaders, onMappingComplete }) => {
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [autoMapped, setAutoMapped] = useState(false);

  // Try to automatically map columns based on name similarity
  useEffect(() => {
    if (!autoMapped && csvHeaders.length > 0) {
      const initialMapping: Record<string, string> = {};
      
      DONOR_FIELDS.forEach(field => {
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
    return DONOR_FIELDS.filter(field => field.required)
      .every(field => mapping[field.id]);
  };

  const handleSubmit = () => {
    if (isValidMapping()) {
      onMappingComplete(mapping);
    }
  };

  return (
    <div className="column-mapper">
      <h3>Map CSV Columns to Donor Fields</h3>
      <p className="mapper-description">
        Match your CSV columns to the appropriate donor fields. Required fields are marked with an asterisk (*).
      </p>
      
      <div className="mapping-container">
        {DONOR_FIELDS.map(field => (
          <div key={field.id} className="field-mapping-row">
            <div className="field-info">
              <label>{field.label}{field.required && <span className="required">*</span>}</label>
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

export default ColumnMapper;
