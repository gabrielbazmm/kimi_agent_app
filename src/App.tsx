import { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { 
  Box, 
  Ruler, 
  Palette, 
  Speaker, 
  Download, 
  RotateCcw,
  Grid3X3,
  AudioLines,
  SpeakerIcon,
  Monitor,
  BookOpen,
  BarChart3
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
// Switch removed - not used
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import './App.css';

// ==================== TIPOS ====================
type BoxType = 'bookshelf' | 'tower' | 'monitor' | 'soundbar' | 'boombox';
type PortType = 'sealed' | 'ported' | 'passive';
type PortShape = 'circular' | 'slot' | 'rectangular';
type PortPosition = 'front' | 'back' | 'bottom';
type InternalBracing = 'none' | 'simple' | 'cross' | 'window' | 'full';
type ChamberConfig = 'single' | 'two-way' | 'three-way';
type DriverType = 'sub' | 'woofer' | 'mid' | 'tweeter';
type FiringDirection = 'front' | 'back' | 'up' | 'down' | 'side';

interface Driver {
  id: string;
  type: DriverType;
  size: number;
  position: { x: number; y: number };
  firing: FiringDirection;
}

interface PortConfig {
  type: PortType;
  shape: PortShape;
  position: PortPosition;
  diameter: number;
  length: number;
  count: number;
}

interface BoxDimensions {
  width: number;
  height: number;
  depth: number;
}

interface BoxConfig {
  boxType: BoxType;
  dimensions: BoxDimensions;
  material: 'wood' | 'mdf' | 'metal' | 'fabric';
  finish: 'matte' | 'glossy' | 'textured';
  color: string;
  thickness: number;
  drivers: Driver[];
  port: PortConfig;
  internalBracing: InternalBracing;
  chamberConfig: ChamberConfig;
  showInternal: boolean;
}

// Configuraciones por tipo de caja
const boxTypeConfigs: Record<BoxType, { 
  dimensions: BoxDimensions; 
  defaultDrivers: Driver[];
  defaultPort: PortConfig;
  defaultName: string;
}> = {
  bookshelf: {
    dimensions: { width: 250, height: 400, depth: 280 },
    defaultDrivers: [
      { id: '1', type: 'woofer', size: 130, position: { x: 0, y: -0.2 }, firing: 'front' },
      { id: '2', type: 'tweeter', size: 25, position: { x: 0, y: 0.25 }, firing: 'front' },
    ],
    defaultPort: { type: 'ported', shape: 'circular', position: 'front', diameter: 60, length: 100, count: 1 },
    defaultName: 'Bookshelf'
  },
  tower: {
    dimensions: { width: 280, height: 1100, depth: 350 },
    defaultDrivers: [
      { id: '1', type: 'sub', size: 200, position: { x: 0, y: -0.35 }, firing: 'front' },
      { id: '2', type: 'mid', size: 130, position: { x: 0, y: 0 }, firing: 'front' },
      { id: '3', type: 'tweeter', size: 25, position: { x: 0, y: 0.35 }, firing: 'front' },
    ],
    defaultPort: { type: 'ported', shape: 'slot', position: 'front', diameter: 80, length: 150, count: 2 },
    defaultName: 'Tower'
  },
  monitor: {
    dimensions: { width: 300, height: 450, depth: 320 },
    defaultDrivers: [
      { id: '1', type: 'woofer', size: 165, position: { x: 0, y: -0.15 }, firing: 'front' },
      { id: '2', type: 'tweeter', size: 25, position: { x: 0, y: 0.25 }, firing: 'front' },
    ],
    defaultPort: { type: 'sealed', shape: 'circular', position: 'front', diameter: 0, length: 0, count: 0 },
    defaultName: 'Monitor'
  },
  soundbar: {
    dimensions: { width: 1000, height: 120, depth: 140 },
    defaultDrivers: [
      { id: '1', type: 'mid', size: 65, position: { x: -0.3, y: 0 }, firing: 'front' },
      { id: '2', type: 'mid', size: 65, position: { x: -0.1, y: 0 }, firing: 'front' },
      { id: '3', type: 'mid', size: 65, position: { x: 0.1, y: 0 }, firing: 'front' },
      { id: '4', type: 'tweeter', size: 20, position: { x: 0.3, y: 0 }, firing: 'front' },
    ],
    defaultPort: { type: 'ported', shape: 'slot', position: 'bottom', diameter: 40, length: 80, count: 2 },
    defaultName: 'Soundbar'
  },
  boombox: {
    dimensions: { width: 500, height: 280, depth: 200 },
    defaultDrivers: [
      { id: '1', type: 'woofer', size: 100, position: { x: -0.25, y: 0 }, firing: 'front' },
      { id: '2', type: 'woofer', size: 100, position: { x: 0.25, y: 0 }, firing: 'front' },
    ],
    defaultPort: { type: 'passive', shape: 'circular', position: 'front', diameter: 80, length: 0, count: 2 },
    defaultName: 'Boombox'
  },
};

const driverColors: Record<DriverType, string> = {
  sub: '#1a1a2e',
  woofer: '#2d2d44',
  mid: '#3d3d5c',
  tweeter: '#4a4a6a'
};

const driverLabels: Record<DriverType, string> = {
  sub: 'Subwoofer',
  woofer: 'Woofer',
  mid: 'Midrange',
  tweeter: 'Tweeter'
};

type AppState = 'landing' | 'loading' | 'designer';

const defaultConfig: BoxConfig = {
  boxType: 'bookshelf',
  dimensions: { width: 250, height: 400, depth: 280 },
  material: 'wood',
  finish: 'matte',
  color: '#f5f5f0',
  thickness: 18,
  drivers: boxTypeConfigs.bookshelf.defaultDrivers,
  port: boxTypeConfigs.bookshelf.defaultPort,
  internalBracing: 'cross',
  chamberConfig: 'two-way',
  showInternal: false,
};

// ==================== PARTICLE SPEAKER HERO ====================
function ParticleSpeaker({ isExploding, onExplosionComplete }: { isExploding: boolean; onExplosionComplete?: () => void }) {
  const pointsRef = useRef<THREE.Points>(null);
  const [particleData] = useState(() => {
    const initialPositions: number[] = [];
    const speakerTargets: number[] = [];
    const explodedTargets: number[] = [];
    const types: number[] = [];
    const baseColors: number[] = [];
    const colorHelper = new THREE.Color();
    const GOLD = new THREE.Color(0xC5A96E);

    const addPoints = (geometry: THREE.BufferGeometry, type: number) => {
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
    const boxGeo = new THREE.BoxGeometry(1.2, 2.1, 0.9, 20, 36, 16);
    addPoints(boxGeo, 0);

    // Woofer (positioned on front face)
    for (let r = 0.03; r <= 0.4; r += 0.012) {
      const ringGeo = new THREE.RingGeometry(r, r + 0.006, 48);
      ringGeo.translate(0, -0.3, 0.42 + r * 0.04);
      addPoints(ringGeo, 1);
    }

    // Woofer Rim
    for (let r = 0.41; r <= 0.45; r += 0.009) {
      const rimGeo = new THREE.RingGeometry(r, r + 0.005, 48);
      rimGeo.translate(0, -0.3, 0.42);
      addPoints(rimGeo, 3);
    }

    // Tweeter
    for (let r = 0.015; r <= 0.12; r += 0.009) {
      const tweetGeo = new THREE.RingGeometry(r, r + 0.004, 32);
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
    const tex = new THREE.CanvasTexture(canvas);
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

      const tx = targetList[i];
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
    const attr = new THREE.BufferAttribute(currentPositions, 3);
    return attr;
  }, [currentPositions]);

  const colorAttr = useMemo(() => {
    const attr = new THREE.BufferAttribute(currentColors, 3);
    return attr;
  }, [currentColors]);

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
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        transparent
        opacity={0.9}
      />
    </points>
  );
}

// ==================== ANIMACIÓN DE ONDAS ====================
function SoundWaveAnimation() {
  return (
    <div className="flex items-center justify-center gap-1 h-16">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="w-1 bg-neutral-800 rounded-full sound-bar"
          style={{ height: '20%', animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
}

// ==================== COMPONENTE DE BRACING ====================
function InternalBracing({ w, h, d, bracingType }: { w: number; h: number; d: number; bracingType: InternalBracing }) {
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

// ==================== COMPONENTE DE CÁMARAS ====================
function InternalChambers({ w, h, d, chamberConfig }: { w: number; h: number; d: number; chamberConfig: ChamberConfig }) {
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

// ==================== COMPONENTE DE PUERTO ====================
function Port({ config, w, h, d }: { config: PortConfig; w: number; h: number; d: number }) {
  if (config.type === 'sealed') return null;

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
              <meshStandardMaterial color="#1a1a1a" roughness={0.6} side={THREE.DoubleSide} />
            </mesh>
            {/* Bottom wall */}
            <mesh position={[0, -slotHeight / 2, -tubeDepth / 2]}>
              <boxGeometry args={[slotWidth, 0.008, tubeDepth]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.6} side={THREE.DoubleSide} />
            </mesh>
            {/* Left wall */}
            <mesh position={[-slotWidth / 2, 0, -tubeDepth / 2]}>
              <boxGeometry args={[0.008, slotHeight, tubeDepth]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.6} side={THREE.DoubleSide} />
            </mesh>
            {/* Right wall */}
            <mesh position={[slotWidth / 2, 0, -tubeDepth / 2]}>
              <boxGeometry args={[0.008, slotHeight, tubeDepth]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.6} side={THREE.DoubleSide} />
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
            <meshStandardMaterial color="#1a1a1a" roughness={0.6} side={THREE.DoubleSide} />
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
        <meshStandardMaterial color="#222" roughness={0.5} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// ==================== COMPONENTE DE DRIVER ====================
function DriverMesh({ driver, w, h, d }: { driver: Driver; w: number; h: number; d: number }) {
  const scale = 0.003;
  const radius = (driver.size / 2) * scale;
  const posX = driver.position.x * w;
  const posY = driver.position.y * h;

  let zOffset = d / 2 + 0.001;
  if (driver.firing === 'back') zOffset = -d / 2 - 0.001;
  if (driver.firing === 'up') return (
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

// ==================== CAJA 3D ====================
function SpeakerBox({ config }: { config: BoxConfig }) {
  const meshRef = useRef<THREE.Group>(null);
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

// ==================== ESCENA 3D ====================
function Scene({ config }: { config: BoxConfig }) {
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

// ==================== GRÁFICOS ====================
function FrequencyResponseGraph({ config }: { config: BoxConfig }) {
  const data = useMemo(() => {
    const points = [];
    for (let f = 20; f <= 20000; f *= 1.1) {
      let response = 0;
      const volume = (config.dimensions.width * config.dimensions.height * config.dimensions.depth) / 1000000;
      
      // Simulación simplificada de respuesta
      if (config.port.type === 'ported') {
        // Respuesta extendida en bajos para ported
        response = -3 * Math.exp(-f / 80) + Math.sin(f / 1000) * 2;
      } else if (config.port.type === 'sealed') {
        // Roll-off más pronunciado para sealed
        response = -6 * Math.exp(-f / 60) + Math.sin(f / 1000) * 1.5;
      } else {
        response = -4 * Math.exp(-f / 70) + Math.sin(f / 1000) * 2;
      }

      // Efecto del volumen
      response += Math.log10(volume) * 2;

      points.push({
        freq: Math.round(f),
        db: Math.max(-30, Math.min(5, response)),
        freqLabel: f < 100 ? `${f}Hz` : f < 1000 ? `${f}Hz` : `${Math.round(f/100)/10}k`
      });
    }
    return points;
  }, [config]);

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorDb" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1a1a1a" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#1a1a1a" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
          <XAxis 
            dataKey="freq" 
            scale="log" 
            domain={[20, 20000]} 
            tickFormatter={(v) => v < 1000 ? `${v}` : `${v/1000}k`}
            type="number"
            stroke="#999"
            fontSize={10}
          />
          <YAxis domain={[-30, 5]} stroke="#999" fontSize={10} unit="dB" />
          <RechartsTooltip 
            formatter={(v: number) => [`${v.toFixed(1)} dB`, 'Respuesta']}
            labelFormatter={(l) => `${l} Hz`}
          />
          <Area type="monotone" dataKey="db" stroke="#1a1a1a" fillOpacity={1} fill="url(#colorDb)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function VolumeGraph({ config }: { config: BoxConfig }) {
  const data = useMemo(() => {
    const internalVolume = (config.dimensions.width * config.dimensions.height * config.dimensions.depth) / 1000000 * 0.85;
    const bracingVolume = internalVolume * (config.internalBracing === 'full' ? 0.15 : config.internalBracing === 'cross' ? 0.08 : config.internalBracing === 'simple' ? 0.03 : 0);
    const netVolume = internalVolume - bracingVolume;

    return [
      { name: 'Volumen Bruto', value: internalVolume / 0.85, fill: '#e5e5e5' },
      { name: 'Bracing', value: bracingVolume, fill: '#8B7355' },
      { name: 'Volumen Neto', value: netVolume, fill: '#1a1a1a' },
    ];
  }, [config]);

  const total = data.reduce((acc, d) => acc + d.value, 0);

  return (
    <div className="space-y-2">
      {data.map((item) => (
        <div key={item.name} className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: item.fill }} />
          <span className="text-xs text-neutral-600 flex-1">{item.name}</span>
          <span className="text-xs font-medium">{item.value.toFixed(1)} L</span>
          <span className="text-xs text-neutral-400">({((item.value / total) * 100).toFixed(0)}%)</span>
        </div>
      ))}
      <div className="h-2 bg-neutral-200 rounded-full overflow-hidden flex">
        {data.map((item, i) => (
          <div 
            key={i} 
            className="h-full transition-all" 
            style={{ 
              width: `${(item.value / total) * 100}%`, 
              backgroundColor: item.fill 
            }} 
          />
        ))}
      </div>
    </div>
  );
}

// ==================== PÁGINAS ====================
function LandingPage({ onStart }: { onStart: () => void }) {
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

function LoadingPage({ onComplete }: { onComplete: () => void }) {
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

// ==================== PANELES DE CONTROL ====================
function BoxTypePanel({ config, setConfig }: { config: BoxConfig; setConfig: React.Dispatch<React.SetStateAction<BoxConfig>> }) {
  const boxTypes: { id: BoxType; label: string; icon: typeof Box; desc: string }[] = [
    { id: 'bookshelf', label: 'Bookshelf', icon: BookOpen, desc: 'Compacta, para estantería' },
    { id: 'tower', label: 'Torre', icon: SpeakerIcon, desc: 'Altavoz de suelo' },
    { id: 'monitor', label: 'Monitor', icon: Monitor, desc: 'Estudio, nearfield' },
    { id: 'soundbar', label: 'Soundbar', icon: AudioLines, desc: 'TV, cine en casa' },
    { id: 'boombox', label: 'Boombox', icon: Grid3X3, desc: 'Portátil, retro' },
  ];

  const handleTypeChange = (type: BoxType) => {
    const typeConfig = boxTypeConfigs[type];
    setConfig(prev => ({
      ...prev,
      boxType: type,
      dimensions: { ...typeConfig.dimensions },
      drivers: typeConfig.defaultDrivers,
      port: typeConfig.defaultPort,
    }));
  };

  return (
    <div className="space-y-4">
      <Label className="text-xs font-medium tracking-wide text-neutral-500 uppercase">Tipo de Caja</Label>
      <div className="grid grid-cols-1 gap-2">
        {boxTypes.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => handleTypeChange(t.id)}
              className={`w-full p-3 text-left border rounded-xl transition-all duration-200 ${
                config.boxType === t.id ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${config.boxType === t.id ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium text-neutral-800">{t.label}</div>
                  <div className="text-sm text-neutral-500">{t.desc}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DimensionsPanel({ config, setConfig }: { config: BoxConfig; setConfig: React.Dispatch<React.SetStateAction<BoxConfig>> }) {
  const updateDimension = (key: keyof BoxDimensions, value: number) => {
    setConfig(prev => ({ ...prev, dimensions: { ...prev.dimensions, [key]: value } }));
  };

  const getMaxDimensions = () => {
    switch (config.boxType) {
      case 'tower': return { w: 500, h: 1500, d: 600 };
      case 'soundbar': return { w: 1500, h: 200, d: 250 };
      case 'boombox': return { w: 800, h: 500, d: 350 };
      default: return { w: 600, h: 800, d: 500 };
    }
  };

  const maxDims = getMaxDimensions();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {[
          { key: 'width', label: 'Ancho', min: 80, max: maxDims.w, unit: 'mm' },
          { key: 'height', label: 'Alto', min: 100, max: maxDims.h, unit: 'mm' },
          { key: 'depth', label: 'Profundidad', min: 60, max: maxDims.d, unit: 'mm' },
        ].map(({ key, label, min, max, unit }) => (
          <div key={key} className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-medium tracking-wide text-neutral-500 uppercase">{label}</Label>
              <span className="text-sm font-light text-neutral-700">{config.dimensions[key as keyof BoxDimensions]} {unit}</span>
            </div>
            <Slider
              value={[config.dimensions[key as keyof BoxDimensions]]}
              onValueChange={([v]) => updateDimension(key as keyof BoxDimensions, v)}
              min={min}
              max={max}
              step={5}
            />
          </div>
        ))}
      </div>

      <Separator className="bg-neutral-200" />

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label className="text-xs font-medium tracking-wide text-neutral-500 uppercase">Espesor del material</Label>
          <span className="text-sm font-light text-neutral-700">{config.thickness} mm</span>
        </div>
        <Slider
          value={[config.thickness]}
          onValueChange={([v]) => setConfig(prev => ({ ...prev, thickness: v }))}
          min={12}
          max={50}
          step={3}
        />
        <p className="text-xs text-neutral-500">Afecta el volumen interno neto</p>
      </div>
    </div>
  );
}

function DriversPanel({ config, setConfig }: { config: BoxConfig; setConfig: React.Dispatch<React.SetStateAction<BoxConfig>> }) {
  const addDriver = () => {
    const newDriver: Driver = {
      id: Date.now().toString(),
      type: 'woofer',
      size: 130,
      position: { x: 0, y: 0 },
      firing: 'front'
    };
    setConfig(prev => ({ ...prev, drivers: [...prev.drivers, newDriver] }));
  };

  const updateDriver = (id: string, updates: Partial<Driver>) => {
    setConfig(prev => ({
      ...prev,
      drivers: prev.drivers.map(d => d.id === id ? { ...d, ...updates } : d)
    }));
  };

  const removeDriver = (id: string) => {
    setConfig(prev => ({ ...prev, drivers: prev.drivers.filter(d => d.id !== id) }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium tracking-wide text-neutral-500 uppercase">Drivers ({config.drivers.length})</Label>
        <Button size="sm" variant="outline" onClick={addDriver} disabled={config.drivers.length >= 6}>
          + Añadir
        </Button>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {config.drivers.map((driver, index) => (
          <Accordion key={driver.id} type="single" collapsible className="border rounded-lg">
            <AccordionItem value="item-1" className="border-0">
              <AccordionTrigger className="px-3 py-2 hover:no-underline">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: driverColors[driver.type] }} />
                  <span className="text-sm font-medium">{driverLabels[driver.type]} {index + 1}</span>
                  <span className="text-xs text-neutral-500">{driver.size}mm</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-3 pb-3">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-xs">Tipo</Label>
                    <Select value={driver.type} onValueChange={(v) => updateDriver(driver.id, { type: v as DriverType })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sub">Subwoofer</SelectItem>
                        <SelectItem value="woofer">Woofer</SelectItem>
                        <SelectItem value="mid">Midrange</SelectItem>
                        <SelectItem value="tweeter">Tweeter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between"><Label className="text-xs">Tamaño</Label><span className="text-xs">{driver.size}mm</span></div>
                    <Slider value={[driver.size]} onValueChange={([v]) => updateDriver(driver.id, { size: v })} min={20} max={460} step={5} />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Dirección (Firing)</Label>
                    <Select value={driver.firing} onValueChange={(v) => updateDriver(driver.id, { firing: v as FiringDirection })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="front">Frontal</SelectItem>
                        <SelectItem value="back">Trasero</SelectItem>
                        <SelectItem value="up">Superior</SelectItem>
                        <SelectItem value="down">Inferior</SelectItem>
                        <SelectItem value="side">Lateral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between"><Label className="text-xs">Posición X</Label></div>
                    <Slider value={[driver.position.x * 100]} onValueChange={([v]) => updateDriver(driver.id, { position: { ...driver.position, x: v / 100 } })} min={-50} max={50} step={5} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between"><Label className="text-xs">Posición Y</Label></div>
                    <Slider value={[driver.position.y * 100]} onValueChange={([v]) => updateDriver(driver.id, { position: { ...driver.position, y: v / 100 } })} min={-50} max={50} step={5} />
                  </div>

                  <Button size="sm" variant="destructive" className="w-full" onClick={() => removeDriver(driver.id)}>
                    Eliminar driver
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </div>
  );
}

function PortPanel({ config, setConfig }: { config: BoxConfig; setConfig: React.Dispatch<React.SetStateAction<BoxConfig>> }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs font-medium tracking-wide text-neutral-500 uppercase">Tipo de Sintonía</Label>
        <Select value={config.port.type} onValueChange={(v) => setConfig(prev => ({ ...prev, port: { ...prev.port, type: v as PortType } }))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="sealed">Cerrada (Sealed)</SelectItem>
            <SelectItem value="ported">Con puerto (Bass Reflex)</SelectItem>
            <SelectItem value="passive">Radiador pasivo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {config.port.type !== 'sealed' && (
        <>
          <Separator className="bg-neutral-200" />

          <div className="space-y-2">
            <Label className="text-xs font-medium tracking-wide text-neutral-500 uppercase">Forma del puerto</Label>
            <Select value={config.port.shape} onValueChange={(v) => setConfig(prev => ({ ...prev, port: { ...prev.port, shape: v as PortShape } }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="circular">Circular</SelectItem>
                <SelectItem value="slot">Ranura (Slot)</SelectItem>
                <SelectItem value="rectangular">Rectangular</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium tracking-wide text-neutral-500 uppercase">Posición</Label>
            <Select value={config.port.position} onValueChange={(v) => setConfig(prev => ({ ...prev, port: { ...prev.port, position: v as PortPosition } }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="front">Frontal</SelectItem>
                <SelectItem value="back">Trasera</SelectItem>
                <SelectItem value="bottom">Inferior</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs">Diámetro/Ancho</Label>
              <span className="text-xs">{config.port.diameter} mm</span>
            </div>
            <Slider value={[config.port.diameter]} onValueChange={([v]) => setConfig(prev => ({ ...prev, port: { ...prev.port, diameter: v } }))} min={25} max={150} step={5} />
          </div>

          {config.port.type === 'ported' && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-xs">Longitud del tubo</Label>
                <span className="text-xs">{config.port.length} mm</span>
              </div>
              <Slider value={[config.port.length]} onValueChange={([v]) => setConfig(prev => ({ ...prev, port: { ...prev.port, length: v } }))} min={50} max={300} step={10} />
            </div>
          )}

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs">Cantidad de puertos</Label>
              <span className="text-xs">{config.port.count}</span>
            </div>
            <Slider value={[config.port.count]} onValueChange={([v]) => setConfig(prev => ({ ...prev, port: { ...prev.port, count: v } }))} min={1} max={4} step={1} />
          </div>
        </>
      )}
    </div>
  );
}

function MaterialsPanel({ config, setConfig }: { config: BoxConfig; setConfig: React.Dispatch<React.SetStateAction<BoxConfig>> }) {
  const materials = [
    { id: 'wood', label: 'Madera', desc: 'Roble natural' },
    { id: 'mdf', label: 'MDF', desc: 'Densidad media' },
    { id: 'metal', label: 'Aluminio', desc: 'Cepillado' },
    { id: 'fabric', label: 'Tela', desc: 'Kvadrat' },
  ] as const;

  const finishes = [
    { id: 'matte', label: 'Mate' },
    { id: 'glossy', label: 'Brillante' },
    { id: 'textured', label: 'Texturizado' },
  ] as const;

  const colors = [
    { id: '#f5f5f0', label: 'Blanco natural', class: 'bg-[#f5f5f0]' },
    { id: '#2a2a2a', label: 'Negro antracita', class: 'bg-[#2a2a2a]' },
    { id: '#8b7355', label: 'Roble', class: 'bg-[#8b7355]' },
    { id: '#c4b8a8', label: 'Gris calido', class: 'bg-[#c4b8a8]' },
    { id: '#4a5568', label: 'Gris frío', class: 'bg-[#4a5568]' },
    { id: '#1a365d', label: 'Azul medianoche', class: 'bg-[#1a365d]' },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-xs font-medium tracking-wide text-neutral-500 uppercase">Material</Label>
        <div className="grid grid-cols-2 gap-2">
          {materials.map((m) => (
            <button
              key={m.id}
              onClick={() => setConfig(prev => ({ ...prev, material: m.id }))}
              className={`p-3 text-left border rounded-lg transition-all duration-200 ${
                config.material === m.id ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="text-sm font-medium text-neutral-800">{m.label}</div>
              <div className="text-xs text-neutral-500">{m.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-xs font-medium tracking-wide text-neutral-500 uppercase">Acabado</Label>
        <div className="flex gap-2">
          {finishes.map((f) => (
            <button
              key={f.id}
              onClick={() => setConfig(prev => ({ ...prev, finish: f.id }))}
              className={`flex-1 py-2 px-3 text-sm border rounded-lg transition-all duration-200 ${
                config.finish === f.id ? 'border-neutral-900 bg-neutral-50 text-neutral-900' : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-xs font-medium tracking-wide text-neutral-500 uppercase">Color</Label>
        <div className="grid grid-cols-3 gap-2">
          {colors.map((c) => (
            <TooltipProvider key={c.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setConfig(prev => ({ ...prev, color: c.id }))}
                    className={`h-12 rounded-lg border-2 transition-all duration-200 ${c.class} ${
                      config.color === c.id ? 'border-neutral-900 scale-105' : 'border-transparent hover:border-neutral-300'
                    }`}
                  />
                </TooltipTrigger>
                <TooltipContent><p className="text-xs">{c.label}</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    </div>
  );
}

function SpecsPanel({ config }: { config: BoxConfig }) {
  const { width, height, depth } = config.dimensions;
  const { thickness } = config;
  const grossVolume = (width * height * depth) / 1000000;
  const internalVolume = ((width - thickness * 2) * (height - thickness * 2) * (depth - thickness * 2)) / 1000000;
  const bracingVolume = internalVolume * (config.internalBracing === 'full' ? 0.15 : config.internalBracing === 'cross' ? 0.08 : config.internalBracing === 'simple' ? 0.03 : 0);
  const netVolume = Math.max(0, internalVolume - bracingVolume);
  const surfaceArea = 2 * (width * height + width * depth + height * depth) / 10000;
  const tuningFreq = config.port.type === 'ported' ? Math.round(35 + (1000 / netVolume) * 0.5) : config.port.type === 'sealed' ? Math.round(45 + (800 / netVolume)) : 40;

  const specs = [
    { label: 'Volumen bruto', value: `${grossVolume.toFixed(2)} L` },
    { label: 'Volumen interno', value: `${internalVolume.toFixed(2)} L` },
    { label: 'Volumen neto', value: `${netVolume.toFixed(2)} L` },
    { label: 'Bracing', value: `${bracingVolume.toFixed(2)} L` },
    { label: 'Área superficial', value: `${surfaceArea.toFixed(1)} dm²` },
    { label: 'Ratio H/W', value: `${(height / width).toFixed(2)}:1` },
    { label: 'Espesor', value: `${thickness} mm` },
    { label: 'Frec. sintonía', value: `~${tuningFreq} Hz` },
    { label: 'Drivers', value: `${config.drivers.length}` },
    { label: 'Puertos', value: `${config.port.count}` },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs font-medium tracking-wide text-neutral-500 uppercase">Respuesta de Frecuencia (Simulada)</Label>
        <FrequencyResponseGraph config={config} />
      </div>

      <Separator className="bg-neutral-200" />

      <div className="space-y-2">
        <Label className="text-xs font-medium tracking-wide text-neutral-500 uppercase">Distribución de Volumen</Label>
        <VolumeGraph config={config} />
      </div>

      <Separator className="bg-neutral-200" />

      <div className="space-y-2">
        <Label className="text-xs font-medium tracking-wide text-neutral-500 uppercase">Especificaciones</Label>
        <div className="grid grid-cols-2 gap-2">
          {specs.map((spec, i) => (
            <div key={i} className="p-2 bg-neutral-50 rounded-lg">
              <div className="text-[10px] text-neutral-500 uppercase tracking-wide">{spec.label}</div>
              <div className="text-sm font-medium text-neutral-800">{spec.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==================== APP PRINCIPAL ====================
function DesignerPage() {
  const [config, setConfig] = useState<BoxConfig>(defaultConfig);
  const [activeTab, setActiveTab] = useState('specs');

  const resetConfig = () => setConfig(defaultConfig);

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-[1800px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
              <Speaker className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-medium tracking-tight text-neutral-900">Boxlab</h1>
              <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Designer</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-neutral-100">
              {boxTypeConfigs[config.boxType].defaultName}
            </Badge>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={resetConfig}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Restablecer</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-16 h-screen flex">
        <div className="flex-1 relative bg-gradient-to-br from-neutral-100 to-neutral-200">
          <Canvas camera={{ position: [1.2, 0.5, 1.8], fov: 45 }} className="w-full h-full" shadows dpr={[1, 2]}>
            <Scene config={config} />
          </Canvas>
          
          <div className="absolute bottom-6 left-6 flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="bg-white/80 backdrop-blur">
              {config.dimensions.width} × {config.dimensions.height} × {config.dimensions.depth} mm
            </Badge>
            <Badge variant="secondary" className="bg-white/80 backdrop-blur">
              {config.thickness}mm {config.material}
            </Badge>
            <Badge variant="secondary" className="bg-white/80 backdrop-blur">
              {config.drivers.length} drivers
            </Badge>
            {config.showInternal && (
              <Badge variant="secondary" className="bg-amber-100/80 text-amber-800 backdrop-blur">
                Interno visible
              </Badge>
            )}
          </div>

          <div className="absolute bottom-6 right-6 text-xs text-neutral-500 bg-white/80 backdrop-blur px-3 py-2 rounded-lg">
            Arrastra para rotar · Scroll para zoom
          </div>
        </div>

        <div className="w-96 bg-white border-l border-neutral-200 flex flex-col">
          <div className="flex-1 overflow-auto p-6">
            <div className="w-full">
              <div className="w-full grid grid-cols-6 mb-6 bg-neutral-100 p-1 rounded-lg">
                {[
                  { id: 'type', icon: Box, label: 'Tipo' },
                  { id: 'dims', icon: Ruler, label: 'Dim' },
                  { id: 'drivers', icon: Speaker, label: 'Drv' },
                  { id: 'port', icon: AudioLines, label: 'Port' },
                  { id: 'mat', icon: Palette, label: 'Mat' },
                  { id: 'specs', icon: BarChart3, label: 'Info' },
                ].map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex flex-col items-center gap-1 py-2 rounded-md transition-all duration-200 ${
                      activeTab === id 
                        ? 'bg-white text-neutral-900 shadow-sm' 
                        : 'text-neutral-500 hover:text-neutral-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px]">{label}</span>
                  </button>
                ))}
              </div>

              {activeTab === 'type' && (
                <Card className="border-0 shadow-none">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-sm font-medium tracking-wide text-neutral-500 uppercase">Tipo de Caja</CardTitle>
                  </CardHeader>
                  <CardContent className="px-0">
                    <BoxTypePanel config={config} setConfig={setConfig} />
                  </CardContent>
                </Card>
              )}

              {activeTab === 'dims' && (
                <Card className="border-0 shadow-none">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-sm font-medium tracking-wide text-neutral-500 uppercase">Dimensiones</CardTitle>
                  </CardHeader>
                  <CardContent className="px-0">
                    <DimensionsPanel config={config} setConfig={setConfig} />
                  </CardContent>
                </Card>
              )}

              {activeTab === 'drivers' && (
                <Card className="border-0 shadow-none">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-sm font-medium tracking-wide text-neutral-500 uppercase">Drivers</CardTitle>
                  </CardHeader>
                  <CardContent className="px-0">
                    <DriversPanel config={config} setConfig={setConfig} />
                  </CardContent>
                </Card>
              )}

              {activeTab === 'port' && (
                <Card className="border-0 shadow-none">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-sm font-medium tracking-wide text-neutral-500 uppercase">Puerto / Sintonía</CardTitle>
                  </CardHeader>
                  <CardContent className="px-0">
                    <PortPanel config={config} setConfig={setConfig} />
                  </CardContent>
                </Card>
              )}

              {activeTab === 'mat' && (
                <Card className="border-0 shadow-none">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-sm font-medium tracking-wide text-neutral-500 uppercase">Materiales</CardTitle>
                  </CardHeader>
                  <CardContent className="px-0">
                    <MaterialsPanel config={config} setConfig={setConfig} />
                  </CardContent>
                </Card>
              )}

              {activeTab === 'specs' && (
                <Card className="border-0 shadow-none">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-sm font-medium tracking-wide text-neutral-500 uppercase">Especificaciones</CardTitle>
                  </CardHeader>
                  <CardContent className="px-0">
                    <SpecsPanel config={config} />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <div className="p-6 border-t border-neutral-200 bg-neutral-50">
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span>Boxlab Designer v3.0</span>
              <span className="flex items-center gap-1">Inspirado en <span className="font-medium">B&O</span></span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ==================== APP ROOT ====================
function App() {
  const [appState, setAppState] = useState<AppState>('landing');

  const handleStart = () => setAppState('loading');
  const handleLoadingComplete = () => setAppState('designer');

  return (
    <>
      {appState === 'landing' && <LandingPage onStart={handleStart} />}
      {appState === 'loading' && <LoadingPage onComplete={handleLoadingComplete} />}
      {appState === 'designer' && <DesignerPage />}
    </>
  );
}

export default App;
