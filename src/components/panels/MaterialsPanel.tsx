import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { BoxConfig } from '@/types';

interface MaterialsPanelProps {
  config: BoxConfig;
  setConfig: React.Dispatch<React.SetStateAction<BoxConfig>>;
}

export function MaterialsPanel({ config, setConfig }: MaterialsPanelProps) {
  const materials = [
    { id: 'wood', label: 'Madera', desc: 'Roble natural' },
    { id: 'mdf', label: 'MDF', desc: 'Densidad media' },
    { id: 'metal', label: 'Aluminio', desc: 'Cepillado' },
    { id: 'fabric', label: 'Tela', desc: 'Kvadrat' },
  ] as const;

  const finishes = [
    { id: 'matte', label: 'Mate' },
    { id: 'glossy', label: 'Brillante' },
    { id: 'textured', label: 'Texturizado' },
  ] as const;

  const colors = [
    { id: '#f5f5f0', label: 'Blanco natural', class: 'bg-[#f5f5f0]' },
    { id: '#2a2a2a', label: 'Negro antracita', class: 'bg-[#2a2a2a]' },
    { id: '#8b7355', label: 'Roble', class: 'bg-[#8b7355]' },
    { id: '#c4b8a8', label: 'Gris calido', class: 'bg-[#c4b8a8]' },
    { id: '#4a5568', label: 'Gris frío', class: 'bg-[#4a5568]' },
    { id: '#1a365d', label: 'Azul medianoche', class: 'bg-[#1a365d]' },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-xs font-medium tracking-wide text-neutral-500 uppercase">Material</Label>
        <div className="grid grid-cols-2 gap-2">
          {materials.map((m) => (
            <button
              key={m.id}
              onClick={() => setConfig(prev => ({ ...prev, material: m.id }))}
              className={`p-3 text-left border rounded-lg transition-all duration-200 ${
                config.material === m.id ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="text-sm font-medium text-neutral-800">{m.label}</div>
              <div className="text-xs text-neutral-500">{m.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-xs font-medium tracking-wide text-neutral-500 uppercase">Acabado</Label>
        <div className="flex gap-2">
          {finishes.map((f) => (
            <button
              key={f.id}
              onClick={() => setConfig(prev => ({ ...prev, finish: f.id }))}
              className={`flex-1 py-2 px-3 text-sm border rounded-lg transition-all duration-200 ${
                config.finish === f.id ? 'border-neutral-900 bg-neutral-50 text-neutral-900' : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-xs font-medium tracking-wide text-neutral-500 uppercase">Color</Label>
        <div className="grid grid-cols-3 gap-2">
          {colors.map((c) => (
            <TooltipProvider key={c.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setConfig(prev => ({ ...prev, color: c.id }))}
                    className={`h-12 rounded-lg border-2 transition-all duration-200 ${c.class} ${
                      config.color === c.id ? 'border-neutral-900 scale-105' : 'border-transparent hover:border-neutral-300'
                    }`}
                  />
                </TooltipTrigger>
                <TooltipContent><p className="text-xs">{c.label}</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    </div>
  );
}
