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
  
  useMapEvents({
    contextmenu: (e) => {
      // Предотвращаем появление контекстного меню
      e.originalEvent.preventDefault();
      e.originalEvent.stopPropagation();
    },
    mousedown: (e) => {
      // Обрабатываем только левую кнопку мыши
      if (e.originalEvent.button === 0) {
        console.log('Mouse down:', e.latlng, 'Button:', e.originalEvent.button);
        if (!isSelecting) {
          setIsSelecting(true);
          onSelectionChange(true);
          setStartPoint(e.latlng);
          setEndPoint(e.latlng);
          console.log('Started selection');
        }
      }
    },
    mousemove: (e) => {
      if (isSelecting && startPoint) {
        setEndPoint(e.latlng);
      }
    },
    mouseup: (e) => {
      // Обрабатываем только левую кнопку мыши
      if (e.originalEvent.button === 0) {
        console.log('Mouse up:', e.latlng);
        if (isSelecting && startPoint && endPoint) {
          const bounds = new LatLngBounds(startPoint, endPoint);
          
          if (isValidAreaSize(bounds)) {
            console.log('Selected bounds:', bounds);
            onAreaSelected(bounds);
          } else {
            console.log('Area too small, ignoring selection');
          }
        }
        
        // Сбрасываем состояние
        setIsSelecting(false);
        onSelectionChange(false);
        setStartPoint(null);
        setEndPoint(null);
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
