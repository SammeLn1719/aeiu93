import React from 'react';
import './Compass.css';

interface CompassProps {
  className?: string;
}

export const Compass: React.FC<CompassProps> = ({ className = '' }) => {
  return (
    <div className={`compass-container ${className}`}>
      <div className="compass-rose">
        <div className="compass-line compass-line-vertical"></div>
        <div className="compass-line compass-line-horizontal"></div>
        
        <div className="compass-line compass-line-diagonal"></div>
        <div className="compass-line compass-line-diagonal"></div>
    
        <div className="compass-center"></div>
        
        <div className="compass-direction compass-north">С</div>
        <div className="compass-direction compass-south">Ю</div>
        <div className="compass-direction compass-east">В</div>
        <div className="compass-direction compass-west">З</div>
      </div>
    </div>
  );
};
