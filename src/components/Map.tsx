import React from 'react';
import { MapContainer, TileLayer, Rectangle } from 'react-leaflet';
import { SavedArea } from '../types';
import { MAP_CONFIG, SELECTION_STYLES } from '../constants';
import { AreaSelector } from './AreaSelector';
import './Map.css';

interface MapProps {
  savedAreas: SavedArea[];
  onAreaSelected: (bounds: any) => void;
  onSelectionChange: (isSelecting: boolean) => void;
}

export const Map: React.FC<MapProps> = ({ 
  savedAreas, 
  onAreaSelected, 
  onSelectionChange 
}) => {
  return (
    <div className="map-container">
      <MapContainer 
        center={MAP_CONFIG.DEFAULT_CENTER} 
        zoom={MAP_CONFIG.DEFAULT_ZOOM} 
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        attributionControl={true}
      >
        <TileLayer
          attribution={MAP_CONFIG.TILE_ATTRIBUTION}
          url={MAP_CONFIG.TILE_URL}
          maxZoom={MAP_CONFIG.MAX_ZOOM}
          tileSize={MAP_CONFIG.TILE_SIZE}
        />
        
        <AreaSelector 
          onAreaSelected={onAreaSelected} 
          onSelectionChange={onSelectionChange} 
        />
        
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
              weight: SELECTION_STYLES.SAVED.weight,
              fillColor: area.color,
              fillOpacity: SELECTION_STYLES.SAVED.fillOpacity,
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
};
