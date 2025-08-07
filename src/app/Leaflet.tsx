import React, { useState, useCallback } from 'react';
import { LatLngBounds } from 'leaflet';
import { Map, CoordinatesModal, SavedAreasList } from '../components';
import { useSavedAreas } from '../hooks';
import './Leaflet.css';

export default function Leaflet() {
  const [selectedBounds, setSelectedBounds] = useState<LatLngBounds | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  
  const { savedAreas, addArea, deleteArea } = useSavedAreas();

  const handleAreaSelected = useCallback((bounds: LatLngBounds) => {
    console.log('Area selected:', bounds);
    setSelectedBounds(bounds);
    setIsModalOpen(true);
  }, []);

  const handleSelectionChange = useCallback((selecting: boolean) => {
    setIsSelecting(selecting);
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveArea = useCallback((name: string, bounds: LatLngBounds) => {
    addArea(name, bounds);
  }, [addArea]);

  return (
    <div className="leaflet-container">
      <div className="instructions">
        <h2>Гео-приложение Leaflet</h2>
        <p>Нажмите и перетащите мышью для выделения области на карте</p>
        <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '10px' }}>
          Статус: {isSelecting ? 'Выделение области... (перетащите для завершения)' : 'Готов к выделению'}
        </p>
        <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '5px' }}>
          Минимальный размер области: 0.001° × 0.001°
        </p>
      </div>
      
      <Map 
        savedAreas={savedAreas}
        onAreaSelected={handleAreaSelected}
        onSelectionChange={handleSelectionChange}
      />

      <SavedAreasList areas={savedAreas} onDelete={deleteArea} />

      <CoordinatesModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        bounds={selectedBounds}
        onSave={handleSaveArea}
      />
    </div>
  );
}