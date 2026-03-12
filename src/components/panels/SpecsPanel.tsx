import { useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import type { BoxConfig } from '@/types';

interface SpecsPanelProps {
  config: BoxConfig;
}

function FrequencyResponseGraph({ config }: { config: BoxConfig }) {
  const data = useMemo(() => {
    const points = [];
    for (let f = 20; f <= 20000; f *= 1.1) {
      let response = 0;
      const volume = (config.dimensions.width * config.dimensions.height * config.dimensions.depth) / 1000000;

      // Simulación simplificada de respuesta
      if (config.port.type === 'ported') {
        // Respuesta extendida en bajos para ported
        response = -3 * Math.exp(-f / 80) + Math.sin(f / 1000) * 2;
      } else if (config.port.type === 'sealed') {
        // Roll-off más pronunciado para sealed
        response = -6 * Math.exp(-f / 60) + Math.sin(f / 1000) * 1.5;
      } else {
        response = -4 * Math.exp(-f / 70) + Math.sin(f / 1000) * 2;
      }

      // Efecto del volumen
      response += Math.log10(volume) * 2;

      points.push({
        freq: Math.round(f),
        db: Math.max(-30, Math.min(5, response)),
        freqLabel: f < 100 ? `${f}Hz` : f < 1000 ? `${f}Hz` : `${Math.round(f/10)/10}k`
      });
    }
    return points;
  }, [config]);

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorDb" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1a1a1a" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#1a1a1a" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
          <XAxis
            dataKey="freq"
            scale="log"
            domain={[20, 20000]}
            tickFormatter={(v) => v < 1000 ? `${v}` : `${v/1000}k`}
            type="number"
            stroke="#999"
            fontSize={10}
          />
          <YAxis domain={[-30, 5]} stroke="#999" fontSize={10} unit="dB" />
          <RechartsTooltip
            formatter={(v: number) => [`${v.toFixed(1)} dB`, 'Respuesta']}
            labelFormatter={(l) => `${l} Hz`}
          />
          <Area type="monotone" dataKey="db" stroke="#1a1a1a" fillOpacity={1} fill="url(#colorDb)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function VolumeGraph({ config }: { config: BoxConfig }) {
  const data = useMemo(() => {
    const internalVolume = (config.dimensions.width * config.dimensions.height * config.dimensions.depth) / 1000000 * 0.85;
    const bracingVolume = internalVolume * (config.internalBracing === 'full' ? 0.15 : config.internalBracing === 'cross' ? 0.08 : config.internalBracing === 'simple' ? 0.03 : 0);
    const netVolume = internalVolume - bracingVolume;

    return [
      { name: 'Volumen Bruto', value: internalVolume / 0.85, fill: '#e5e5e5' },
      { name: 'Bracing', value: bracingVolume, fill: '#8B7355' },
      { name: 'Volumen Neto', value: netVolume, fill: '#1a1a1a' },
    ];
  }, [config]);

  const total = data.reduce((acc, d) => acc + d.value, 0);

  return (
    <div className="space-y-2">
      {data.map((item) => (
        <div key={item.name} className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: item.fill }} />
          <span className="text-xs text-neutral-600 flex-1">{item.name}</span>
          <span className="text-xs font-medium">{item.value.toFixed(1)} L</span>
          <span className="text-xs text-neutral-400">({((item.value / total) * 100).toFixed(0)}%)</span>
        </div>
      ))}
      <div className="h-2 bg-neutral-200 rounded-full overflow-hidden flex">
        {data.map((item, i) => (
          <div
            key={i}
            className="h-full transition-all"
            style={{
              width: `${(item.value / total) * 100}%`,
              backgroundColor: item.fill
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function SpecsPanel({ config }: SpecsPanelProps) {
  const { width, height, depth } = config.dimensions;
  const { thickness } = config;
  const grossVolume = (width * height * depth) / 1000000;
  const internalVolume = ((width - thickness * 2) * (height - thickness * 2) * (depth - thickness * 2)) / 1000000;
  const bracingVolume = internalVolume * (config.internalBracing === 'full' ? 0.15 : config.internalBracing === 'cross' ? 0.08 : config.internalBracing === 'simple' ? 0.03 : 0);
  const netVolume = Math.max(0, internalVolume - bracingVolume);
  const surfaceArea = 2 * (width * height + width * depth + height * depth) / 10000;
  const tuningFreq = config.port.type === 'ported' ? Math.round(35 + (1000 / netVolume) * 0.5) : config.port.type === 'sealed' ? Math.round(45 + (800 / netVolume)) : 40;

  const specs = [
    { label: 'Volumen bruto', value: `${grossVolume.toFixed(2)} L` },
    { label: 'Volumen interno', value: `${internalVolume.toFixed(2)} L` },
    { label: 'Volumen neto', value: `${netVolume.toFixed(2)} L` },
    { label: 'Bracing', value: `${bracingVolume.toFixed(2)} L` },
    { label: 'Área superficial', value: `${surfaceArea.toFixed(1)} dm²` },
    { label: 'Ratio H/W', value: `${(height / width).toFixed(2)}:1` },
    { label: 'Espesor', value: `${thickness} mm` },
    { label: 'Frec. sintonía', value: `~${tuningFreq} Hz` },
    { label: 'Drivers', value: `${config.drivers.length}` },
    { label: 'Puertos', value: `${config.port.count}` },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs font-medium tracking-wide text-neutral-500 uppercase">Respuesta de Frecuencia (Simulada)</Label>
        <FrequencyResponseGraph config={config} />
      </div>

      <Separator className="bg-neutral-200" />

      <div className="space-y-2">
        <Label className="text-xs font-medium tracking-wide text-neutral-500 uppercase">Distribución de Volumen</Label>
        <VolumeGraph config={config} />
      </div>

      <Separator className="bg-neutral-200" />

      <div className="space-y-2">
        <Label className="text-xs font-medium tracking-wide text-neutral-500 uppercase">Especificaciones</Label>
        <div className="grid grid-cols-2 gap-2">
          {specs.map((spec, i) => (
            <div key={i} className="p-2 bg-neutral-50 rounded-lg">
              <div className="text-[10px] text-neutral-500 uppercase tracking-wide">{spec.label}</div>
              <div className="text-sm font-medium text-neutral-800">{spec.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
