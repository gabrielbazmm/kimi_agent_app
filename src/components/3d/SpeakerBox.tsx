import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import type { BoxConfig } from '@/types';
import type { Group } from 'three';
import { InternalBracing } from './InternalBracing';
import { InternalChambers } from './InternalChambers';
import { DriverMesh } from './DriverMesh';
import { Port } from './Port';

export function SpeakerBox({ config }: { config: BoxConfig }) {
  const meshRef = useRef<Group>(null);
  const { width, height, depth } = config.dimensions;
  const { thickness } = config;

  useFrame((state) => {
    if (meshRef.current) {
      const breathe = Math.sin(state.clock.elapsedTime * 0.5) * 0.002;
      meshRef.current.position.y = breathe;
    }
  });

  const scale = 0.003;
  const w = width * scale;
  const h = height * scale;
  const d = depth * scale;
  const t = thickness * scale;

  const getMaterial = () => {
    const roughness = config.finish === 'glossy' ? 0.08 : config.finish === 'matte' ? 0.85 : 0.45;
    const metalness = config.material === 'metal' ? 0.9 : config.material === 'mdf' ? 0.02 : 0.15;
    return (
      <meshPhysicalMaterial
        color={config.color}
        roughness={roughness}
        metalness={metalness}
        clearcoat={config.finish === 'glossy' ? 1 : 0}
        clearcoatRoughness={0.1}
      />
    );
  };

  return (
    <group ref={meshRef}>
      {/* Caja exterior con espesor */}
      <RoundedBox args={[w, h, d]} radius={0.01} smoothness={8} castShadow receiveShadow>
        {getMaterial()}
      </RoundedBox>

      {/* Estructura interna */}
      {config.showInternal && (
        <>
          <InternalBracing w={w - t * 2} h={h - t * 2} d={d - t * 2} bracingType={config.internalBracing} />
          <InternalChambers w={w - t * 2} h={h - t * 2} d={d - t * 2} chamberConfig={config.chamberConfig} />
        </>
      )}

      {/* Drivers */}
      {config.drivers.map((driver) => (
        <DriverMesh key={driver.id} driver={driver} w={w} h={h} d={d} />
      ))}

      {/* Puerto */}
      <Port config={config.port} w={w} h={h} d={d} />
    </group>
  );
}
