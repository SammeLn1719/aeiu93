import { SavedArea } from '../types';
import { STORAGE_KEYS } from '../constants';
import { serializeArea, deserializeArea } from '../utils';

export class StorageService {
  static saveAreas(areas: SavedArea[]): void {
    try {
      const serializedAreas = areas.map(serializeArea);
      localStorage.setItem(STORAGE_KEYS.SAVED_AREAS, JSON.stringify(serializedAreas));
    } catch (error) {
      console.error('Error saving areas to localStorage:', error);
    }
  }

  static loadAreas(): SavedArea[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SAVED_AREAS);
      if (!saved) return [];

      const parsedAreas = JSON.parse(saved);
      return parsedAreas.map(deserializeArea);
    } catch (error) {
      console.error('Error loading areas from localStorage:', error);
      return [];
    }
  }

  static clearAreas(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.SAVED_AREAS);
    } catch (error) {
      console.error('Error clearing areas from localStorage:', error);
    }
  }
}
