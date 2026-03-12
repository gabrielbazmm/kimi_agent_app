import { BookOpen, SpeakerIcon, Monitor, AudioLines, Grid3X3 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import type { BoxType, BoxConfig } from '@/types';
import { boxTypeConfigs } from '@/constants';

interface BoxTypePanelProps {
  config: BoxConfig;
  setConfig: React.Dispatch<React.SetStateAction<BoxConfig>>;
}

export function BoxTypePanel({ config, setConfig }: BoxTypePanelProps) {
  const boxTypes: { id: BoxType; label: string; icon: typeof BookOpen; desc: string }[] = [
    { id: 'bookshelf', label: 'Bookshelf', icon: BookOpen, desc: 'Compacta, para estantería' },
    { id: 'tower', label: 'Torre', icon: SpeakerIcon, desc: 'Altavoz de suelo' },
    { id: 'monitor', label: 'Monitor', icon: Monitor, desc: 'Estudio, nearfield' },
    { id: 'soundbar', label: 'Soundbar', icon: AudioLines, desc: 'TV, cine en casa' },
    { id: 'boombox', label: 'Boombox', icon: Grid3X3, desc: 'Portátil, retro' },
  ];

  const handleTypeChange = (type: BoxType) => {
    const typeConfig = boxTypeConfigs[type];
    setConfig(prev => ({
      ...prev,
      boxType: type,
      dimensions: { ...typeConfig.dimensions },
      drivers: typeConfig.defaultDrivers,
      port: typeConfig.defaultPort,
    }));
  };

  return (
    <div className="space-y-4">
      <Label className="text-xs font-medium tracking-wide text-neutral-500 uppercase">Tipo de Caja</Label>
      <div className="grid grid-cols-1 gap-2">
        {boxTypes.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => handleTypeChange(t.id)}
              className={`w-full p-3 text-left border rounded-xl transition-all duration-200 ${
                config.boxType === t.id ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${config.boxType === t.id ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium text-neutral-800">{t.label}</div>
                  <div className="text-sm text-neutral-500">{t.desc}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
