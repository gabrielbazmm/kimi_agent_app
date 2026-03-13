import { Speaker, RotateCcw, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { boxTypeConfigs } from '@/constants';
import type { BoxConfig } from '@/types';

interface DesignerHeaderProps {
  config: BoxConfig;
  onReset: () => void;
}

export function DesignerHeader({ config, onReset }: DesignerHeaderProps) {
  return (
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
                <Button variant="ghost" size="icon" onClick={onReset}>
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
  );
}
