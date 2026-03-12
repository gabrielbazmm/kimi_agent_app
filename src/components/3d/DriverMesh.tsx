import type { Driver } from '@/types';
import { driverColors } from '@/constants';

export function DriverMesh({ driver, w, h, d }: { driver: Driver; w: number; h: number; d: number }) {
  const scale = 0.003;
  const radius = (driver.size / 2) * scale;
  const posX = driver.position.x * w;
  const posY = driver.position.y * h;

  let zOffset = d / 2 + 0.001;
  if (driver.firing === 'back') zOffset = -d / 2 - 0.001;
  
  if (driver.firing === 'up') {
    return (
      <group position={[posX, h / 2 + 0.001, driver.position.y * d]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[radius + 0.005, 48]} />
          <meshStandardMaterial color={driverColors[driver.type]} roughness={0.4} metalness={0.4} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
          <circleGeometry args={[radius * 0.9, 48]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.5} metalness={0.2} />
        </mesh>
      </group>
    );
  }

  return (
    <group position={[posX, posY, zOffset]}>
      <mesh>
        <circleGeometry args={[radius + 0.005, 48]} />
        <meshStandardMaterial color={driverColors[driver.type]} roughness={0.4} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0.005]}>
        <circleGeometry args={[radius * 0.9, 48]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.5} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0, 0.008]}>
        <circleGeometry args={[radius * 0.3, 24]} />
        <meshStandardMaterial color="#000" roughness={0.2} metalness={0.5} />
      </mesh>
    </group>
  );
}
