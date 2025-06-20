import React, {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChevronDown, 
  faPlus, 
  faFileImport
} from '@fortawesome/free-solid-svg-icons';
import '../styles/controls.css';

interface ControlsProps {
  filterOptions?: {
    defaultOption: string;
    options: string[];
  };
  onFilterChange?: (option: string) => void;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  primaryButtonLabel?: string;
  secondaryButtonLabel?: string;
  showSecondaryButton?: boolean;
}

const Controls: React.FC<ControlsProps> = ({ 
  filterOptions = {
    defaultOption: 'All Items',
    options: ['All Items', 'Recent', 'Favorites']
  },
  onFilterChange = () => {},
  onPrimaryAction = () => {},
  onSecondaryAction = () => {},
  primaryButtonLabel = 'Import',
  secondaryButtonLabel = 'Add New',
  showSecondaryButton = true
}) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState(filterOptions.defaultOption);
  
  const handleFilterSelect = (option: string) => {
    setCurrentFilter(option);
    setFilterOpen(false);
    onFilterChange(option);
  };

  return (
    <div className="controls">
        <div className="filter-dropdown1">
            <button 
              className="filter-button1" 
              onClick={() => {setFilterOpen(!filterOpen)}}
            >
              {currentFilter} <FontAwesomeIcon icon={faChevronDown} />
            </button>
            {filterOpen && (
              <div className="filter-menu1">
                {filterOptions.options.map((option) => (
                  <button 
                    key={option}
                    onClick={() => handleFilterSelect(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
        </div>
        <div className="action-buttons1">
            <button className="import-button1" onClick={onPrimaryAction}>
              <FontAwesomeIcon icon={faFileImport} /> {primaryButtonLabel}
            </button>
            {showSecondaryButton && (
              <button className="add-button1" onClick={onSecondaryAction}>
                <FontAwesomeIcon icon={faPlus} /> {secondaryButtonLabel}
              </button>
            )}
        </div>
    </div>
  );
};

export default Controls;
