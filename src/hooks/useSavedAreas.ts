import { useState, useCallback, useEffect } from 'react';
import { LatLngBounds } from 'leaflet';
import { SavedArea } from '../types';
import { StorageService } from '../services/storageService';
import { generateId, generateRandomColor } from '../utils';

export const useSavedAreas = () => {
  const [savedAreas, setSavedAreas] = useState<SavedArea[]>([]);

  // Загружаем сохраненные области при монтировании
  useEffect(() => {
    const areas = StorageService.loadAreas();
    setSavedAreas(areas);
  }, []);

  const addArea = useCallback((name: string, bounds: LatLngBounds) => {
    const newArea: SavedArea = {
      id: generateId(),
      name,
      bounds,
      createdAt: new Date(),
      color: generateRandomColor(),
    };

    setSavedAreas(prev => {
      const updatedAreas = [...prev, newArea];
      StorageService.saveAreas(updatedAreas);
      return updatedAreas;
    });
  }, []);

  const deleteArea = useCallback((id: string) => {
    setSavedAreas(prev => {
      const updatedAreas = prev.filter(area => area.id !== id);
      StorageService.saveAreas(updatedAreas);
      return updatedAreas;
    });
  }, []);

  const clearAllAreas = useCallback(() => {
    setSavedAreas([]);
    StorageService.clearAreas();
  }, []);

  return {
    savedAreas,
    addArea,
    deleteArea,
    clearAllAreas,
  };
};
