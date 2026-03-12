import { useState, useCallback } from 'react';
import type { BoxConfig, BoxType, BoxDimensions, Driver } from '@/types';
import { defaultConfig, boxTypeConfigs } from '@/constants';

export function useBoxConfig() {
  const [config, setConfig] = useState<BoxConfig>(defaultConfig);

  const resetConfig = useCallback(() => {
    setConfig(defaultConfig);
  }, []);

  const setBoxType = useCallback((type: BoxType) => {
    const typeConfig = boxTypeConfigs[type];
    setConfig(prev => ({
      ...prev,
      boxType: type,
      dimensions: { ...typeConfig.dimensions },
      drivers: typeConfig.defaultDrivers,
      port: typeConfig.defaultPort,
    }));
  }, []);

  const updateDimensions = useCallback((updates: Partial<BoxDimensions>) => {
    setConfig(prev => ({ ...prev, dimensions: { ...prev.dimensions, ...updates } }));
  }, []);

  const updateDriver = useCallback((id: string, updates: Partial<Driver>) => {
    setConfig(prev => ({
      ...prev,
      drivers: prev.drivers.map(d => d.id === id ? { ...d, ...updates } : d)
    }));
  }, []);

  const addDriver = useCallback(() => {
    const newDriver: Driver = {
      id: Date.now().toString(),
      type: 'woofer',
      size: 130,
      position: { x: 0, y: 0 },
      firing: 'front'
    };
    setConfig(prev => ({ ...prev, drivers: [...prev.drivers, newDriver] }));
  }, []);

  const removeDriver = useCallback((id: string) => {
    setConfig(prev => ({ ...prev, drivers: prev.drivers.filter(d => d.id !== id) }));
  }, []);

  return {
    config,
    setConfig,
    resetConfig,
    setBoxType,
    updateDimensions,
    updateDriver,
    addDriver,
    removeDriver,
  };
}
