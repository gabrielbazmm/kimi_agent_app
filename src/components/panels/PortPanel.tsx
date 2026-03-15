import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { BoxConfig, PortType, PortShape, PortPosition } from '@/types';

interface PortPanelProps {
  config: BoxConfig;
  setConfig: React.Dispatch<React.SetStateAction<BoxConfig>>;
}

export function PortPanel({ config, setConfig }: PortPanelProps) {
  const isSubwoofer = config.boxType === 'subwoofer';
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs font-medium tracking-wide text-neutral-500 uppercase">Tipo de Sintonía</Label>
        <Select value={config.port.type} onValueChange={(v) => setConfig(prev => ({ ...prev, port: { ...prev.port, type: v as PortType } }))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="sealed">Cerrada (Sealed)</SelectItem>
            <SelectItem value="ported">Con puerto (Bass Reflex)</SelectItem>
            <SelectItem value="passive">Radiador pasivo</SelectItem>
            {isSubwoofer && (
              <>
                <SelectItem value="bandpass">Paso banda (Bandpass)</SelectItem>
                <SelectItem value="transmission-line">Línea de transmisión</SelectItem>
                <SelectItem value="horn-loaded">Cargado a bocina (Horn)</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
        {isSubwoofer && (
          <p className="text-[10px] text-neutral-400 mt-1">
            {config.port.type === 'bandpass' && 'Diseño con cámara sellada + cámara con puerto. Mayor eficiencia en rango específico.'}
            {config.port.type === 'transmission-line' && 'Línea acústica que absorbe ondas traseras. Graves profundos y limpios.'}
            {config.port.type === 'horn-loaded' && 'Bocina que amplifica eficiencia. Máximo SPL y alcance.'}
          </p>
        )}
      </div>

      {(config.port.type !== 'sealed' && config.port.type !== 'horn-loaded') && (
        <>
          <Separator className="bg-neutral-200" />

          <div className="space-y-2">
            <Label className="text-xs font-medium tracking-wide text-neutral-500 uppercase">Forma del puerto</Label>
            <Select value={config.port.shape} onValueChange={(v) => setConfig(prev => ({ ...prev, port: { ...prev.port, shape: v as PortShape } }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="circular">Circular</SelectItem>
                <SelectItem value="slot">Ranura (Slot)</SelectItem>
                <SelectItem value="rectangular">Rectangular</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium tracking-wide text-neutral-500 uppercase">Posición</Label>
            <Select value={config.port.position} onValueChange={(v) => setConfig(prev => ({ ...prev, port: { ...prev.port, position: v as PortPosition } }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="front">Frontal</SelectItem>
                <SelectItem value="back">Trasera</SelectItem>
                <SelectItem value="bottom">Inferior</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs">Diámetro/Ancho</Label>
              <span className="text-xs">{config.port.diameter} mm</span>
            </div>
            <Slider value={[config.port.diameter]} onValueChange={([v]) => setConfig(prev => ({ ...prev, port: { ...prev.port, diameter: v } }))} min={25} max={150} step={5} />
          </div>

          {(config.port.type === 'ported' || config.port.type === 'bandpass') && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-xs">Longitud del tubo</Label>
                <span className="text-xs">{config.port.length} mm</span>
              </div>
              <Slider value={[config.port.length]} onValueChange={([v]) => setConfig(prev => ({ ...prev, port: { ...prev.port, length: v } }))} min={50} max={300} step={10} />
            </div>
          )}

          {config.port.type === 'transmission-line' && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-xs">Longitud de línea</Label>
                <span className="text-xs">{config.port.length} mm</span>
              </div>
              <Slider value={[config.port.length]} onValueChange={([v]) => setConfig(prev => ({ ...prev, port: { ...prev.port, length: v } }))} min={500} max={3000} step={50} />
              <p className="text-[10px] text-neutral-400">Típicamente 1/4 de longitud de onda de la frecuencia objetivo</p>
            </div>
          )}

          {config.port.type === 'bandpass' && (
            <div className="p-2 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-[10px] text-amber-700">
                Diseño de 4to orden: cámara sellada trasera + cámara porteada frontal.
                El puerto actúa como única salida de sonido.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs">Cantidad de puertos</Label>
              <span className="text-xs">{config.port.count}</span>
            </div>
            <Slider value={[config.port.count]} onValueChange={([v]) => setConfig(prev => ({ ...prev, port: { ...prev.port, count: v } }))} min={1} max={4} step={1} />
          </div>
        </>
      )}
    </div>
  );
}
