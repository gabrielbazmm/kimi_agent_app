import { Canvas } from '@react-three/fiber';
import { Badge } from '@/components/ui/badge';
import { Scene } from '@/components/3d';
import type { BoxConfig } from '@/types';

interface DesignerViewportProps {
  config: BoxConfig;
}

export function DesignerViewport({ config }: DesignerViewportProps) {
  return (
    <div className="flex-1 relative bg-gradient-to-br from-neutral-100 to-neutral-200">
      <Canvas camera={{ position: [1.2, 0.5, 1.8], fov: 45 }} className="w-full h-full" shadows dpr={[1, 2]}>
        <Scene config={config} />
      </Canvas>

      <div className="absolute bottom-6 left-6 flex items-center gap-2 flex-wrap">
        <Badge variant="secondary" className="bg-white/80 backdrop-blur">
          {config.dimensions.width} x {config.dimensions.height} x {config.dimensions.depth} mm
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
  );
}
