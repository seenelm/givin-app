import React, { useState, useEffect, useRef } from 'react';
import './styles/Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRocket,
  faBuilding
} from '@fortawesome/free-solid-svg-icons';

// TypeScript interfaces for neural network animation
interface NetworkNode {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  pulsePhase: number;
}

interface NetworkConnection {
  from: number;
  to: number;
  active: boolean;
  progress: number;
  pulseSpeed: number;
}

const Dashboard: React.FC = () => {
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [ein, setEin] = useState<string>('');
  const [einError, setEinError] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 5; // Total number of steps in the onboarding process
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  
  const handleOpenModal = () => {
    setShowModal(true);
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    // Re-enable body scrolling when modal is closed
    document.body.style.overflow = 'auto';
    // Reset state when modal is closed
    setEin('');
    setEinError('');
    setCurrentStep(1);
  };
  
  const handleEinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEin(value);
    
    // Clear error when user starts typing
    if (einError) setEinError('');
  };
  
  const handleContinue = () => {
    // Validate EIN
    if (!ein.trim()) {
      setEinError('Please enter your organization\'s EIN');
      return;
    }
    
    // Basic EIN format validation (9 digits, can be formatted as XX-XXXXXXX)
    const einRegex = /^\d{2}-?\d{7}$/;
    if (!einRegex.test(ein)) {
      setEinError('Please enter a valid 9-digit EIN (format: XX-XXXXXXX)');
      return;
    }
    
    // If valid, proceed to next step
    setCurrentStep(prev => prev + 1);
    // Here you would handle the next step or submit the form
    // For now, we'll just close the modal after a successful submission
    if (currentStep >= totalSteps) {
      handleCloseModal();
    }
  };
  
  // Neural network animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Neural network nodes
    const nodes: NetworkNode[] = [];
    const connections: NetworkConnection[] = [];
    const nodeCount = 15;
    
    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 2,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        pulsePhase: Math.random() * Math.PI * 2
      });
    }
    
    // Create connections between nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.random() > 0.85) { // 15% chance to create a connection
          connections.push({
            from: i,
            to: j,
            active: false,
            progress: 0,
            pulseSpeed: Math.random() * 0.02 + 0.01
          });
        }
      }
    }
    
    // Animation
    let startTime = Date.now();
    
    const animate = () => {
      if (!ctx || !canvas) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update nodes
      nodes.forEach(node => {
        // Move nodes
        node.x += node.vx;
        node.y += node.vy;
        
        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
        
        // Update pulse phase
        node.pulsePhase += 0.02;
        if (node.pulsePhase > Math.PI * 2) node.pulsePhase -= Math.PI * 2;
        
        // Draw node
        const opacity = 0.5 + 0.5 * Math.sin(node.pulsePhase);
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(76, 175, 80, ${opacity})`;
        ctx.fill();
      });
      
      // Draw connections
      connections.forEach(conn => {
        const fromNode = nodes[conn.from];
        const toNode = nodes[conn.to];
        
        // Calculate distance
        const dx = toNode.x - fromNode.x;
        const dy = toNode.y - fromNode.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Only draw connections if nodes are close enough
        if (distance < canvas.width * 0.3) {
          // Draw line
          ctx.beginPath();
          ctx.moveTo(fromNode.x, fromNode.y);
          ctx.lineTo(toNode.x, toNode.y);
          
          // Line opacity based on distance
          const opacity = 0.1 * (1 - distance / (canvas.width * 0.3));
          ctx.strokeStyle = `rgba(76, 175, 80, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
          
          // Randomly activate connections
          if (Math.random() < 0.001 && !conn.active) {
            conn.active = true;
            conn.progress = 0;
          }
          
          // Draw data pulse animation
          if (conn.active) {
            // Update progress
            conn.progress += conn.pulseSpeed;
            
            if (conn.progress >= 1) {
              conn.active = false;
              conn.progress = 0;
            } else {
              // Draw pulse
              const pulsePos = {
                x: fromNode.x + dx * conn.progress,
                y: fromNode.y + dy * conn.progress
              };
              
              const pulseRadius = 2 + Math.sin(conn.progress * Math.PI) * 2;
              
              ctx.beginPath();
              ctx.arc(pulsePos.x, pulsePos.y, pulseRadius, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
              ctx.fill();
            }
          }
        }
      });
      
      // Check if animation should stop
      const currentTime = Date.now();
      if (currentTime - startTime > 8000 && !animationComplete) {
        setAnimationComplete(true);
      }
      
      // Continue animation if not complete
      if (!animationComplete) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    // Start animation
    animationRef.current = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [animationComplete]);

  return (
    <div className="content-body build-org-container">
      {/* Neural network animation */}
      <div className="neural-network-container">
        <canvas 
          ref={canvasRef} 
          className={`neural-network-canvas ${animationComplete ? 'animation-complete' : ''}`}
        />
      </div>

      <div className="build-org-content">
        <div className="build-org-icon">
          <FontAwesomeIcon icon={faBuilding} size="4x" />
        </div>
        <h1>Start Building Your Organization</h1>
        <p className="build-org-description">
          Discover the power of givin AI to transform how your nonprofit operates
        </p>
        
        <button className="build-org-button" onClick={handleOpenModal}>
          <FontAwesomeIcon icon={faRocket} className="button-icon" />
          Build Your Org
        </button>
      </div>
      
      {/* Full-page modal */}
      {showModal && (
        <div className="full-page-modal">
          <div className="modal-content">
            {/* Close button in corner */}
            <button className="close-modal-button" onClick={handleCloseModal}>
              &times;
            </button>
            
            {/* Progress bar at top */}
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${(currentStep / totalSteps) * 100}%` }}></div>
            </div>
            
            <div className="question-container">
              <h2>What is your organization's EIN?</h2>
              
              <div className="input-container">
                <label htmlFor="ein">EIN</label>
                <input 
                  type="text" 
                  id="ein" 
                  placeholder="XX-XXXXXXX"
                  value={ein}
                  onChange={handleEinChange}
                  className={einError ? 'error' : ''}
                />
                {einError ? (
                  <p className="input-error">{einError}</p>
                ) : (
                  <p className="input-help">Please enter your 9-digit Employer Identification Number</p>
                )}
              </div>
              
              <button className="continue-button" onClick={handleContinue}>
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

