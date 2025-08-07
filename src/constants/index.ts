export const MAP_CONFIG = {
  DEFAULT_CENTER: [55.7558, 37.6176] as [number, number],
  DEFAULT_ZOOM: 10,
  MIN_AREA_SIZE: 0.001, // минимальный размер области в градусах
  TILE_URL: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  TILE_ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  MAX_ZOOM: 19,
  TILE_SIZE: 256,
} as const;

export const STORAGE_KEYS = {
  SAVED_AREAS: 'savedAreas',
} as const;

export const SELECTION_STYLES = {
  ACTIVE: {
    color: '#ff4444',
    weight: 4,
    fillColor: '#ff4444',
    fillOpacity: 0.2,
    dashArray: '5, 5',
  },
  SAVED: {
    weight: 2,
    fillOpacity: 0.1,
  },
} as const;
