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
  const [copySuccess, setCopySuccess] = useState(false);
  
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

  const handleCopyCoordinates = async () => {
    const coordinates = {
      northWest: formatCoordinate(bounds.getNorthWest().lat, bounds.getNorthWest().lng),
      northEast: formatCoordinate(bounds.getNorthEast().lat, bounds.getNorthEast().lng),
      southWest: formatCoordinate(bounds.getSouthWest().lat, bounds.getSouthWest().lng),
      southEast: formatCoordinate(bounds.getSouthEast().lat, bounds.getSouthEast().lng),
      center: formatCoordinate(bounds.getCenter().lat, bounds.getCenter().lng)
    };

    const coordinatesText = `Координаты выделенной области:
Северо-западный угол: ${coordinates.northWest}
Северо-восточный угол: ${coordinates.northEast}
Юго-западный угол: ${coordinates.southWest}
Юго-восточный угол: ${coordinates.southEast}
Центр области: ${coordinates.center}`;

    try {
      await navigator.clipboard.writeText(coordinatesText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Ошибка при копировании в буфер обмена:', err);
      // Fallback для старых браузеров
      const textArea = document.createElement('textarea');
      textArea.value = coordinatesText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
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
          
          <div className="copy-section">
            <button 
              onClick={handleCopyCoordinates}
              className={`copy-button ${copySuccess ? 'copy-success' : ''}`}
            >
              {copySuccess ? '✓ Скопировано!' : '📋 Копировать координаты'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
