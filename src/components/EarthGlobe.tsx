import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { 
  Play, 
  Pause, 
  Satellite, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Move, 
  Globe, 
  Sparkles, 
  MapPin, 
  ExternalLink, 
  Layers, 
  Radio, 
  Zap,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { SIMULATED_SATELLITES } from '../data/simulatedData';
import { SatelliteMission } from '../types/charwatch';

interface EarthGlobeProps {
  onSelectBangladesh?: () => void;
  onSelectSatellite?: (sat: SatelliteMission) => void;
  onNavigateToObservatory?: () => void;
}

export interface RiverDeltaHotspot {
  id: string;
  name: string;
  country: string;
  riverSystem: string;
  lat: number;
  lng: number;
  status: 'CRITICAL' | 'WARNING' | 'MONITORING';
  retreatRateM: number;
  keyFeature: string;
  color: string;
  accentHex: number;
  description: string;
}

const GLOBAL_DELTAS: RiverDeltaHotspot[] = [
  {
    id: 'bangladesh',
    name: 'Bengal Mega-Delta (Jamuna-Padma-Meghna)',
    country: 'Bangladesh',
    riverSystem: 'Ganges-Brahmaputra-Meghna Basin',
    lat: 23.85,
    lng: 90.35,
    status: 'CRITICAL',
    retreatRateM: 340,
    keyFeature: 'World’s most dynamic braided river corridor; severe monsoonal bank scour and char accretion.',
    color: '#06b6d4',
    accentHex: 0x06b6d4,
    description: 'Primary focal corridor of CHARWATCH. Receives Himalayan meltwater discharge, causing extreme seasonal sandbar turnover.',
  },
  {
    id: 'amazon',
    name: 'Amazon River Mega Delta',
    country: 'Brazil',
    riverSystem: 'Amazon Basin',
    lat: 0.05,
    lng: -50.50,
    status: 'MONITORING',
    retreatRateM: 120,
    keyFeature: 'Massive Atlantic sediment plume discharging 209,000 m³/s into the equatorial ocean.',
    color: '#10b981',
    accentHex: 0x10b981,
    description: 'World’s largest river discharge creating huge turbid freshwater fronts and tidal bore waves (Pororoca).',
  },
  {
    id: 'mississippi',
    name: 'Mississippi Birdfoot Delta',
    country: 'United States',
    riverSystem: 'Mississippi River',
    lat: 29.15,
    lng: -89.25,
    status: 'CRITICAL',
    retreatRateM: 95,
    keyFeature: 'Rapid coastal wetland subsidence, barrier island retreat, and sediment diversion engineering.',
    color: '#f43f5e',
    accentHex: 0xf43f5e,
    description: 'Classic birdfoot delta heavily altered by levees and sediment starvation into the Gulf of Mexico.',
  },
  {
    id: 'nile',
    name: 'Nile River Delta & Rosetta',
    country: 'Egypt',
    riverSystem: 'Nile River',
    lat: 31.40,
    lng: 30.80,
    status: 'CRITICAL',
    retreatRateM: 130,
    keyFeature: 'Mediterranean coastal wave erosion due to Aswan High Dam sediment trapping.',
    color: '#f59e0b',
    accentHex: 0xf59e0b,
    description: 'Arcuate delta supporting 40+ million people under severe threat from sea-level rise and coastal scarp retreat.',
  },
  {
    id: 'mekong',
    name: 'Mekong River Delta',
    country: 'Vietnam / Cambodia',
    riverSystem: 'Mekong (Cuu Long)',
    lat: 10.05,
    lng: 105.80,
    status: 'CRITICAL',
    retreatRateM: 180,
    keyFeature: 'Upstream hydropower dam sediment starvation, groundwater subsidence, and saline intrusion.',
    color: '#ef4444',
    accentHex: 0xef4444,
    description: 'Vast agricultural food basket facing accelerating coastal mangrove erosion and land subsidence.',
  },
  {
    id: 'yellow_river',
    name: 'Yellow River (Huang He) Delta',
    country: 'China',
    riverSystem: 'Yellow River (Huang He)',
    lat: 37.75,
    lng: 119.20,
    status: 'WARNING',
    retreatRateM: 220,
    keyFeature: 'Historically highest sediment-load river on Earth with rapid delta lobe switching into Bohai Sea.',
    color: '#eab308',
    accentHex: 0xeab308,
    description: 'Highly regulated fluvial sediment corridor actively shaped by human hydraulic engineering.',
  },
  {
    id: 'danube',
    name: 'Danube River Delta Biosphere',
    country: 'Romania / Ukraine',
    riverSystem: 'Danube River',
    lat: 45.20,
    lng: 29.60,
    status: 'MONITORING',
    retreatRateM: 75,
    keyFeature: 'Europe’s best-preserved wetland delta flowing into the Black Sea.',
    color: '#38bdf8',
    accentHex: 0x38bdf8,
    description: 'UNESCO Biosphere Reserve with extensive anastomosing channels and active reed marsh islands.',
  },
  {
    id: 'congo',
    name: 'Congo River Pool Malebo & Canyon',
    country: 'DR Congo',
    riverSystem: 'Congo River',
    lat: -4.30,
    lng: 15.30,
    status: 'MONITORING',
    retreatRateM: 90,
    keyFeature: 'World’s deepest river (>220m) with deep submarine Atlantic canyon.',
    color: '#2dd4bf',
    accentHex: 0x2dd4bf,
    description: 'Second largest discharge on Earth flowing through the equatorial rainforest with lake-like braided channels.',
  },
];

// Helper to convert Lat/Lng to 3D Cartesian coordinates on sphere
function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

// Generate high-resolution procedural Earth texture as high-fidelity fallback
function createProceduralEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Deep Ocean gradient
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, 1024);
    oceanGrad.addColorStop(0, '#021838'); // Arctic
    oceanGrad.addColorStop(0.2, '#043468');
    oceanGrad.addColorStop(0.5, '#02244a'); // Equatorial deep blue
    oceanGrad.addColorStop(0.8, '#043468');
    oceanGrad.addColorStop(1, '#021838'); // Antarctic
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, 2048, 1024);

    // Continents & Landmass silhouettes
    ctx.fillStyle = '#1b3b2b'; // Lush green land
    // Eurasia / Africa
    ctx.beginPath();
    ctx.ellipse(1250, 420, 480, 280, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sahara / Middle East Desert
    ctx.fillStyle = '#5c4b32';
    ctx.beginPath();
    ctx.ellipse(1150, 450, 200, 120, -0.1, 0, Math.PI * 2);
    ctx.fill();

    // Americas
    ctx.fillStyle = '#1c3d2c';
    ctx.beginPath();
    ctx.ellipse(450, 380, 260, 220, 0.4, 0, Math.PI * 2); // North America
    ctx.ellipse(560, 680, 160, 220, -0.2, 0, Math.PI * 2); // South America (Amazon)
    ctx.fill();

    // Australia
    ctx.fillStyle = '#4a3826';
    ctx.beginPath();
    ctx.ellipse(1680, 720, 140, 110, 0, 0, Math.PI * 2);
    ctx.fill();

    // Polar ice caps
    ctx.fillStyle = '#e2f1fc';
    ctx.fillRect(0, 0, 2048, 70); // North Pole
    ctx.fillRect(0, 950, 2048, 74); // South Pole

    // Bengal Delta Sediment Plume into Bay of Bengal
    ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.beginPath();
    ctx.ellipse(1380, 460, 30, 45, 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export const EarthGlobe: React.FC<EarthGlobeProps> = ({
  onSelectBangladesh,
  onSelectSatellite,
  onNavigateToObservatory,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Interaction State
  const [isRotating, setIsRotating] = useState(true);
  const [showClouds, setShowClouds] = useState(true);
  const [showCityLights, setShowCityLights] = useState(true);
  const [showRadarBeams, setShowRadarBeams] = useState(true);
  const [selectedHotspot, setSelectedHotspot] = useState<RiverDeltaHotspot | null>(GLOBAL_DELTAS[0]);
  const [hoveredHotspot, setHoveredHotspot] = useState<RiverDeltaHotspot | null>(null);
  const [selectedSatInfo, setSelectedSatInfo] = useState<SatelliteMission | null>(null);
  const [screenHotspots, setScreenHotspots] = useState<{ id: string; x: number; y: number; visible: boolean }[]>([]);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const earthMeshRef = useRef<THREE.Mesh | null>(null);
  const cloudsMeshRef = useRef<THREE.Mesh | null>(null);
  const atmosphereMeshRef = useRef<THREE.Mesh | null>(null);
  const earthGroupRef = useRef<THREE.Group | null>(null);
  const satellitesGroupRef = useRef<THREE.Group | null>(null);
  const radarConesGroupRef = useRef<THREE.Group | null>(null);

  // Mouse & Touch Dragging State
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0.35, y: -1.55 }); // Centered toward Bangladesh
  const currentRotationRef = useRef({ x: 0.35, y: -1.55 });
  const zoomDistanceRef = useRef(2.5); // Camera distance
  const targetZoomDistanceRef = useRef(2.5);

  // Primary Three.js Setup & WebGL Render Loop
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, zoomDistanceRef.current);
    cameraRef.current = camera;

    // 3. WebGL Renderer with High Precision & Antialiasing
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Galaxy Background Starfield (Refined Micro-Stars & Astronomical Spectrums)
    const starsCount = 3500;
    const starsGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starsCount * 3);
    const starColors = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount; i++) {
      const radius = 18 + Math.random() * 45;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = radius * Math.cos(phi);

      const colorChance = Math.random();
      if (colorChance > 0.85) {
        // Class O/B (Deep space electric cyan/blue)
        starColors[i * 3] = 0.65; starColors[i * 3 + 1] = 0.92; starColors[i * 3 + 2] = 1.0;
      } else if (colorChance > 0.45) {
        // Class A (Crisp pure diamond white)
        starColors[i * 3] = 0.98; starColors[i * 3 + 1] = 0.98; starColors[i * 3 + 2] = 1.0;
      } else if (colorChance > 0.15) {
        // Class F/G (Warm stellar solar yellow-white)
        starColors[i * 3] = 1.0; starColors[i * 3 + 1] = 0.95; starColors[i * 3 + 2] = 0.85;
      } else {
        // Class K/M (Faint reddish-amber dwarf)
        starColors[i * 3] = 1.0; starColors[i * 3 + 1] = 0.75; starColors[i * 3 + 2] = 0.6;
      }
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    const starsMaterial = new THREE.PointsMaterial({
      size: 0.042, // Tiny, pinpoint realistic star size (not chunky dots)
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
    });
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    // 4.1 Photorealistic 3D Comet (ধূমকেতু - Celestial Visitor with Dual Ion & Dust Tails)
    const cometGroup = new THREE.Group();
    scene.add(cometGroup);

    // Glowing Icy Nucleus (নিউক্লিয়াস)
    const nucleusGeom = new THREE.SphereGeometry(0.024, 16, 16);
    const nucleusMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const nucleusMesh = new THREE.Mesh(nucleusGeom, nucleusMat);
    cometGroup.add(nucleusMesh);

    // Coma Halo (আলোকবলয় - Sublimating Gas & Ice Envelope)
    const comaGeom = new THREE.SphereGeometry(0.065, 16, 16);
    const comaMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const comaMesh = new THREE.Mesh(comaGeom, comaMat);
    cometGroup.add(comaMesh);

    // Comet Core Light Source
    const cometLight = new THREE.PointLight(0x38bdf8, 2.2, 4.0);
    cometGroup.add(cometLight);

    // Ion Tail (নীল আয়নিত গ্যাস পুচ্ছ - Thin, straight, high-energy cyan)
    const ionTailGeom = new THREE.ConeGeometry(0.08, 2.2, 16, 1, true);
    ionTailGeom.translate(0, 1.1, 0);
    ionTailGeom.rotateX(Math.PI / 2);
    const ionTailMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.48,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const ionTailMesh = new THREE.Mesh(ionTailGeom, ionTailMat);
    cometGroup.add(ionTailMesh);

    // Dust Tail (সোনালী-সাদা ধূলিকণা পুচ্ছ - Curved, broad, diffused)
    const dustTailGeom = new THREE.ConeGeometry(0.22, 1.8, 16, 1, true);
    dustTailGeom.translate(0, 0.9, 0);
    dustTailGeom.rotateX(Math.PI / 2);
    dustTailGeom.rotateY(0.14);
    const dustTailMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const dustTailMesh = new THREE.Mesh(dustTailGeom, dustTailMat);
    cometGroup.add(dustTailMesh);

    // Dust Particle Trail behind the comet
    const dustTrailCount = 140;
    const dustTrailGeom = new THREE.BufferGeometry();
    const dustTrailPositions = new Float32Array(dustTrailCount * 3);
    for (let p = 0; p < dustTrailCount; p++) {
      dustTrailPositions[p * 3] = (Math.random() - 0.5) * 0.14;
      dustTrailPositions[p * 3 + 1] = (Math.random() - 0.5) * 0.14;
      dustTrailPositions[p * 3 + 2] = Math.random() * 2.2;
    }
    dustTrailGeom.setAttribute('position', new THREE.BufferAttribute(dustTrailPositions, 3));
    const dustTrailMat = new THREE.PointsMaterial({
      size: 0.022,
      color: 0xa5f3fc,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const dustTrailPoints = new THREE.Points(dustTrailGeom, dustTrailMat);
    cometGroup.add(dustTrailPoints);

    // 4.2 Cosmic Shooting Star / Meteor Streak (উল্কাপাত)
    const meteorGeom = new THREE.BufferGeometry();
    const meteorPositions = new Float32Array(6);
    meteorGeom.setAttribute('position', new THREE.BufferAttribute(meteorPositions, 3));
    const meteorMat = new THREE.LineBasicMaterial({
      color: 0x67e8f9,
      transparent: true,
      opacity: 0,
      linewidth: 2,
      blending: THREE.AdditiveBlending,
    });
    const meteorLine = new THREE.Line(meteorGeom, meteorMat);
    scene.add(meteorLine);

    let meteorActive = false;
    let meteorStartTime = 0;
    const meteorDuration = 0.75;
    const meteorStart = new THREE.Vector3();
    const meteorDir = new THREE.Vector3();

    // 5. Lighting Setup
    // Sun Directional Light (Bright, warm sunlight from upper right)
    const sunLight = new THREE.DirectionalLight(0xfff8ee, 2.4);
    sunLight.position.set(5, 3.2, 4);
    scene.add(sunLight);

    // Deep Space Ambient Light
    const ambientLight = new THREE.AmbientLight(0x0a1628, 0.45);
    scene.add(ambientLight);

    // Subtle Cyan Rim Backlight
    const rimLight = new THREE.DirectionalLight(0x06b6d4, 0.7);
    rimLight.position.set(-6, -2, -4);
    scene.add(rimLight);

    // 6. Earth Group (Rotated together)
    const earthGroup = new THREE.Group();
    earthGroupRef.current = earthGroup;
    scene.add(earthGroup);

    const earthRadius = 1.0;
    const earthSegments = 64;

    // Load NASA Blue Marble Textures
    const textureLoader = new THREE.TextureLoader();
    const proceduralFallback = createProceduralEarthTexture();

    // Earth Sphere Mesh
    const earthGeometry = new THREE.SphereGeometry(earthRadius, earthSegments, earthSegments);
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: proceduralFallback,
      roughness: 0.65,
      metalness: 0.1,
    });

    // Try loading authentic NASA texture maps
    textureLoader.load(
      'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        earthMaterial.map = tex;
        earthMaterial.needsUpdate = true;
      },
      undefined,
      () => {
        // Silently use procedural fallback
      }
    );

    textureLoader.load(
      'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
      (specTex) => {
        earthMaterial.roughnessMap = specTex;
        earthMaterial.needsUpdate = true;
      }
    );

    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    earthMeshRef.current = earthMesh;
    earthGroup.add(earthMesh);

    // 7. Dynamic Atmosphere Clouds Layer
    const cloudsGeometry = new THREE.SphereGeometry(earthRadius * 1.018, 48, 48);
    const cloudsMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });

    textureLoader.load(
      'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
      (cloudTex) => {
        cloudsMaterial.map = cloudTex;
        cloudsMaterial.opacity = 0.55;
        cloudsMaterial.needsUpdate = true;
      }
    );

    const cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    cloudsMeshRef.current = cloudsMesh;
    earthGroup.add(cloudsMesh);

    // 8. Glowing Atmospheric Rayleigh Scatter Glow (Custom Fresnel Rim Shader)
    const atmosphereGeometry = new THREE.SphereGeometry(earthRadius * 1.15, 36, 36);
    const atmosphereShader = {
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
          gl_FragColor = vec4(0.02, 0.71, 0.83, 1.0) * intensity * 1.35;
        }
      `,
    };

    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: atmosphereShader.vertexShader,
      fragmentShader: atmosphereShader.fragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });

    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    atmosphereMeshRef.current = atmosphereMesh;
    scene.add(atmosphereMesh);

    // 9. Hotspot Markers Attached Directly to 3D Sphere Surface
    GLOBAL_DELTAS.forEach((delta) => {
      const pos = latLngToVector3(delta.lat, delta.lng, earthRadius * 1.006);

      // 3D Glowing Beacon Cylinder / Pin
      const pinGeom = new THREE.CylinderGeometry(0.006, 0.002, 0.08, 12);
      pinGeom.translate(0, 0.04, 0);
      pinGeom.rotateX(Math.PI / 2);

      const pinMat = new THREE.MeshBasicMaterial({
        color: delta.accentHex,
        transparent: true,
        opacity: 0.9,
      });

      const pinMesh = new THREE.Mesh(pinGeom, pinMat);
      pinMesh.position.copy(pos);
      pinMesh.lookAt(pos.clone().multiplyScalar(2));
      earthGroup.add(pinMesh);

      // Pulse Ring Mesh on surface
      const ringGeom = new THREE.RingGeometry(0.015, 0.025, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: delta.accentHex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      ringMesh.position.copy(pos.clone().multiplyScalar(1.002));
      ringMesh.lookAt(pos.clone().multiplyScalar(2));
      earthGroup.add(ringMesh);
    });

    // 10. Orbiting Satellites Group (NISAR & Sentinel-1)
    const satellitesGroup = new THREE.Group();
    satellitesGroupRef.current = satellitesGroup;
    scene.add(satellitesGroup);

    // NISAR Orbit (Inclination ~98.4°, altitude ~747km)
    const nisarOrbitRadius = earthRadius * 1.48;
    const nisarOrbitCurve = new THREE.EllipseCurve(0, 0, nisarOrbitRadius, nisarOrbitRadius, 0, Math.PI * 2, false, 0);
    const nisarPoints = nisarOrbitCurve.getPoints(64);
    const nisarOrbitGeom = new THREE.BufferGeometry().setFromPoints(nisarPoints.map((p) => new THREE.Vector3(p.x, 0, p.y)));
    const nisarOrbitMat = new THREE.LineDashedMaterial({
      color: 0x06b6d4,
      dashSize: 0.08,
      gapSize: 0.04,
      transparent: true,
      opacity: 0.45,
    });
    const nisarOrbitLine = new THREE.Line(nisarOrbitGeom, nisarOrbitMat);
    nisarOrbitLine.computeLineDistances();
    nisarOrbitLine.rotation.x = THREE.MathUtils.degToRad(-28);
    satellitesGroup.add(nisarOrbitLine);

    // NISAR 3D Satellite Body
    const satGeom = new THREE.BoxGeometry(0.04, 0.02, 0.03);
    const nisarMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.8, roughness: 0.2 });
    const nisarMesh = new THREE.Mesh(satGeom, nisarMat);

    // Solar panels
    const panelGeom = new THREE.BoxGeometry(0.12, 0.004, 0.03);
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.9, roughness: 0.1 });
    const panelMesh = new THREE.Mesh(panelGeom, panelMat);
    nisarMesh.add(panelMesh);
    satellitesGroup.add(nisarMesh);

    // Radar Scanning Cone
    const radarConeGeom = new THREE.ConeGeometry(0.24, nisarOrbitRadius - earthRadius, 16, 1, true);
    radarConeGeom.translate(0, (nisarOrbitRadius - earthRadius) / 2, 0);
    radarConeGeom.rotateX(Math.PI);
    const radarConeMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
    });
    const radarConeMesh = new THREE.Mesh(radarConeGeom, radarConeMat);
    nisarMesh.add(radarConeMesh);

    // 11. Animation Loop
    let animFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Auto-rotation when not dragging
      if (isRotating && !isDraggingRef.current) {
        targetRotationRef.current.y += 0.0022; // Natural slow planetary spin
      }

      // Smooth camera / globe rotation damping
      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.08;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.08;

      if (earthGroupRef.current) {
        earthGroupRef.current.rotation.x = currentRotationRef.current.x;
        earthGroupRef.current.rotation.y = currentRotationRef.current.y;
      }

      // Atmospheric clouds slightly faster rotation
      if (cloudsMeshRef.current) {
        cloudsMeshRef.current.rotation.y = currentRotationRef.current.y * 1.08 + elapsedTime * 0.005;
        cloudsMeshRef.current.visible = showClouds;
      }

      // Starfield subtle cosmic rotation
      starField.rotation.y = elapsedTime * 0.0006;
      starField.rotation.x = elapsedTime * 0.0003;

      // Comet (ধূমকেতু) Celestial Trajectory & Tail Dynamics
      const cometCycle = (elapsedTime * 0.16) % (Math.PI * 2);
      const cometRadius = 4.2;
      const cometX = Math.cos(cometCycle) * cometRadius - 0.5;
      const cometY = Math.sin(cometCycle) * 2.2 + 0.8;
      const cometZ = Math.sin(cometCycle * 2) * 1.6 - 2.8;
      cometGroup.position.set(cometX, cometY, cometZ);

      // Tail always points directly away from the Sun (sun is at [5, 3.2, 4])
      const sunPos = new THREE.Vector3(5, 3.2, 4);
      const tailDir = cometGroup.position.clone().sub(sunPos).normalize();
      cometGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tailDir);

      // Coma pulsation & dust trail rotation
      comaMesh.scale.setScalar(1 + Math.sin(elapsedTime * 8) * 0.08);
      dustTrailPoints.rotation.z += 0.015;

      // Cosmic Shooting Star / Meteor Streak (উল্কাপাত)
      if (!meteorActive && Math.random() < 0.018) {
        meteorActive = true;
        meteorStartTime = elapsedTime;
        meteorStart.set(
          (Math.random() - 0.5) * 5.5,
          1.8 + Math.random() * 2.2,
          -1.0 + (Math.random() - 0.5) * 2.5
        );
        meteorDir.set(
          -(0.7 + Math.random() * 0.5),
          -(0.5 + Math.random() * 0.4),
          (Math.random() - 0.5) * 0.3
        ).normalize();
      }

      if (meteorActive) {
        const meteorAge = elapsedTime - meteorStartTime;
        if (meteorAge > meteorDuration) {
          meteorActive = false;
          meteorMat.opacity = 0;
        } else {
          const progress = meteorAge / meteorDuration;
          const speed = 9.0;
          const headPos = meteorStart.clone().add(meteorDir.clone().multiplyScalar(progress * speed));
          const tailPos = headPos.clone().sub(meteorDir.clone().multiplyScalar(0.85 * (1 - progress * 0.2)));

          const posAttr = meteorGeom.getAttribute('position') as THREE.BufferAttribute;
          posAttr.setXYZ(0, headPos.x, headPos.y, headPos.z);
          posAttr.setXYZ(1, tailPos.x, tailPos.y, tailPos.z);
          posAttr.needsUpdate = true;
          meteorMat.opacity = Math.sin(progress * Math.PI) * 0.9;
        }
      }

      // Orbit NISAR Satellite
      const satAngle = elapsedTime * 0.65;
      const satX = nisarOrbitRadius * Math.cos(satAngle);
      const satZ = nisarOrbitRadius * Math.sin(satAngle);
      const satPos = new THREE.Vector3(satX, 0, satZ);
      satPos.applyAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(-28));
      nisarMesh.position.copy(satPos);
      nisarMesh.lookAt(0, 0, 0);

      radarConeMesh.visible = showRadarBeams;
      radarConeMat.opacity = 0.15 + Math.sin(elapsedTime * 6) * 0.08; // Pulsing radar scan

      // Smooth zoom distance damping
      zoomDistanceRef.current += (targetZoomDistanceRef.current - zoomDistanceRef.current) * 0.1;
      camera.position.z = zoomDistanceRef.current;

      // Project 3D Hotspot positions to 2D screen coordinates for high-tech HUD badges
      if (cameraRef.current && earthGroupRef.current && rendererRef.current) {
        const tempV = new THREE.Vector3();
        const screenCoords = GLOBAL_DELTAS.map((delta) => {
          const worldPos = latLngToVector3(delta.lat, delta.lng, earthRadius * 1.01);
          worldPos.applyEuler(earthGroupRef.current!.rotation);

          // Check if facing camera (dot product > 0)
          tempV.copy(worldPos).normalize();
          const dot = tempV.dot(camera.position.clone().normalize());

          worldPos.project(camera);

          const halfWidth = width / 2;
          const halfHeight = height / 2;

          return {
            id: delta.id,
            x: worldPos.x * halfWidth + halfWidth,
            y: -(worldPos.y * halfHeight) + halfHeight,
            visible: dot > 0.08,
          };
        });

        setScreenHotspots(screenCoords);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Pointer drag to spin 360° on any device
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;

    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    targetRotationRef.current.y += deltaX * 0.006;
    targetRotationRef.current.x = Math.max(-1.1, Math.min(1.1, targetRotationRef.current.x + deltaY * 0.006));

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * 0.0015;
    targetZoomDistanceRef.current = Math.max(1.7, Math.min(3.6, targetZoomDistanceRef.current + delta));
  };

  // Fly Camera to selected Hotspot
  const handleFocusHotspot = (hotspot: RiverDeltaHotspot) => {
    setSelectedHotspot(hotspot);

    // Calculate rotation angles to bring hotspot to center
    const targetY = -((hotspot.lng + 180) * (Math.PI / 180)) + Math.PI / 2;
    const targetX = hotspot.lat * (Math.PI / 180) * 0.55;

    targetRotationRef.current.y = targetY;
    targetRotationRef.current.x = targetX;
    targetZoomDistanceRef.current = 2.15; // Smooth zoom into river reach
  };

  const activeHotspot = hoveredHotspot || selectedHotspot;

  return (
    <div className="relative w-full overflow-hidden select-none py-2 my-2 bg-[#020408]">
      
      {/* 1. TOP TELEMETRY STATUS BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col xs:flex-row items-center justify-between py-2 text-[10px] sm:text-xs font-mono text-slate-300 gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-cyan-400 font-bold uppercase tracking-wider">
            3D PLANETARY OBSERVATORY · FULL-WIDTH GALAXY STAGE
          </span>
        </div>
        <div className="flex items-center gap-3 sm:gap-5 text-[9px] sm:text-[11px]">
          <span className="hidden sm:inline-flex items-center gap-1 text-cyan-300">
            <Sparkles className="w-3 h-3 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>COMET & METEOR ACTIVE</span>
          </span>
          <span>ORBIT: <strong className="text-white">747 KM · NISAR L-BAND</strong></span>
          <span>TARGET: <strong className="text-cyan-300">{activeHotspot ? activeHotspot.name.split('(')[0] : 'BENGAL DELTA'}</strong></span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>PHOTOREALISTIC 3D</span>
          </span>
        </div>
      </div>

      {/* 2. QUICK RIVER DELTA NAVIGATION CHIPS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-[10px] font-mono">
        <span className="text-slate-500 uppercase tracking-wider text-[9px] mr-1 flex items-center gap-1 shrink-0">
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span>QUICK RIVER FOCUS:</span>
        </span>
        {GLOBAL_DELTAS.map((d) => {
          const isActive = selectedHotspot?.id === d.id;
          return (
            <button
              key={d.id}
              onClick={() => handleFocusHotspot(d)}
              className={`px-3 py-1 rounded-full border transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 active:scale-95 ${
                isActive
                  ? 'bg-cyan-500/25 border-cyan-400 text-white font-bold shadow-[0_0_15px_rgba(6,182,212,0.45)]'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
              <span>{d.name.split('(')[0].trim()}</span>
              <span className="text-[8px] text-slate-500">({d.country})</span>
            </button>
          );
        })}
      </div>

      {/* 3. MAIN FULL-WIDTH 3D THREE.JS CANVAS STAGE */}
      <div
        className="relative w-full h-[320px] xs:h-[400px] sm:h-[500px] md:h-[620px] cursor-grab active:cursor-grabbing overflow-hidden"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
      >
        {/* Three.js Mount Canvas Container */}
        <div ref={mountRef} className="w-full h-full" />

        {/* Floating 2D Screen-Projected Hotspot Badges on 3D Globe */}
        {screenHotspots.map((pt) => {
          const delta = GLOBAL_DELTAS.find((d) => d.id === pt.id);
          if (!delta || !pt.visible) return null;

          const isSelected = selectedHotspot?.id === delta.id;
          const isBD = delta.id === 'bangladesh';

          return (
            <div
              key={delta.id}
              style={{
                left: `${pt.x}px`,
                top: `${pt.y}px`,
                transform: 'translate(-50%, -100%)',
              }}
              className="absolute pointer-events-auto z-10 -mt-2 transition-transform duration-150"
              onMouseEnter={() => setHoveredHotspot(delta)}
              onMouseLeave={() => setHoveredHotspot(null)}
              onClick={(e) => {
                e.stopPropagation();
                handleFocusHotspot(delta);
              }}
            >
              <div className="flex flex-col items-center group cursor-pointer">
                {/* Identification HUD Badge */}
                <div
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-mono whitespace-nowrap shadow-2xl transition-all duration-300 flex items-center gap-1.5 backdrop-blur-md ${
                    isSelected || isBD
                      ? 'bg-slate-950/90 border border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-105'
                      : 'bg-slate-950/80 border border-slate-800 text-slate-300 hover:border-cyan-500/50 hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: delta.color }} />
                  <span className="font-bold">{delta.name.split('(')[0].trim().toUpperCase()}</span>
                  <span className="text-[8px] text-slate-400">· {delta.country}</span>
                </div>

                {/* Vertical Stalk Pin Indicator */}
                <div className="w-0.5 h-3 bg-gradient-to-b from-cyan-400 to-transparent" />
                <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
              </div>
            </div>
          );
        })}

        {/* Center Instructions Hint */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border border-cyan-500/30 text-[9px] sm:text-[11px] font-mono text-cyan-300 shadow-xl pointer-events-none whitespace-nowrap">
          <Move className="w-3 h-3 text-cyan-400 animate-pulse" />
          <span>DRAG 3D EARTH TO ROTATE 360° · SCROLL TO ZOOM · CLICK HOTSPOT</span>
        </div>

        {/* Top-Right Floating Detailed Sector Telemetry Card */}
        {activeHotspot && (
          <div className="absolute top-4 right-4 sm:right-6 max-w-xs sm:max-w-sm p-4 glass-panel-cyan rounded-2xl border border-cyan-500/50 text-xs font-mono shadow-2xl backdrop-blur-xl space-y-2 pointer-events-auto hidden sm:block animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeHotspot.color }} />
                <span className="text-cyan-400 font-bold uppercase text-[11px]">{activeHotspot.country}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                activeHotspot.status === 'CRITICAL' 
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {activeHotspot.status}
              </span>
            </div>

            <h4 className="font-bold text-white text-sm leading-snug">
              {activeHotspot.name}
            </h4>

            <div className="text-[10px] text-slate-400">
              River System: <strong className="text-slate-200">{activeHotspot.riverSystem}</strong>
            </div>

            <div className="grid grid-cols-2 gap-2 p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-[10px]">
              <div>
                <span className="text-slate-500 block">Coordinates:</span>
                <span className="text-cyan-300 font-bold">{activeHotspot.lat.toFixed(1)}° N, {activeHotspot.lng.toFixed(1)}° E</span>
              </div>
              <div>
                <span className="text-slate-500 block">Bankline Shift:</span>
                <span className="text-rose-400 font-bold">-{activeHotspot.retreatRateM} m/yr</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              {activeHotspot.keyFeature}
            </p>

            <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
              <button
                onClick={() => handleFocusHotspot(activeHotspot)}
                className="text-[10px] text-cyan-400 hover:text-white flex items-center gap-1 font-bold"
              >
                <Compass className="w-3 h-3" />
                <span>LOCK CAMERA</span>
              </button>

              {onNavigateToObservatory && (
                <button
                  onClick={onNavigateToObservatory}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500 text-slate-950 font-bold text-[10px] hover:bg-cyan-400 transition-all active:scale-95 flex items-center gap-1"
                >
                  <span>NASA GIBS MAP</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Bottom Floating Control Bar */}
        <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1 sm:gap-2 px-3 py-1.5 glass-panel rounded-full border border-slate-700/80 shadow-2xl z-20 backdrop-blur-md max-w-[96%] overflow-x-auto">
          
          {/* Play/Pause Auto-spin */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsRotating(!isRotating);
            }}
            className="p-1.5 text-slate-300 hover:text-cyan-400 transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center active:scale-95"
            title={isRotating ? 'Pause Auto-Spin' : 'Resume Auto-Spin'}
          >
            {isRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <div className="w-[1px] h-4 bg-slate-700" />

          {/* Reset / Focus Bangladesh View */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleFocusHotspot(GLOBAL_DELTAS[0]);
            }}
            className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono text-cyan-300 hover:bg-cyan-500/20 rounded-full transition-all min-h-[32px] active:scale-95 font-bold"
            title="Focus Bangladesh / Jamuna Basin"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>FOCUS BD</span>
          </button>

          <div className="w-[1px] h-4 bg-slate-700" />

          {/* Zoom Buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              targetZoomDistanceRef.current = Math.max(1.7, targetZoomDistanceRef.current - 0.35);
            }}
            className="p-1.5 text-slate-300 hover:text-cyan-400 transition-colors min-w-[30px] min-h-[32px] flex items-center justify-center active:scale-95"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              targetZoomDistanceRef.current = Math.min(3.6, targetZoomDistanceRef.current + 0.35);
            }}
            className="p-1.5 text-slate-300 hover:text-cyan-400 transition-colors min-w-[30px] min-h-[32px] flex items-center justify-center active:scale-95"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-4 bg-slate-700" />

          {/* Clouds Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowClouds(!showClouds);
            }}
            className={`px-2.5 py-1 text-[10px] font-mono rounded-full transition-all min-h-[32px] ${
              showClouds ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle Atmospheric Clouds"
          >
            CLD
          </button>

          {/* Radar Beams Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowRadarBeams(!showRadarBeams);
            }}
            className={`px-2.5 py-1 text-[10px] font-mono rounded-full transition-all min-h-[32px] ${
              showRadarBeams ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle SAR Microwave Swaths"
          >
            SAR
          </button>

          <div className="w-[1px] h-4 bg-slate-700" />

          {/* Satellite Mission Inspector */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              const sat = SIMULATED_SATELLITES[0];
              setSelectedSatInfo(sat);
              if (onSelectSatellite) onSelectSatellite(sat);
            }}
            className="p-1.5 text-cyan-400 hover:text-cyan-300 transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center active:scale-95"
            title="Inspect Satellite Telemetry"
          >
            <Satellite className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Satellite Info Card Modal */}
      {selectedSatInfo && (
        <div className="max-w-4xl mx-auto px-4 mt-3">
          <div className="w-full p-4 sm:p-5 glass-panel-cyan rounded-2xl border border-cyan-500/40 animate-in fade-in slide-in-from-bottom-3 duration-300 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] sm:text-xs font-mono text-cyan-400 font-bold uppercase">{selectedSatInfo.agency}</span>
                  <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold">{selectedSatInfo.band}</span>
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-white font-display mt-1">{selectedSatInfo.fullName}</h4>
              </div>
              <button
                onClick={() => setSelectedSatInfo(null)}
                className="text-xs font-mono text-slate-400 hover:text-white px-2.5 py-1 bg-slate-800 rounded-lg min-h-[32px] active:scale-95"
              >
                CLOSE
              </button>
            </div>

            <p className="text-xs text-slate-300 mt-2 leading-relaxed font-sans">{selectedSatInfo.description}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-3.5 pt-3 border-t border-slate-800/80 text-[10px] sm:text-[11px] font-mono">
              <div>
                <span className="text-slate-400 block text-[9px] sm:text-[10px] uppercase">ALTITUDE</span>
                <span className="text-white font-semibold text-xs sm:text-sm">{selectedSatInfo.orbitAltitudeKm} km</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] sm:text-[10px] uppercase">REVISIT</span>
                <span className="text-white font-semibold text-xs sm:text-sm">{selectedSatInfo.revisitDays} Days</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] sm:text-[10px] uppercase">RESOLUTION</span>
                <span className="text-white font-semibold text-xs sm:text-sm">{selectedSatInfo.spatialResolutionM}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] sm:text-[10px] uppercase">STATUS</span>
                <span className="text-emerald-400 font-semibold text-xs sm:text-sm">● {selectedSatInfo.activeStatus}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
