import React, { useState } from 'react';
import { CoordinatesModalProps } from '../types';
import { formatCoordinate } from '../utils';
import './CoordinatesModal.css';

export const CoordinatesModal: React.FC<CoordinatesModalProps> = ({ 
  isOpen, 
  onClose, 
  bounds, 
  onSave 
}) => {
  const [areaName, setAreaName] = useState('');
  
  if (!isOpen || !bounds) return null;

  const handleSave = () => {
    if (areaName.trim()) {
      onSave(areaName.trim(), bounds);
      setAreaName('');
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Координаты выделенной области</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="save-section">
            <h3>Сохранить область:</h3>
            <div className="save-input-group">
              <input
                type="text"
                placeholder="Введите название области"
                value={areaName}
                onChange={(e) => setAreaName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="area-name-input"
                autoFocus
              />
              <button 
                onClick={handleSave}
                disabled={!areaName.trim()}
                className="save-button"
              >
                Сохранить
              </button>
            </div>
          </div>
          
          <div className="coordinates-section">
            <h3>Северо-западный угол:</h3>
            <p>{formatCoordinate(bounds.getNorthWest().lat, bounds.getNorthWest().lng)}</p>
          </div>
          <div className="coordinates-section">
            <h3>Северо-восточный угол:</h3>
            <p>{formatCoordinate(bounds.getNorthEast().lat, bounds.getNorthEast().lng)}</p>
          </div>
          <div className="coordinates-section">
            <h3>Юго-западный угол:</h3>
            <p>{formatCoordinate(bounds.getSouthWest().lat, bounds.getSouthWest().lng)}</p>
          </div>
          <div className="coordinates-section">
            <h3>Юго-восточный угол:</h3>
            <p>{formatCoordinate(bounds.getSouthEast().lat, bounds.getSouthEast().lng)}</p>
          </div>
          <div className="coordinates-section">
            <h3>Центр области:</h3>
            <p>{formatCoordinate(bounds.getCenter().lat, bounds.getCenter().lng)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
