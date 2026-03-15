import { Environment, ContactShadows, OrbitControls } from '@react-three/drei';
import type { BoxConfig } from '@/types';
import { SpeakerBox } from './SpeakerBox';

export function Scene({ config }: { config: BoxConfig }) {
  return (
    <>
      {/* Premium dark environment with warm accent lighting */}
      <color attach="background" args={['#12151c']} />
      <fog attach="fog" args={['#12151c', 3, 12]} />
      
      {/* Main ambient - subtle warm tint */}
      <ambientLight intensity={0.3} color="#fff5e6" />
      
      {/* Key light - warm gold accent */}
      <directionalLight 
        position={[5, 8, 5]} 
        intensity={1.4} 
        color="#ffecd2" 
        castShadow 
        shadow-mapSize={2048}
        shadow-bias={-0.0001}
      />
      
      {/* Fill light - cool blue for contrast */}
      <directionalLight position={[-5, 3, -5]} intensity={0.5} color="#a0c4ff" />
      
      {/* Rim/back light - highlights edges */}
      <spotLight 
        position={[-3, 6, -6]} 
        angle={0.5} 
        penumbra={0.5} 
        intensity={0.8} 
        color="#ffffff" 
        castShadow 
      />
      
      {/* Accent spot - gold highlight */}
      <spotLight 
        position={[4, 2, 4]} 
        angle={0.6} 
        penumbra={0.8} 
        intensity={0.6} 
        color="#c49b46" 
      />
      
      {/* Subtle under-glow */}
      <pointLight position={[0, -2, 0]} intensity={0.15} color="#c49b46" />
      
      <SpeakerBox config={config} />
      
      {/* Enhanced shadow for depth */}
      <ContactShadows 
        position={[0, -0.01, 0]} 
        opacity={0.6} 
        scale={12} 
        blur={2.5} 
        far={4}
        color="#000000"
      />
      
      <Environment preset="night" />
      <OrbitControls 
        enablePan={false} 
        minDistance={1} 
        maxDistance={5} 
        minPolarAngle={Math.PI / 8} 
        maxPolarAngle={Math.PI / 2.2} 
        autoRotate 
        autoRotateSpeed={0.3}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
}
