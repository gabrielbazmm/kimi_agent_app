import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import type { BoxConfig, BoxDimensions } from '@/types';

interface DimensionsPanelProps {
  config: BoxConfig;
  setConfig: React.Dispatch<React.SetStateAction<BoxConfig>>;
}

export function DimensionsPanel({ config, setConfig }: DimensionsPanelProps) {
  const updateDimension = (key: keyof BoxDimensions, value: number) => {
    setConfig(prev => ({ ...prev, dimensions: { ...prev.dimensions, [key]: value } }));
  };

  const getMaxDimensions = () => {
    switch (config.boxType) {
      case 'tower': return { w: 500, h: 1500, d: 600 };
      case 'soundbar': return { w: 1500, h: 200, d: 250 };
      case 'boombox': return { w: 800, h: 500, d: 350 };
      default: return { w: 600, h: 800, d: 500 };
    }
  };

  const maxDims = getMaxDimensions();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {[
          { key: 'width', label: 'Ancho', min: 80, max: maxDims.w, unit: 'mm' },
          { key: 'height', label: 'Alto', min: 100, max: maxDims.h, unit: 'mm' },
          { key: 'depth', label: 'Profundidad', min: 60, max: maxDims.d, unit: 'mm' },
        ].map(({ key, label, min, max, unit }) => (
          <div key={key} className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-medium tracking-wide text-neutral-500 uppercase">{label}</Label>
              <span className="text-sm font-light text-neutral-700">{config.dimensions[key as keyof BoxDimensions]} {unit}</span>
            </div>
            <Slider
              value={[config.dimensions[key as keyof BoxDimensions]]}
              onValueChange={([v]) => updateDimension(key as keyof BoxDimensions, v)}
              min={min}
              max={max}
              step={5}
            />
          </div>
        ))}
      </div>

      <Separator className="bg-neutral-200" />

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label className="text-xs font-medium tracking-wide text-neutral-500 uppercase">Espesor del material</Label>
          <span className="text-sm font-light text-neutral-700">{config.thickness} mm</span>
        </div>
        <Slider
          value={[config.thickness]}
          onValueChange={([v]) => setConfig(prev => ({ ...prev, thickness: v }))}
          min={12}
          max={50}
          step={3}
        />
        <p className="text-xs text-neutral-500">Afecta el volumen interno neto</p>
      </div>
    </div>
  );
}
