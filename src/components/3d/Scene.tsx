import { Environment, ContactShadows, OrbitControls } from '@react-three/drei';
import type { BoxConfig } from '@/types';
import { SpeakerBox } from './SpeakerBox';

export function Scene({ config }: { config: BoxConfig }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 7]} intensity={1.2} castShadow shadow-mapSize={2048} />
      <directionalLight position={[-5, 5, -5]} intensity={0.4} />
      <spotLight position={[10, 10, 10]} angle={0.4} penumbra={0.3} intensity={1} castShadow />
      <pointLight position={[-10, -5, -10]} intensity={0.2} />
      <SpeakerBox config={config} />
      <ContactShadows position={[0, -0.01, 0]} opacity={0.25} scale={15} blur={3} far={5} />
      <Environment preset="studio" />
      <OrbitControls enablePan={false} minDistance={1} maxDistance={5} minPolarAngle={Math.PI / 8} maxPolarAngle={Math.PI / 2.2} autoRotate autoRotateSpeed={0.5} />
    </>
  );
}
