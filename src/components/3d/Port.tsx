import { DoubleSide } from 'three';
import type { PortConfig } from '@/types';

export function Port({ config, w, h, d }: { config: PortConfig; w: number; h: number; d: number }) {
  if (config.type === 'sealed' || config.type === 'horn-loaded') return null;

  const scale = 0.003;
  const portRadius = (config.diameter / 2) * scale;
  const portDepth = config.length * scale;

  let position: [number, number, number] = [w * 0.25, -h * 0.25, d / 2 + 0.001];
  let rotation: [number, number, number] = [0, 0, 0];

  if (config.position === 'back') {
    position = [w * 0.25, -h * 0.25, -d / 2 - 0.001];
    rotation = [0, Math.PI, 0];
  } else if (config.position === 'bottom') {
    position = [0, -h / 2 - 0.001, 0];
    rotation = [-Math.PI / 2, 0, 0];
  }

  if (config.type === 'passive') {
    return (
      <group position={position} rotation={rotation}>
        {/* Passive radiator cone */}
        <mesh position={[0, 0, 0.005]}>
          <cylinderGeometry args={[portRadius * 1.5, portRadius * 1.2, 0.008, 32, 1, false]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.3} />
        </mesh>
        {/* Surround */}
        <mesh>
          <torusGeometry args={[portRadius * 1.5, 0.008, 8, 32]} />
          <meshStandardMaterial color="#111" roughness={0.6} />
        </mesh>
      </group>
    );
  }

  // Bandpass: larger port opening with distinctive grille
  if (config.type === 'bandpass') {
    const grillSize = portRadius * 2;
    return (
      <group position={position} rotation={rotation}>
        {/* Main port opening - larger for bandpass */}
        <mesh position={[0, 0, 0.002]}>
          <ringGeometry args={[portRadius * 0.9, portRadius * 1.2, 32]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.003]}>
          <circleGeometry args={[portRadius * 0.9, 32]} />
          <meshStandardMaterial color="#050505" roughness={0.9} />
        </mesh>
        {/* Protective grille bars */}
        {[-0.6, -0.2, 0.2, 0.6].map((offset, i) => (
          <mesh key={i} position={[offset * grillSize, 0, 0.006]}>
            <boxGeometry args={[0.004, grillSize * 1.8, 0.003]} />
            <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.5} />
          </mesh>
        ))}
        {/* Port tube */}
        {portDepth > 0.01 && (
          <mesh position={[0, 0, -portDepth / 2]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[portRadius * 0.9, portRadius * 0.9, portDepth, 32, 1, true]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.6} side={DoubleSide} />
          </mesh>
        )}
      </group>
    );
  }

  // Transmission line: slot-like vent at bottom
  if (config.type === 'transmission-line') {
    const slotWidth = portRadius * 3;
    const slotHeight = portRadius * 0.5;
    return (
      <group position={position} rotation={rotation}>
        {/* Narrow slot opening */}
        <mesh position={[0, 0, 0.002]}>
          <boxGeometry args={[slotWidth + 0.015, slotHeight + 0.015, 0.004]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.003]}>
          <boxGeometry args={[slotWidth, slotHeight, 0.005]} />
          <meshStandardMaterial color="#020202" roughness={0.9} />
        </mesh>
        {/* Acoustic damping material visible inside */}
        <mesh position={[0, 0, -0.02]}>
          <boxGeometry args={[slotWidth * 0.9, slotHeight * 0.8, 0.03]} />
          <meshStandardMaterial color="#3a3a3a" roughness={0.95} />
        </mesh>
      </group>
    );
  }

  if (config.shape === 'slot') {
    const slotWidth = portRadius * 4;
    const slotHeight = portRadius * 0.8;
    const tubeDepth = Math.min(portDepth, d * 0.85);

    return (
      <group position={position} rotation={rotation}>
        {/* Front opening frame */}
        <mesh position={[0, 0, 0.002]}>
          <boxGeometry args={[slotWidth + 0.02, slotHeight + 0.02, 0.004]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.5} />
        </mesh>

        {/* Inner hollow (dark opening) */}
        <mesh position={[0, 0, 0.003]}>
          <boxGeometry args={[slotWidth, slotHeight, 0.005]} />
          <meshStandardMaterial color="#000" roughness={0.9} />
        </mesh>

        {/* Port tube/channel - 4 walls */}
        {config.position !== 'bottom' && tubeDepth > 0.01 && (
          <>
            {/* Top wall */}
            <mesh position={[0, slotHeight / 2, -tubeDepth / 2]}>
              <boxGeometry args={[slotWidth, 0.008, tubeDepth]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.6} side={DoubleSide} />
            </mesh>
            {/* Bottom wall */}
            <mesh position={[0, -slotHeight / 2, -tubeDepth / 2]}>
              <boxGeometry args={[slotWidth, 0.008, tubeDepth]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.6} side={DoubleSide} />
            </mesh>
            {/* Left wall */}
            <mesh position={[-slotWidth / 2, 0, -tubeDepth / 2]}>
              <boxGeometry args={[0.008, slotHeight, tubeDepth]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.6} side={DoubleSide} />
            </mesh>
            {/* Right wall */}
            <mesh position={[slotWidth / 2, 0, -tubeDepth / 2]}>
              <boxGeometry args={[0.008, slotHeight, tubeDepth]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.6} side={DoubleSide} />
            </mesh>
            {/* Back plate */}
            <mesh position={[0, 0, -tubeDepth]}>
              <boxGeometry args={[slotWidth, slotHeight, 0.005]} />
              <meshStandardMaterial color="#111" roughness={0.7} />
            </mesh>
          </>
        )}

        {/* Flared edges for aerodynamics */}
        <mesh position={[0, slotHeight / 2 + 0.006, 0.008]} rotation={[Math.PI / 6, 0, 0]}>
          <boxGeometry args={[slotWidth, 0.006, 0.012]} />
          <meshStandardMaterial color="#222" roughness={0.5} />
        </mesh>
        <mesh position={[0, -slotHeight / 2 - 0.006, 0.008]} rotation={[-Math.PI / 6, 0, 0]}>
          <boxGeometry args={[slotWidth, 0.006, 0.012]} />
          <meshStandardMaterial color="#222" roughness={0.5} />
        </mesh>
      </group>
    );
  }

  // Circular port with 3D tube
  return (
    <group position={position} rotation={rotation}>
      {/* Front rim */}
      <mesh position={[0, 0, 0.002]}>
        <ringGeometry args={[portRadius * 0.85, portRadius, 32]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.2} />
      </mesh>

      {/* Inner opening */}
      <mesh position={[0, 0, 0.003]}>
        <circleGeometry args={[portRadius * 0.85, 32]} />
        <meshStandardMaterial color="#000" roughness={0.9} />
      </mesh>

      {/* Port tube */}
      {config.position !== 'bottom' && portDepth > 0.01 && (
        <>
          <mesh position={[0, 0, -portDepth / 2]}>
            <cylinderGeometry args={[portRadius * 0.85, portRadius * 0.85, portDepth, 32, 1, true]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.6} side={DoubleSide} />
          </mesh>
          {/* Back end cap */}
          <mesh position={[0, 0, -portDepth]}>
            <ringGeometry args={[portRadius * 0.75, portRadius * 0.85, 32]} />
            <meshStandardMaterial color="#111" roughness={0.7} />
          </mesh>
        </>
      )}

      {/* Flared entry */}
      <mesh position={[0, 0, 0.008]}>
        <cylinderGeometry args={[portRadius * 1.1, portRadius, 0.015, 32, 1, true]} />
        <meshStandardMaterial color="#222" roughness={0.5} side={DoubleSide} />
      </mesh>
    </group>
  );
}
