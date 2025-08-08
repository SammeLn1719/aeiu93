import { LatLngBounds } from 'leaflet';
import { SavedArea } from '../types';

export const formatCoordinate = (lat: number, lng: number): string => {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
};

export const generateRandomColor = (): string => {
  return `hsl(${Math.random() * 360}, 70%, 50%)`;
};

export const generateId = (): string => {
  return Date.now().toString();
};

export const isValidAreaSize = (bounds: LatLngBounds): boolean => {
  const latDiff = Math.abs(bounds.getNorth() - bounds.getSouth());
  const lngDiff = Math.abs(bounds.getEast() - bounds.getWest());
  // Область должна быть достаточно большой по хотя бы одному измерению
  return latDiff > 0.001 || lngDiff > 0.001;
};

export const serializeArea = (area: SavedArea) => ({
  ...area,
  bounds: {
    north: area.bounds.getNorth(),
    south: area.bounds.getSouth(),
    east: area.bounds.getEast(),
    west: area.bounds.getWest(),
  }
});

export const deserializeArea = (areaData: any): SavedArea => ({
  ...areaData,
  bounds: new LatLngBounds(
    [areaData.bounds.south, areaData.bounds.west],
    [areaData.bounds.north, areaData.bounds.east]
  ),
  createdAt: new Date(areaData.createdAt),
});
