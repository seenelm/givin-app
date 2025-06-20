import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { type IconDefinition } from '@fortawesome/free-solid-svg-icons';
import '../styles/stub.css';

export interface StubProps {
  icon: IconDefinition;
  heading?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  showSecondaryButton?: boolean;
  primaryButtonIcon: IconDefinition;
  secondaryButtonIcon: IconDefinition;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
}

const Stub: React.FC<StubProps> = (props) => {
    return (
        <div className="empty-state">
                   <div className="empty-state-icon">
                     <FontAwesomeIcon icon={props.icon} />
                   </div>
                   <h3>{props.heading}</h3>
                   <p>{props.description}</p>
                   <div className="empty-state-actions">
                     <button className="primary-button" onClick={props.onPrimaryAction}>
                       <FontAwesomeIcon icon={props.primaryButtonIcon} /> {props.primaryButtonText}
                     </button>
                     {props.showSecondaryButton && (
                       <button className="primary-button" onClick={props.onSecondaryAction}>
                         <FontAwesomeIcon icon={props.secondaryButtonIcon} /> {props.secondaryButtonText}
                       </button>
                     )}
                   </div>
                 </div>
    );
};

export default Stub;
