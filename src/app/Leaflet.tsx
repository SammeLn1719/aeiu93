import React, { useState, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents, Rectangle } from 'react-leaflet';
import { LatLngBounds, LatLng } from 'leaflet';
import './Leaflet.css';

interface AreaSelectorProps {
  onAreaSelected: (bounds: LatLngBounds) => void;
  onSelectionChange: (isSelecting: boolean) => void;
}

const AreaSelector: React.FC<AreaSelectorProps> = ({ onAreaSelected, onSelectionChange }) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [startPoint, setStartPoint] = useState<LatLng | null>(null);
  const [endPoint, setEndPoint] = useState<LatLng | null>(null);
  const [hasMoved, setHasMoved] = useState(false);
  
  useMapEvents({
    mousedown: (e) => {
      console.log('Mouse down:', e.latlng);
      if (!isSelecting) {
        setIsSelecting(true);
        onSelectionChange(true);
        setStartPoint(e.latlng);
        setEndPoint(e.latlng);
        setHasMoved(false);
      }
    },
    mousemove: (e) => {
      if (isSelecting && startPoint) {
        setEndPoint(e.latlng);
        setHasMoved(true);
      }
    },
    mouseup: (e) => {
      console.log('Mouse up:', e.latlng, 'Has moved:', hasMoved);
      if (isSelecting && startPoint && endPoint && hasMoved) {
        const bounds = new LatLngBounds(startPoint, endPoint);
        const latDiff = Math.abs(bounds.getNorth() - bounds.getSouth());
        const lngDiff = Math.abs(bounds.getEast() - bounds.getWest());
        
        // Проверяем минимальный размер области (примерно 0.01 градуса)
        if (latDiff > 0.001 && lngDiff > 0.001) {
          console.log('Selected bounds:', bounds);
          onAreaSelected(bounds);
        } else {
          console.log('Area too small, ignoring selection');
        }
        
        setIsSelecting(false);
        onSelectionChange(false);
        setStartPoint(null);
        setEndPoint(null);
        setHasMoved(false);
      } else if (isSelecting) {
        // Если не двигали мышь, просто отменяем выделение
        setIsSelecting(false);
        onSelectionChange(false);
        setStartPoint(null);
        setEndPoint(null);
        setHasMoved(false);
      }
    },
    click: (e) => {
      console.log('Map clicked:', e.latlng);
    },
  });

  if (!startPoint || !endPoint) return null;

  return (
    <Rectangle
      bounds={[[startPoint.lat, startPoint.lng], [endPoint.lat, endPoint.lng]]}
      pathOptions={{
        color: '#ff4444',
        weight: 4,
        fillColor: '#ff4444',
        fillOpacity: 0.2,
        dashArray: '5, 5',
      }}
    />
  );
};

interface SavedArea {
  id: string;
  name: string;
  bounds: LatLngBounds;
  createdAt: Date;
  color: string;
}

interface CoordinatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  bounds: LatLngBounds | null;
  onSave: (name: string, bounds: LatLngBounds) => void;
}

const CoordinatesModal: React.FC<CoordinatesModalProps> = ({ isOpen, onClose, bounds, onSave }) => {
  const [areaName, setAreaName] = useState('');
  
  if (!isOpen || !bounds) return null;

  const formatCoordinate = (lat: number, lng: number) => {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  const handleSave = () => {
    if (areaName.trim()) {
      onSave(areaName.trim(), bounds);
      setAreaName('');
      onClose();
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
                className="area-name-input"
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

const SavedAreasList: React.FC<{ areas: SavedArea[]; onDelete: (id: string) => void }> = ({ areas, onDelete }) => {
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

export default function Leaflet() {
  const [selectedBounds, setSelectedBounds] = useState<LatLngBounds | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [savedAreas, setSavedAreas] = useState<SavedArea[]>([]);

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
    const newArea: SavedArea = {
      id: Date.now().toString(),
      name,
      bounds,
      createdAt: new Date(),
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    };
    setSavedAreas(prev => [...prev, newArea]);
    
    // Сохраняем в localStorage
    const areasToSave = [...savedAreas, newArea].map(area => ({
      ...area,
      bounds: {
        north: area.bounds.getNorth(),
        south: area.bounds.getSouth(),
        east: area.bounds.getEast(),
        west: area.bounds.getWest(),
      }
    }));
    localStorage.setItem('savedAreas', JSON.stringify(areasToSave));
  }, [savedAreas]);

  const handleDeleteArea = useCallback((id: string) => {
    setSavedAreas(prev => prev.filter(area => area.id !== id));
    
    // Обновляем localStorage
    const updatedAreas = savedAreas.filter(area => area.id !== id).map(area => ({
      ...area,
      bounds: {
        north: area.bounds.getNorth(),
        south: area.bounds.getSouth(),
        east: area.bounds.getEast(),
        west: area.bounds.getWest(),
      }
    }));
    localStorage.setItem('savedAreas', JSON.stringify(updatedAreas));
  }, [savedAreas]);

  // Загружаем сохраненные области при монтировании компонента
  useEffect(() => {
    const saved = localStorage.getItem('savedAreas');
    if (saved) {
      try {
        const parsedAreas = JSON.parse(saved).map((area: any) => ({
          ...area,
          bounds: new LatLngBounds(
            [area.bounds.south, area.bounds.west],
            [area.bounds.north, area.bounds.east]
          ),
          createdAt: new Date(area.createdAt),
        }));
        setSavedAreas(parsedAreas);
      } catch (error) {
        console.error('Error loading saved areas:', error);
      }
    }
  }, []);

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
      
        <div style={{ height: '60vh', width: '100%', border: '2px solid #ccc', borderRadius: '8px', minHeight: '500px' }}>
        <MapContainer 
          center={[55.7558, 37.6176]} 
          zoom={10} 
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
          attributionControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
            tileSize={256}
          />
          <AreaSelector onAreaSelected={handleAreaSelected} onSelectionChange={handleSelectionChange} />
          
          {/* Отображаем сохраненные области */}
          {savedAreas.map((area) => (
            <Rectangle
              key={area.id}
              bounds={[
                [area.bounds.getSouth(), area.bounds.getWest()],
                [area.bounds.getNorth(), area.bounds.getEast()]
              ]}
              pathOptions={{
                color: area.color,
                weight: 2,
                fillColor: area.color,
                fillOpacity: 0.1,
              }}
            />
          ))}
        </MapContainer>
      </div>

      <SavedAreasList areas={savedAreas} onDelete={handleDeleteArea} />

      <CoordinatesModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        bounds={selectedBounds}
        onSave={handleSaveArea}
      />
    </div>
  );
}