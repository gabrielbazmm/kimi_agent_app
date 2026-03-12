import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Speaker, RotateCcw, Download, Box, Ruler, AudioLines, Palette, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scene } from '@/components/3d';
import {
  BoxTypePanel,
  DimensionsPanel,
  DriversPanel,
  PortPanel,
  MaterialsPanel,
  SpecsPanel
} from '@/components/panels';
import { defaultConfig, boxTypeConfigs } from '@/constants';
import type { BoxConfig, DesignerTab } from '@/types';

export function DesignerPage() {
  const [config, setConfig] = useState<BoxConfig>(defaultConfig);
  const [activeTab, setActiveTab] = useState<DesignerTab>('specs');

  const resetConfig = () => setConfig(defaultConfig);

  const navItems = [
    { id: 'type' as DesignerTab, icon: Box, label: 'Tipo' },
    { id: 'dims' as DesignerTab, icon: Ruler, label: 'Dim' },
    { id: 'drivers' as DesignerTab, icon: Speaker, label: 'Drv' },
    { id: 'port' as DesignerTab, icon: AudioLines, label: 'Port' },
    { id: 'mat' as DesignerTab, icon: Palette, label: 'Mat' },
    { id: 'specs' as DesignerTab, icon: BarChart3, label: 'Info' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-[1800px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
              <Speaker className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-medium tracking-tight text-neutral-900">Boxlab</h1>
              <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Designer</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-neutral-100">
              {boxTypeConfigs[config.boxType].defaultName}
            </Badge>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={resetConfig}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Restablecer</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-16 h-screen flex">
        <div className="flex-1 relative bg-gradient-to-br from-neutral-100 to-neutral-200">
          <Canvas camera={{ position: [1.2, 0.5, 1.8], fov: 45 }} className="w-full h-full" shadows dpr={[1, 2]}>
            <Scene config={config} />
          </Canvas>

          <div className="absolute bottom-6 left-6 flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="bg-white/80 backdrop-blur">
              {config.dimensions.width} × {config.dimensions.height} × {config.dimensions.depth} mm
            </Badge>
            <Badge variant="secondary" className="bg-white/80 backdrop-blur">
              {config.thickness}mm {config.material}
            </Badge>
            <Badge variant="secondary" className="bg-white/80 backdrop-blur">
              {config.drivers.length} drivers
            </Badge>
            {config.showInternal && (
              <Badge variant="secondary" className="bg-amber-100/80 text-amber-800 backdrop-blur">
                Interno visible
              </Badge>
            )}
          </div>

          <div className="absolute bottom-6 right-6 text-xs text-neutral-500 bg-white/80 backdrop-blur px-3 py-2 rounded-lg">
            Arrastra para rotar · Scroll para zoom
          </div>
        </div>

        <div className="w-96 bg-white border-l border-neutral-200 flex flex-col">
          <div className="flex-1 overflow-auto p-6">
            <div className="w-full">
              <div className="w-full grid grid-cols-6 mb-6 bg-neutral-100 p-1 rounded-lg">
                {navItems.map(({ id, icon: Icon, label }) => (
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

              {activeTab === 'type' && (
                <Card className="border-0 shadow-none">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-sm font-medium tracking-wide text-neutral-500 uppercase">Tipo de Caja</CardTitle>
                  </CardHeader>
                  <CardContent className="px-0">
                    <BoxTypePanel config={config} setConfig={setConfig} />
                  </CardContent>
                </Card>
              )}

              {activeTab === 'dims' && (
                <Card className="border-0 shadow-none">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-sm font-medium tracking-wide text-neutral-500 uppercase">Dimensiones</CardTitle>
                  </CardHeader>
                  <CardContent className="px-0">
                    <DimensionsPanel config={config} setConfig={setConfig} />
                  </CardContent>
                </Card>
              )}

              {activeTab === 'drivers' && (
                <Card className="border-0 shadow-none">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-sm font-medium tracking-wide text-neutral-500 uppercase">Drivers</CardTitle>
                  </CardHeader>
                  <CardContent className="px-0">
                    <DriversPanel config={config} setConfig={setConfig} />
                  </CardContent>
                </Card>
              )}

              {activeTab === 'port' && (
                <Card className="border-0 shadow-none">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-sm font-medium tracking-wide text-neutral-500 uppercase">Puerto / Sintonía</CardTitle>
                  </CardHeader>
                  <CardContent className="px-0">
                    <PortPanel config={config} setConfig={setConfig} />
                  </CardContent>
                </Card>
              )}

              {activeTab === 'mat' && (
                <Card className="border-0 shadow-none">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-sm font-medium tracking-wide text-neutral-500 uppercase">Materiales</CardTitle>
                  </CardHeader>
                  <CardContent className="px-0">
                    <MaterialsPanel config={config} setConfig={setConfig} />
                  </CardContent>
                </Card>
              )}

              {activeTab === 'specs' && (
                <Card className="border-0 shadow-none">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-sm font-medium tracking-wide text-neutral-500 uppercase">Especificaciones</CardTitle>
                  </CardHeader>
                  <CardContent className="px-0">
                    <SpecsPanel config={config} />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <div className="p-6 border-t border-neutral-200 bg-neutral-50">
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span>Boxlab Designer v3.0</span>
              <span className="flex items-center gap-1">Inspirado en <span className="font-medium">B&O</span></span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
