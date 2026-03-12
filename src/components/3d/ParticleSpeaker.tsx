import { useState, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, BufferAttribute, CanvasTexture, RingGeometry, BoxGeometry, AdditiveBlending } from 'three';
import type { Points, BufferGeometry } from 'three';

export function ParticleSpeaker({ isExploding, onExplosionComplete }: { isExploding: boolean; onExplosionComplete?: () => void }) {
  const pointsRef = useRef<Points>(null);
  const [particleData] = useState(() => {
    const initialPositions: number[] = [];
    const speakerTargets: number[] = [];
    const explodedTargets: number[] = [];
    const types: number[] = [];
    const baseColors: number[] = [];
    const colorHelper = new Color();
    const GOLD = new Color(0xC5A96E);

    const addPoints = (geometry: BufferGeometry, type: number) => {
      const pos = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < pos.length; i += 3) {
        // Speaker target position (assembled box)
        speakerTargets.push(pos[i], pos[i + 1], pos[i + 2]);

        // Exploded target position (dispersed particles)
        const angle = Math.random() * Math.PI * 2;
        const radius = 4 + Math.random() * 6;
        explodedTargets.push(
          Math.cos(angle) * radius,
          (Math.random() - 0.5) * 10,
          Math.sin(angle) * radius - 2
        );

        // Initial random position
        initialPositions.push(
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 30
        );

        types.push(type);

        // Colors
        if (type === 0) { // Cabinet
          const v = Math.random() * 0.1 + 0.08;
          colorHelper.setRGB(v, v, v);
        } else if (type === 1) { // Woofer Cone
          colorHelper.setRGB(0.3, 0.3, 0.3);
        } else if (type === 2) { // Tweeter (Gold)
          colorHelper.copy(GOLD);
        } else if (type === 3) { // Woofer Rim (Gold)
          colorHelper.copy(GOLD).multiplyScalar(0.8);
        }
        baseColors.push(colorHelper.r, colorHelper.g, colorHelper.b);
      }
    };

    // Cabinet box
    const boxGeo = new BoxGeometry(1.2, 2.1, 0.9, 20, 36, 16);
    addPoints(boxGeo, 0);

    // Woofer (positioned on front face)
    for (let r = 0.03; r <= 0.4; r += 0.012) {
      const ringGeo = new RingGeometry(r, r + 0.006, 48);
      ringGeo.translate(0, -0.3, 0.42 + r * 0.04);
      addPoints(ringGeo, 1);
    }

    // Woofer Rim
    for (let r = 0.41; r <= 0.45; r += 0.009) {
      const rimGeo = new RingGeometry(r, r + 0.005, 48);
      rimGeo.translate(0, -0.3, 0.42);
      addPoints(rimGeo, 3);
    }

    // Tweeter
    for (let r = 0.015; r <= 0.12; r += 0.009) {
      const tweetGeo = new RingGeometry(r, r + 0.004, 32);
      tweetGeo.translate(0, 0.6, 0.43);
      addPoints(tweetGeo, 2);
    }

    return {
      initialPositions: new Float32Array(initialPositions),
      speakerTargets: new Float32Array(speakerTargets),
      explodedTargets: new Float32Array(explodedTargets),
      types: new Uint8Array(types),
      baseColors: new Float32Array(baseColors),
      count: initialPositions.length / 3
    };
  });

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.3, 'rgba(255,255,255,0.5)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  const [currentPositions] = useState(() => new Float32Array(particleData.initialPositions));
  const [currentColors] = useState(() => new Float32Array(particleData.baseColors));
  const explosionStarted = useRef(false);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.elapsedTime;
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const colors = pointsRef.current.geometry.attributes.color.array as Float32Array;

    const targetList = isExploding ? particleData.explodedTargets : particleData.speakerTargets;
    const speed = isExploding ? 0.025 : 0.035;
    const beat = Math.pow((Math.sin(time * 4) + 1) / 2, 6);

    // Check if explosion animation should trigger callback
    if (isExploding && !explosionStarted.current) {
      explosionStarted.current = true;
      setTimeout(() => onExplosionComplete?.(), 800);
    }

    for (let i = 0; i < positions.length; i += 3) {
      const idx = i / 3;

      let tx = targetList[i];
      let ty = targetList[i + 1];
      let tz = targetList[i + 2];

      if (!isExploding) {
        // Speaker mode - apply beat vibration to woofer
        const type = particleData.types[idx];
        if (type === 1 || type === 3) {
          const move = beat * 0.08;
          tz += move;

          // Brightness effect
          const light = move * 2;
          colors[i] = Math.min(1, particleData.baseColors[i] + light);
          colors[i + 1] = Math.min(1, particleData.baseColors[i + 1] + light);
          colors[i + 2] = Math.min(1, particleData.baseColors[i + 2] + light);
        } else {
          colors[i] = particleData.baseColors[i];
          colors[i + 1] = particleData.baseColors[i + 1];
          colors[i + 2] = particleData.baseColors[i + 2];
        }
      } else {
        // Exploded mode - floating movement
        ty += Math.sin(time + tx * 0.5) * 0.03;
      }

      // Lerp to target
      positions[i] += (tx - positions[i]) * speed;
      positions[i + 1] += (ty - positions[i + 1]) * speed;
      positions[i + 2] += (tz - positions[i + 2]) * speed;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.geometry.attributes.color.needsUpdate = true;

    // Rotation
    if (!isExploding) {
      pointsRef.current.rotation.y += 0.003;
    } else {
      pointsRef.current.rotation.y += 0.0008;
    }
  });

  // Create buffer attributes with proper args
  const positionAttr = useMemo(() => {
    const attr = new BufferAttribute(currentPositions, 3);
    return attr;
  }, []);

  const colorAttr = useMemo(() => {
    const attr = new BufferAttribute(currentColors, 3);
    return attr;
  }, []);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <primitive attach="attributes-position" object={positionAttr} />
        <primitive attach="attributes-color" object={colorAttr} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        map={texture}
        vertexColors
        blending={AdditiveBlending}
        depthWrite={false}
        transparent
        opacity={0.9}
      />
    </points>
  );
}
