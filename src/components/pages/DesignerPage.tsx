import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Speaker, RotateCcw, Download, Box, Ruler, AudioLines, Palette, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Scene } from '@/components/3d';
import {
  BoxTypePanel,
  DimensionsPanel,
  DriversPanel,
  PortPanel,
  MaterialsPanel,
  SpecsPanel
} from '@/components/panels';
import { ScrollArea } from '@/components/ui/scroll-area';
import { defaultConfig, boxTypeConfigs } from '@/constants';
import type { BoxConfig, DesignerTab } from '@/types';

export function DesignerPage() {
  const [config, setConfig] = useState<BoxConfig>(defaultConfig);
  const [activeTab, setActiveTab] = useState<DesignerTab>('specs');

  const resetConfig = () => setConfig(defaultConfig);

  const navItems = [
    { id: 'type' as DesignerTab, icon: Box, label: 'Tipo' },
    { id: 'dims' as DesignerTab, icon: Ruler, label: 'Dimensiones' },
    { id: 'drivers' as DesignerTab, icon: Speaker, label: 'Drivers' },
    { id: 'port' as DesignerTab, icon: AudioLines, label: 'Puerto' },
    { id: 'mat' as DesignerTab, icon: Palette, label: 'Material' },
    { id: 'specs' as DesignerTab, icon: BarChart3, label: 'Specs' },
  ];

  const renderPanel = () => {
    switch (activeTab) {
      case 'type':
        return <BoxTypePanel config={config} setConfig={setConfig} />;
      case 'dims':
        return <DimensionsPanel config={config} setConfig={setConfig} />;
      case 'drivers':
        return <DriversPanel config={config} setConfig={setConfig} />;
      case 'port':
        return <PortPanel config={config} setConfig={setConfig} />;
      case 'mat':
        return <MaterialsPanel config={config} setConfig={setConfig} />;
      case 'specs':
        return <SpecsPanel config={config} />;
      default:
        return null;
    }
  };

  const panelTitles: Record<DesignerTab, string> = {
    type: 'Tipo de Caja',
    dims: 'Dimensiones',
    drivers: 'Drivers',
    port: 'Puerto / Sintonía',
    mat: 'Materiales',
    specs: 'Especificaciones',
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex-shrink-0 h-14 bg-card border-b border-border z-50">
        <div className="h-full px-4 lg:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 gradient-gold rounded-lg flex items-center justify-center shadow-premium-sm">
              <Speaker className="w-4 h-4 text-background" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base font-semibold tracking-tight text-foreground">Boxlab</h1>
              <p className="text-[10px] text-gold-muted uppercase tracking-premium">Designer Pro</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Badge variant="secondary" className="bg-secondary text-secondary-foreground text-xs border border-border">
              {boxTypeConfigs[config.boxType].defaultName}
            </Badge>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary" onClick={resetConfig}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Restablecer</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button size="sm" className="gap-2 h-8 gradient-gold text-background hover:opacity-90 shadow-gold-glow">
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-xs font-medium">Exportar</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex min-h-0">
        {/* Left Sidebar - Navigation */}
        <aside className="flex-shrink-0 w-16 lg:w-20 bg-card border-r border-border flex flex-col py-4">
          <nav className="flex-1 flex flex-col items-center gap-1.5">
            {navItems.map(({ id, icon: Icon, label }) => (
              <TooltipProvider key={id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setActiveTab(id)}
                      className={`w-12 h-12 lg:w-14 lg:h-14 flex flex-col items-center justify-center gap-1 rounded-xl transition-premium ${
                        activeTab === id
                          ? 'gradient-gold text-background shadow-gold-glow'
                          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-[9px] lg:text-[10px] font-medium leading-none hidden lg:block">{label}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="lg:hidden">
                    <p>{label}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </nav>
          
          <div className="flex flex-col items-center pt-4 border-t border-border mx-3">
            <span className="text-[9px] text-muted-foreground font-medium">v3.0</span>
          </div>
        </aside>

        {/* 3D Canvas */}
        <div className="flex-1 relative gradient-premium min-w-0">
          <Canvas camera={{ position: [1.2, 0.5, 1.8], fov: 45 }} className="w-full h-full" shadows dpr={[1, 2]}>
            <Scene config={config} />
          </Canvas>

          {/* Bottom Status Bar */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="glass-dark border border-border shadow-premium-sm text-xs text-foreground">
                {config.dimensions.width} × {config.dimensions.height} × {config.dimensions.depth} mm
              </Badge>
              <Badge variant="secondary" className="glass-dark border border-border shadow-premium-sm text-xs text-foreground">
                {config.thickness}mm {config.material}
              </Badge>
              <Badge variant="secondary" className="glass-dark border border-border shadow-premium-sm text-xs text-foreground">
                {config.drivers.length} driver{config.drivers.length !== 1 ? 's' : ''}
              </Badge>
              {config.showInternal && (
                <Badge variant="secondary" className="glass-dark border-gold shadow-gold-glow text-xs text-gold">
                  Vista interna
                </Badge>
              )}
            </div>
            <div className="text-[10px] text-muted-foreground glass-dark border border-border px-2.5 py-1.5 rounded-md shadow-premium-sm hidden sm:block">
              Arrastra para rotar · Scroll para zoom
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <aside className="flex-shrink-0 w-80 lg:w-96 xl:w-[420px] bg-card border-l border-border flex flex-col min-h-0">
          {/* Panel Header */}
          <div className="flex-shrink-0 px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground tracking-wide">
              {panelTitles[activeTab]}
            </h2>
          </div>
          
          {/* Panel Content */}
          <ScrollArea className="flex-1">
            <div className="p-5">
              {renderPanel()}
            </div>
          </ScrollArea>
        </aside>
      </main>
    </div>
  );
}
