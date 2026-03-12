import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Speaker } from 'lucide-react';
import { ParticleSpeaker } from '@/components/3d';

interface LandingPageProps {
  onStart: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  const [isExploding, setIsExploding] = useState(false);
  const [showUI, setShowUI] = useState(true);

  const handleStart = () => {
    setIsExploding(true);
    setShowUI(false);
  };

  const handleExplosionComplete = () => {
    setTimeout(onStart, 300);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col overflow-hidden">
      {/* Three.js Canvas */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 4.5], fov: 50 }} className="w-full h-full">
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 10, 7]} intensity={0.8} />
          <ParticleSpeaker isExploding={isExploding} onExplosionComplete={handleExplosionComplete} />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div
        className={`fixed inset-0 z-10 flex flex-col items-center justify-center transition-all duration-700 ${
          showUI ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Logo */}
        <div className="absolute top-8 left-8 flex items-center gap-3">
          <div className="w-10 h-10 border border-[#C5A96E]/50 flex items-center justify-center bg-[#C5A96E]/10">
            <Speaker className="w-5 h-5 text-[#C5A96E]" />
          </div>
          <div>
            <h1 className="text-lg font-medium tracking-tight text-white">BOXLAB</h1>
            <p className="text-[10px] text-neutral-400 uppercase tracking-widest">Designer</p>
          </div>
        </div>

        {/* Hero Content */}
        <div className="text-center">
          <h2 className="text-6xl md:text-8xl font-bold tracking-tighter mb-2 text-white text-center">
            BOXLAB
          </h2>
          <p className="text-[#C5A96E] tracking-[0.3em] text-sm md:text-base mb-12 uppercase">
            Sistema de Ingeniería Acústica
          </p>

          <button
            onClick={handleStart}
            className="group relative px-12 py-5 bg-transparent overflow-hidden rounded-none border border-[#C5A96E]/50 transition-all duration-300 hover:border-[#C5A96E] hover:shadow-[0_0_20px_rgba(197,169,110,0.3)]"
          >
            <div className="absolute inset-0 w-0 bg-[#C5A96E] transition-all duration-[250ms] ease-out group-hover:w-full opacity-10"></div>
            <span className="relative text-white group-hover:text-[#C5A96E] font-mono tracking-widest text-sm uppercase flex items-center gap-3">
              <span className="w-2 h-2 bg-[#C5A96E] rounded-full animate-pulse"></span>
              Iniciar Sistema
            </span>
          </button>
        </div>

        {/* Footer Info */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
          <p className="text-neutral-500 text-xs tracking-wider">
            Diseña cajas acústicas con precisión y elegancia escandinava
          </p>
        </div>
      </div>
    </div>
  );
}
