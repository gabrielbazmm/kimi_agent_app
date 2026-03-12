import type { InternalBracing as InternalBracingType } from '@/types';

export function InternalBracing({ w, h, d, bracingType }: { w: number; h: number; d: number; bracingType: InternalBracingType }) {
  if (bracingType === 'none') return null;
  const braceMaterial = <meshStandardMaterial color="#8B7355" roughness={0.8} />;
  const bt = 0.015;

  return (
    <group>
      {bracingType === 'simple' && (
        <>
          {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, z], i) => (
            <mesh key={i} position={[x * (w * 0.4), 0, z * (d * 0.4)]}>
              <boxGeometry args={[bt, h * 0.9, bt]} />
              {braceMaterial}
            </mesh>
          ))}
        </>
      )}

      {bracingType === 'cross' && (
        <>
          {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, z], i) => (
            <mesh key={`v${i}`} position={[x * (w * 0.4), 0, z * (d * 0.4)]}>
              <boxGeometry args={[bt, h * 0.9, bt]} />
              {braceMaterial}
            </mesh>
          ))}
          <mesh position={[0, h * 0.25, 0]}><boxGeometry args={[w * 0.8, bt, bt]} />{braceMaterial}</mesh>
          <mesh position={[0, h * 0.25, 0]}><boxGeometry args={[bt, bt, d * 0.8]} />{braceMaterial}</mesh>
          <mesh position={[0, -h * 0.25, 0]}><boxGeometry args={[w * 0.8, bt, bt]} />{braceMaterial}</mesh>
          <mesh position={[0, -h * 0.25, 0]}><boxGeometry args={[bt, bt, d * 0.8]} />{braceMaterial}</mesh>
        </>
      )}

      {bracingType === 'window' && (
        <>
          <mesh position={[0, 0, 0]}><boxGeometry args={[w * 0.15, h * 0.7, d * 0.7]} />{braceMaterial}</mesh>
          <mesh position={[0, 0, 0]}><boxGeometry args={[w * 0.05, h * 0.3, d * 0.3]} /><meshStandardMaterial color="#5a4a3a" roughness={0.8} /></mesh>
        </>
      )}

      {bracingType === 'full' && (
        <>
          <mesh position={[0, 0, 0]}><boxGeometry args={[bt, h * 0.95, d * 0.9]} />{braceMaterial}</mesh>
          <mesh position={[0, 0, 0]}><boxGeometry args={[w * 0.9, bt, d * 0.9]} />{braceMaterial}</mesh>
          <mesh position={[0, 0, 0]}><boxGeometry args={[w * 0.9, h * 0.95, bt]} />{braceMaterial}</mesh>
        </>
      )}
    </group>
  );
}
