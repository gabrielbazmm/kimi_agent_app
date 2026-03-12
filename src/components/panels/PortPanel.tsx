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
          </SelectContent>
        </Select>
      </div>

      {config.port.type !== 'sealed' && (
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

          {config.port.type === 'ported' && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-xs">Longitud del tubo</Label>
                <span className="text-xs">{config.port.length} mm</span>
              </div>
              <Slider value={[config.port.length]} onValueChange={([v]) => setConfig(prev => ({ ...prev, port: { ...prev.port, length: v } }))} min={50} max={300} step={10} />
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
