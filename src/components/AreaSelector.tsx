import React, { useState } from 'react';
import { useMapEvents, Rectangle } from 'react-leaflet';
import { LatLng, LatLngBounds } from 'leaflet';
import { AreaSelectorProps } from '../types';
import { MAP_CONFIG, SELECTION_STYLES } from '../constants';
import { isValidAreaSize } from '../utils';

export const AreaSelector: React.FC<AreaSelectorProps> = ({ onAreaSelected, onSelectionChange }) => {
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
        
        if (isValidAreaSize(bounds)) {
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
      pathOptions={SELECTION_STYLES.ACTIVE}
    />
  );
};
