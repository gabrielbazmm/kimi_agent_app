import { useState, useEffect } from 'react';
import { Speaker } from 'lucide-react';
import { SoundWaveAnimation } from './SoundWaveAnimation';

interface LoadingPageProps {
  onComplete: () => void;
}

export function LoadingPage({ onComplete }: LoadingPageProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => prev >= 100 ? (clearInterval(interval), setTimeout(onComplete, 500), 100) : prev + 2);
    }, 40);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
          <Speaker className="w-5 h-5 text-neutral-900" />
        </div>
        <div>
          <h1 className="text-xl font-medium tracking-tight text-white">Boxlab</h1>
          <p className="text-[10px] text-neutral-400 uppercase tracking-widest">Designer</p>
        </div>
      </div>

      <div className="mb-12"><SoundWaveAnimation /></div>

      <div className="text-center mb-8">
        <p className="text-neutral-400 text-sm mb-2">Preparando el estudio de diseño</p>
        <p className="text-white text-2xl font-light">{progress}%</p>
      </div>

      <div className="w-64 h-1 bg-neutral-700 rounded-full overflow-hidden">
        <div className="h-full bg-white transition-all duration-100" style={{ width: `${progress}%` }} />
      </div>

      <div className="mt-8 h-6">
        {progress < 30 && <span className="text-neutral-500 text-xs">Cargando módulos 3D...</span>}
        {progress >= 30 && progress < 60 && <span className="text-neutral-500 text-xs">Inicializando materiales...</span>}
        {progress >= 60 && progress < 90 && <span className="text-neutral-500 text-xs">Configurando acústica...</span>}
        {progress >= 90 && <span className="text-neutral-500 text-xs">Listo</span>}
      </div>
    </div>
  );
}
