import { useState, type Dispatch, type SetStateAction, type ReactNode } from 'react';
import { Box, Ruler, Speaker, AudioLines, Palette, BarChart3, type LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BoxTypePanel,
  DimensionsPanel,
  DriversPanel,
  PortPanel,
  MaterialsPanel,
  SpecsPanel
} from '@/components/panels';
import type { BoxConfig, DesignerTab } from '@/types';

interface DesignerSidebarProps {
  config: BoxConfig;
  setConfig: Dispatch<SetStateAction<BoxConfig>>;
}

const NAV_ITEMS: { id: DesignerTab; icon: LucideIcon; label: string }[] = [
  { id: 'type', icon: Box, label: 'Tipo' },
  { id: 'dims', icon: Ruler, label: 'Dim' },
  { id: 'drivers', icon: Speaker, label: 'Drv' },
  { id: 'port', icon: AudioLines, label: 'Port' },
  { id: 'mat', icon: Palette, label: 'Mat' },
  { id: 'specs', icon: BarChart3, label: 'Info' },
];

const TAB_CONFIG: Record<DesignerTab, { title: string }> = {
  type: { title: 'Tipo de Caja' },
  dims: { title: 'Dimensiones' },
  drivers: { title: 'Drivers' },
  port: { title: 'Puerto / Sintonia' },
  mat: { title: 'Materiales' },
  specs: { title: 'Especificaciones' },
};

function TabPanel({ tab, config, setConfig }: { tab: DesignerTab; config: BoxConfig; setConfig: Dispatch<SetStateAction<BoxConfig>> }) {
  const panels: Record<DesignerTab, ReactNode> = {
    type: <BoxTypePanel config={config} setConfig={setConfig} />,
    dims: <DimensionsPanel config={config} setConfig={setConfig} />,
    drivers: <DriversPanel config={config} setConfig={setConfig} />,
    port: <PortPanel config={config} setConfig={setConfig} />,
    mat: <MaterialsPanel config={config} setConfig={setConfig} />,
    specs: <SpecsPanel config={config} />,
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-sm font-medium tracking-wide text-neutral-500 uppercase">
          {TAB_CONFIG[tab].title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        {panels[tab]}
      </CardContent>
    </Card>
  );
}

export function DesignerSidebar({ config, setConfig }: DesignerSidebarProps) {
  const [activeTab, setActiveTab] = useState<DesignerTab>('specs');

  return (
    <div className="w-96 bg-white border-l border-neutral-200 flex flex-col">
      <div className="flex-1 overflow-auto p-6">
        <div className="w-full">
          <div className="w-full grid grid-cols-6 mb-6 bg-neutral-100 p-1 rounded-lg">
            {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex flex-col items-center gap-1 py-2 rounded-md transition-all duration-200 ${
                  activeTab === id
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px]">{label}</span>
              </button>
            ))}
          </div>

          <TabPanel tab={activeTab} config={config} setConfig={setConfig} />
        </div>
      </div>

      <div className="p-6 border-t border-neutral-200 bg-neutral-50">
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span>Boxlab Designer v3.0</span>
          <span className="flex items-center gap-1">Inspirado en <span className="font-medium">B&O</span></span>
        </div>
      </div>
    </div>
  );
}
