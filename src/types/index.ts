import { LatLngBounds } from 'leaflet';

export interface SavedArea {
  id: string;
  name: string;
  bounds: LatLngBounds;
  createdAt: Date;
  color: string;
}

export interface AreaSelectorProps {
  onAreaSelected: (bounds: LatLngBounds) => void;
  onSelectionChange: (isSelecting: boolean) => void;
}

export interface CoordinatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  bounds: LatLngBounds | null;
  onSave: (name: string, bounds: LatLngBounds) => void;
}

export interface SavedAreasListProps {
  areas: SavedArea[];
  onDelete: (id: string) => void;
}

export interface MapContainerProps {
  center: [number, number];
  zoom: number;
  children: React.ReactNode;
}
