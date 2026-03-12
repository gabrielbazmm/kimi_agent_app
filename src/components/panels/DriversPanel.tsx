import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { BoxConfig, Driver, DriverType, FiringDirection } from '@/types';
import { driverColors, driverLabels } from '@/constants';

interface DriversPanelProps {
  config: BoxConfig;
  setConfig: React.Dispatch<React.SetStateAction<BoxConfig>>;
}

export function DriversPanel({ config, setConfig }: DriversPanelProps) {
  const addDriver = () => {
    const newDriver: Driver = {
      id: Date.now().toString(),
      type: 'woofer',
      size: 130,
      position: { x: 0, y: 0 },
      firing: 'front'
    };
    setConfig(prev => ({ ...prev, drivers: [...prev.drivers, newDriver] }));
  };

  const updateDriver = (id: string, updates: Partial<Driver>) => {
    setConfig(prev => ({
      ...prev,
      drivers: prev.drivers.map(d => d.id === id ? { ...d, ...updates } : d)
    }));
  };

  const removeDriver = (id: string) => {
    setConfig(prev => ({ ...prev, drivers: prev.drivers.filter(d => d.id !== id) }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium tracking-wide text-neutral-500 uppercase">Drivers ({config.drivers.length})</Label>
        <Button size="sm" variant="outline" onClick={addDriver} disabled={config.drivers.length >= 6}>
          + Añadir
        </Button>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {config.drivers.map((driver, index) => (
          <Accordion key={driver.id} type="single" collapsible className="border rounded-lg">
            <AccordionItem value="item-1" className="border-0">
              <AccordionTrigger className="px-3 py-2 hover:no-underline">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: driverColors[driver.type] }} />
                  <span className="text-sm font-medium">{driverLabels[driver.type]} {index + 1}</span>
                  <span className="text-xs text-neutral-500">{driver.size}mm</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-3 pb-3">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-xs">Tipo</Label>
                    <Select value={driver.type} onValueChange={(v) => updateDriver(driver.id, { type: v as DriverType })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sub">Subwoofer</SelectItem>
                        <SelectItem value="woofer">Woofer</SelectItem>
                        <SelectItem value="mid">Midrange</SelectItem>
                        <SelectItem value="tweeter">Tweeter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between"><Label className="text-xs">Tamaño</Label><span className="text-xs">{driver.size}mm</span></div>
                    <Slider value={[driver.size]} onValueChange={([v]) => updateDriver(driver.id, { size: v })} min={20} max={460} step={5} />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Dirección (Firing)</Label>
                    <Select value={driver.firing} onValueChange={(v) => updateDriver(driver.id, { firing: v as FiringDirection })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="front">Frontal</SelectItem>
                        <SelectItem value="back">Trasero</SelectItem>
                        <SelectItem value="up">Superior</SelectItem>
                        <SelectItem value="down">Inferior</SelectItem>
                        <SelectItem value="side">Lateral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between"><Label className="text-xs">Posición X</Label></div>
                    <Slider value={[driver.position.x * 100]} onValueChange={([v]) => updateDriver(driver.id, { position: { ...driver.position, x: v / 100 } })} min={-50} max={50} step={5} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between"><Label className="text-xs">Posición Y</Label></div>
                    <Slider value={[driver.position.y * 100]} onValueChange={([v]) => updateDriver(driver.id, { position: { ...driver.position, y: v / 100 } })} min={-50} max={50} step={5} />
                  </div>

                  <Button size="sm" variant="destructive" className="w-full" onClick={() => removeDriver(driver.id)}>
                    Eliminar driver
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </div>
  );
}
