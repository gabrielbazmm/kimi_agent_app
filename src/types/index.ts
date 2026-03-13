// ==================== TYPES ====================

export type BoxType = 'bookshelf' | 'tower' | 'monitor' | 'soundbar' | 'boombox' | 'subwoofer';
export type PortType = 'sealed' | 'ported' | 'passive' | 'bandpass' | 'transmission-line' | 'horn-loaded';
export type PortShape = 'circular' | 'slot' | 'rectangular';
export type PortPosition = 'front' | 'back' | 'bottom';
export type InternalBracing = 'none' | 'simple' | 'cross' | 'window' | 'full';
export type ChamberConfig = 'single' | 'two-way' | 'three-way';
export type DriverType = 'sub' | 'woofer' | 'mid' | 'tweeter';
export type FiringDirection = 'front' | 'back' | 'up' | 'down' | 'side';
export type AppState = 'landing' | 'loading' | 'designer';
export type DesignerTab = 'type' | 'dims' | 'drivers' | 'port' | 'mat' | 'specs';

export interface Driver {
  id: string;
  type: DriverType;
  size: number;
  position: { x: number; y: number };
  firing: FiringDirection;
}

export interface PortConfig {
  type: PortType;
  shape: PortShape;
  position: PortPosition;
  diameter: number;
  length: number;
  count: number;
}

export interface BoxDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface BoxConfig {
  boxType: BoxType;
  dimensions: BoxDimensions;
  material: 'wood' | 'mdf' | 'metal' | 'fabric';
  finish: 'matte' | 'glossy' | 'textured';
  color: string;
  thickness: number;
  drivers: Driver[];
  port: PortConfig;
  internalBracing: InternalBracing;
  chamberConfig: ChamberConfig;
  showInternal: boolean;
}

export interface BoxTypeConfigData {
  dimensions: BoxDimensions;
  defaultDrivers: Driver[];
  defaultPort: PortConfig;
  defaultName: string;
}
