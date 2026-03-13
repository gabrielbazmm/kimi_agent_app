import type { BoxType, BoxTypeConfigData, BoxConfig, DriverType } from '@/types';

// ==================== CONFIGURACIONES POR TIPO DE CAJA ====================

export const boxTypeConfigs: Record<BoxType, BoxTypeConfigData> = {
  bookshelf: {
    dimensions: { width: 250, height: 400, depth: 280 },
    defaultDrivers: [
      { id: '1', type: 'woofer', size: 130, position: { x: 0, y: -0.2 }, firing: 'front' },
      { id: '2', type: 'tweeter', size: 25, position: { x: 0, y: 0.25 }, firing: 'front' },
    ],
    defaultPort: { type: 'ported', shape: 'circular', position: 'front', diameter: 60, length: 100, count: 1 },
    defaultName: 'Bookshelf'
  },
  tower: {
    dimensions: { width: 280, height: 1100, depth: 350 },
    defaultDrivers: [
      { id: '1', type: 'sub', size: 200, position: { x: 0, y: -0.35 }, firing: 'front' },
      { id: '2', type: 'mid', size: 130, position: { x: 0, y: 0 }, firing: 'front' },
      { id: '3', type: 'tweeter', size: 25, position: { x: 0, y: 0.35 }, firing: 'front' },
    ],
    defaultPort: { type: 'ported', shape: 'slot', position: 'front', diameter: 80, length: 150, count: 2 },
    defaultName: 'Tower'
  },
  monitor: {
    dimensions: { width: 300, height: 450, depth: 320 },
    defaultDrivers: [
      { id: '1', type: 'woofer', size: 165, position: { x: 0, y: -0.15 }, firing: 'front' },
      { id: '2', type: 'tweeter', size: 25, position: { x: 0, y: 0.25 }, firing: 'front' },
    ],
    defaultPort: { type: 'sealed', shape: 'circular', position: 'front', diameter: 0, length: 0, count: 0 },
    defaultName: 'Monitor'
  },
  soundbar: {
    dimensions: { width: 1000, height: 120, depth: 140 },
    defaultDrivers: [
      { id: '1', type: 'mid', size: 65, position: { x: -0.3, y: 0 }, firing: 'front' },
      { id: '2', type: 'mid', size: 65, position: { x: -0.1, y: 0 }, firing: 'front' },
      { id: '3', type: 'mid', size: 65, position: { x: 0.1, y: 0 }, firing: 'front' },
      { id: '4', type: 'tweeter', size: 20, position: { x: 0.3, y: 0 }, firing: 'front' },
    ],
    defaultPort: { type: 'ported', shape: 'slot', position: 'bottom', diameter: 40, length: 80, count: 2 },
    defaultName: 'Soundbar'
  },
  boombox: {
    dimensions: { width: 500, height: 280, depth: 200 },
    defaultDrivers: [
      { id: '1', type: 'woofer', size: 100, position: { x: -0.25, y: 0 }, firing: 'front' },
      { id: '2', type: 'woofer', size: 100, position: { x: 0.25, y: 0 }, firing: 'front' },
    ],
    defaultPort: { type: 'passive', shape: 'circular', position: 'front', diameter: 80, length: 0, count: 2 },
    defaultName: 'Boombox'
  },
  subwoofer: {
    dimensions: { width: 400, height: 450, depth: 450 },
    defaultDrivers: [
      { id: '1', type: 'sub', size: 300, position: { x: 0, y: 0 }, firing: 'front' },
    ],
    defaultPort: { type: 'ported', shape: 'circular', position: 'front', diameter: 100, length: 200, count: 1 },
    defaultName: 'Subwoofer'
  },
};

// ==================== COLORES Y ETIQUETAS DE DRIVERS ====================

export const driverColors: Record<DriverType, string> = {
  sub: '#1a1a2e',
  woofer: '#2d2d44',
  mid: '#3d3d5c',
  tweeter: '#4a4a6a'
};

export const driverLabels: Record<DriverType, string> = {
  sub: 'Subwoofer',
  woofer: 'Woofer',
  mid: 'Midrange',
  tweeter: 'Tweeter'
};

// ==================== CONFIGURACIÓN POR DEFECTO ====================

export const defaultConfig: BoxConfig = {
  boxType: 'bookshelf',
  dimensions: { width: 250, height: 400, depth: 280 },
  material: 'wood',
  finish: 'matte',
  color: '#f5f5f0',
  thickness: 18,
  drivers: boxTypeConfigs.bookshelf.defaultDrivers,
  port: boxTypeConfigs.bookshelf.defaultPort,
  internalBracing: 'cross',
  chamberConfig: 'two-way',
  showInternal: false,
};
