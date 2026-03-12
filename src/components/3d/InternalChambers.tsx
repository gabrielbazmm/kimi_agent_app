import type { ChamberConfig } from '@/types';

export function InternalChambers({ w, h, d, chamberConfig }: { w: number; h: number; d: number; chamberConfig: ChamberConfig }) {
  const dm = <meshStandardMaterial color="#654321" roughness={0.9} />;
  const dt = 0.012;

  return (
    <group>
      {chamberConfig === 'single' && (
        <mesh position={[0, 0, -d / 2 + dt / 2]}>
          <boxGeometry args={[w * 0.95, h * 0.95, dt]} />
          {dm}
        </mesh>
      )}

      {chamberConfig === 'two-way' && (
        <>
          <mesh position={[0, h * 0.15, 0]}><boxGeometry args={[w * 0.9, dt, d * 0.9]} />{dm}</mesh>
          <mesh position={[0, h * 0.35, -d / 2 + dt]}><boxGeometry args={[w * 0.4, h * 0.4, dt]} />{dm}</mesh>
        </>
      )}

      {chamberConfig === 'three-way' && (
        <>
          <mesh position={[0, h * 0.25, 0]}><boxGeometry args={[w * 0.9, dt, d * 0.9]} />{dm}</mesh>
          <mesh position={[0, -h * 0.15, 0]}><boxGeometry args={[w * 0.9, dt, d * 0.9]} />{dm}</mesh>
        </>
      )}
    </group>
  );
}
