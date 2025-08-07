import React from 'react';
import { SavedAreasListProps } from '../types';
import './SavedAreasList.css';

export const SavedAreasList: React.FC<SavedAreasListProps> = ({ areas, onDelete }) => {
  if (areas.length === 0) return null;

  return (
    <div className="saved-areas-panel">
      <h3>Сохраненные области ({areas.length})</h3>
      <div className="areas-list">
        {areas.map((area) => (
          <div key={area.id} className="area-item">
            <div className="area-info">
              <span className="area-name">{area.name}</span>
              <span className="area-date">
                {area.createdAt.toLocaleDateString()}
              </span>
            </div>
            <button 
              onClick={() => onDelete(area.id)}
              className="delete-button"
              title="Удалить область"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
