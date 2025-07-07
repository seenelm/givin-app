import React from 'react';
import '../styles/DataFlowChart.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDatabase, 
  faCreditCard,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';

interface DataSource {
  id: string;
  name: string;
  description: string;
  color: string;
}

interface DataTarget {
  id: string;
  name: string;
  description: string;
  icon: any;
}

interface DataFlowChartProps {
  sources: DataSource[];
  targets: DataTarget[];
  connections: {
    sourceId: string;
    targetId: string;
  }[];
}

const DataFlowChart: React.FC<DataFlowChartProps> = ({ sources, targets }) => {
  return (
    <div className="data-flow-chart">
      <div className="data-flow-title">Data Integration Map</div>
      
      <div className="data-flow-container">
        {/* Sources Column */}
        <div className="data-flow-column sources-column">
          <div className="column-header">
            <FontAwesomeIcon icon={faCreditCard} />
            <h3>Payment Sources</h3>
          </div>
          <div className="column-items">
            {sources.map(source => (
              <div 
                key={source.id} 
                className="data-node source-node" 
                id={`source-${source.id}`}
                style={{ 
                  backgroundColor: `var(--${source.color}-lighter, ${source.color})`,
                  borderLeft: `4px solid var(--${source.color}-color, ${source.color})`
                }}
              >
                <div className="node-content">
                  <div className="node-title">{source.name}</div>
                  <div className="node-description">{source.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Connections */}
        <div className="data-flow-connections">
          <div className="column-header">
            <FontAwesomeIcon icon={faArrowRight} />
            <h3>Data Flow</h3>
          </div>
          <div className="connections-container">
            {/* {connections.map((connection, index) => (
              <div key={index} className="connection-line">
                <div className="connection-arrow">→</div>
              </div>
            ))} */}
          </div>
        </div>
        
        {/* Targets Column */}
        <div className="data-flow-column targets-column">
          <div className="column-header">
            <FontAwesomeIcon icon={faDatabase} />
            <h3>Data Collections</h3>
          </div>
          <div className="column-items">
            {targets.map(target => (
              <div 
                key={target.id} 
                className="data-node target-node" 
                id={`target-${target.id}`}
              >
                <div className="node-icon">
                  <FontAwesomeIcon icon={target.icon} />
                </div>
                <div className="node-content">
                  <div className="node-title">{target.name}</div>
                  <div className="node-description">{target.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataFlowChart;
