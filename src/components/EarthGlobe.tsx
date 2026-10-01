import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Satellite, ZoomIn, ZoomOut, RotateCcw, Move, Compass, Radio, Layers, Info } from 'lucide-react';
import { SIMULATED_SATELLITES } from '../data/simulatedData';
import { SatelliteMission } from '../types/charwatch';

interface EarthGlobeProps {
  onSelectBangladesh?: () => void;
  onSelectSatellite?: (sat: SatelliteMission) => void;
}

export const EarthGlobe: React.FC<EarthGlobeProps> = ({ onSelectBangladesh, onSelectSatellite }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isRotating, setIsRotating] = useState(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0); // 0.8 to 1.8
  const [showClouds, setShowClouds] = useState(true);
  const [showCityLights, setShowCityLights] = useState(true);
  const [showRadarBeams, setShowRadarBeams] = useState(true);
  const [selectedSatInfo, setSelectedSatInfo] = useState<SatelliteMission | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Rotation physics state
  const rotationRef = useRef({
    yaw: 28, // initial focus towards Bangladesh / South Asia
    pitch: 16,
    targetYaw: 28,
    targetPitch: 16,
    vx: 0,
    vy: 0,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
    isInteracting: false,
    dragDistance: 0,
    isAnimatingToTarget: false,
  });

  const zoomRef = useRef(zoomLevel);
  useEffect(() => {
    zoomRef.current = zoomLevel;
  }, [zoomLevel]);

  // High-fidelity continents coordinates
  const continents = [
    // 1. South Asia & Bengal Basin (Primary Focal Point)
    {
      name: 'South Asia & Bengal Delta',
      fill: '#1a3328', // Lush tropical vegetation
      stroke: 'rgba(56, 189, 248, 0.75)',
      strokeWidth: 1.6,
      points: [
        [35.0, 74.5], [34.5, 78.0], [31.5, 79.5], [29.0, 81.0], [27.5, 84.5], 
        [27.0, 88.5], [26.8, 89.8], [26.0, 92.5], [27.5, 94.0], [28.0, 96.5],
        [24.5, 93.8], [22.5, 92.2], [21.5, 92.0], [20.0, 92.8], [17.5, 94.5], 
        [16.0, 95.5], [16.5, 97.5], [14.0, 98.2], [10.5, 98.5], [8.0, 99.8],
        [1.5, 104.0], [4.5, 103.5], [7.0, 100.0], [12.5, 99.8], [13.5, 100.5],
        [11.5, 103.0], [8.5, 105.0], [10.5, 107.5], [16.0, 108.5], [21.0, 108.0],
        [21.8, 89.2], [22.4, 91.8], [20.5, 87.0], [18.0, 84.0], [15.5, 80.2],
        [10.8, 79.8], [9.2, 79.0], [8.2, 77.5], [10.0, 76.0], [13.0, 74.8],
        [16.0, 73.5], [19.0, 72.8], [21.0, 72.5], [21.0, 69.5], [23.5, 68.5],
        [25.0, 67.0], [25.5, 62.0], [30.0, 66.5], [34.0, 71.5]
      ]
    },
    // Sri Lanka Island
    {
      name: 'Sri Lanka',
      fill: '#1c3d2e',
      stroke: 'rgba(56, 189, 248, 0.6)',
      strokeWidth: 1.2,
      points: [
        [9.8, 80.2], [9.0, 80.8], [7.5, 81.8], [6.0, 81.2], 
        [6.0, 80.2], [7.0, 79.8], [8.5, 79.8]
      ]
    },
    // 2. East Asia, Tibetan Plateau & China
    {
      name: 'East Asia & China',
      fill: '#243b2f',
      stroke: 'rgba(56, 189, 248, 0.45)',
      strokeWidth: 1.2,
      points: [
        [22.0, 108.5], [25.0, 118.0], [30.0, 122.0], [32.0, 121.5], [37.5, 122.5],
        [39.0, 118.0], [38.5, 126.0], [42.0, 130.5], [43.0, 134.0], [48.0, 140.0],
        [54.0, 140.0], [60.0, 165.0], [68.0, 175.0], [72.0, 140.0], [74.0, 105.0],
        [70.0, 75.0], [55.0, 80.0], [45.0, 82.0], [38.0, 75.0], [35.0, 78.0]
      ]
    },
    // Japan
    {
      name: 'Japan',
      fill: '#1f382b',
      stroke: 'rgba(56, 189, 248, 0.5)',
      strokeWidth: 1.2,
      points: [
        [45.5, 142.0], [43.0, 145.5], [38.5, 141.5], [35.0, 140.0], 
        [33.5, 135.5], [31.5, 130.5], [34.0, 132.0], [36.5, 136.5], 
        [40.5, 140.0], [43.5, 141.0]
      ]
    },
    // 3. Middle East & Arabian Peninsula
    {
      name: 'Arabia & Middle East',
      fill: '#383023',
      stroke: 'rgba(217, 119, 6, 0.4)',
      strokeWidth: 1.2,
      points: [
        [30.0, 32.5], [28.0, 34.5], [22.0, 38.5], [15.5, 42.0], [12.8, 45.0],
        [14.5, 53.5], [17.0, 55.0], [22.5, 59.5], [26.0, 56.5], [27.0, 50.5],
        [30.0, 48.0], [31.0, 47.0], [35.5, 36.0], [33.0, 35.0], [31.5, 34.0]
      ]
    },
    // 4. Africa
    {
      name: 'Africa',
      fill: '#2b2a22',
      stroke: 'rgba(217, 119, 6, 0.35)',
      strokeWidth: 1.2,
      points: [
        [37.0, 10.0], [32.0, 32.0], [27.5, 34.0], [22.0, 37.0], [12.0, 43.5],
        [11.5, 51.0], [2.0, 45.0], [-5.0, 39.5], [-11.5, 40.5], [-17.0, 39.0],
        [-26.0, 33.0], [-34.5, 20.0], [-34.0, 18.5], [-22.0, 14.5], [-12.0, 13.5],
        [-5.0, 12.0], [4.5, 9.0], [5.0, 1.0], [4.5, -7.5], [11.0, -15.0],
        [15.0, -17.0], [21.0, -17.0], [32.0, -9.0], [35.5, -6.0], [36.0, 1.0]
      ]
    },
    // Madagascar
    {
      name: 'Madagascar',
      fill: '#1e3325',
      stroke: 'rgba(56, 189, 248, 0.4)',
      strokeWidth: 1.0,
      points: [
        [-12.0, 49.5], [-16.0, 50.0], [-25.0, 47.0], [-25.5, 45.0], 
        [-20.0, 44.0], [-13.5, 48.0]
      ]
    },
    // 5. Europe & Scandinavia
    {
      name: 'Europe',
      fill: '#1e332e',
      stroke: 'rgba(56, 189, 248, 0.4)',
      strokeWidth: 1.2,
      points: [
        [36.0, -5.5], [43.5, -9.0], [48.5, -4.5], [51.0, 2.0], [54.0, 8.5],
        [57.0, 8.5], [55.0, 13.0], [60.0, 18.0], [70.0, 28.0], [65.0, 40.0],
        [55.0, 38.0], [46.0, 30.0], [41.0, 29.0], [37.0, 15.0], [41.0, 1.0]
      ]
    },
    // 6. Australia & Maritime Continent
    {
      name: 'Australia',
      fill: '#382a1d',
      stroke: 'rgba(217, 119, 6, 0.45)',
      strokeWidth: 1.2,
      points: [
        [-12.0, 131.0], [-12.5, 136.0], [-15.0, 142.0], [-11.0, 142.5], 
        [-19.0, 147.0], [-24.0, 152.0], [-32.0, 153.0], [-37.5, 150.0],
        [-38.5, 145.0], [-35.0, 138.0], [-32.0, 132.0], [-34.5, 122.0],
        [-34.0, 115.0], [-26.0, 113.0], [-20.0, 117.0], [-15.0, 124.0]
      ]
    },
    // Indonesia Archipelago
    {
      name: 'Indonesia Archipelago',
      fill: '#163527',
      stroke: 'rgba(56, 189, 248, 0.4)',
      strokeWidth: 1.0,
      points: [
        [5.5, 95.5], [3.0, 98.5], [-5.0, 105.0], [-6.0, 106.5], 
        [-7.5, 110.0], [-8.5, 115.0], [-8.5, 122.0], [-6.5, 108.0],
        [-3.0, 104.0], [1.0, 100.5]
      ]
    },
    // 7. North America
    {
      name: 'North America',
      fill: '#22382c',
      stroke: 'rgba(56, 189, 248, 0.35)',
      strokeWidth: 1.2,
      points: [
        [70.0, -160.0], [60.0, -140.0], [48.0, -125.0], [32.0, -117.0], [20.0, -105.0],
        [15.0, -92.0], [22.0, -97.0], [29.0, -90.0], [25.0, -80.5], [30.0, -81.0],
        [40.0, -74.0], [45.0, -65.0], [60.0, -64.0], [70.0, -85.0], [72.0, -120.0]
      ]
    },
    // 8. South America
    {
      name: 'South America',
      fill: '#1c3829',
      stroke: 'rgba(56, 189, 248, 0.35)',
      strokeWidth: 1.2,
      points: [
        [10.0, -75.0], [-2.0, -80.0], [-18.0, -70.0], [-40.0, -72.0], [-55.0, -68.0],
        [-45.0, -60.0], [-23.0, -43.0], [-5.0, -35.0], [5.0, -52.0], [8.0, -60.0]
      ]
    }
  ];

  // Real world city lights
  const cityLights = [
    { lat: 23.81, lng: 90.41, intensity: 1.0, name: 'Dhaka' },
    { lat: 22.35, lng: 91.83, intensity: 0.85, name: 'Chittagong' },
    { lat: 24.37, lng: 88.60, intensity: 0.75, name: 'Rajshahi' },
    { lat: 22.84, lng: 89.54, intensity: 0.7, name: 'Khulna' },
    { lat: 22.57, lng: 88.36, intensity: 0.95, name: 'Kolkata' },
    { lat: 28.61, lng: 77.20, intensity: 1.0, name: 'Delhi' },
    { lat: 19.07, lng: 72.87, intensity: 1.0, name: 'Mumbai' },
    { lat: 13.08, lng: 80.27, intensity: 0.9, name: 'Chennai' },
    { lat: 12.97, lng: 77.59, intensity: 0.9, name: 'Bengaluru' },
    { lat: 13.75, lng: 100.50, intensity: 0.95, name: 'Bangkok' },
    { lat: 1.35, lng: 103.81, intensity: 1.0, name: 'Singapore' },
    { lat: 31.23, lng: 121.47, intensity: 1.0, name: 'Shanghai' },
    { lat: 35.67, lng: 139.65, intensity: 1.0, name: 'Tokyo' },
    { lat: 25.20, lng: 55.27, intensity: 1.0, name: 'Dubai' },
    { lat: 51.50, lng: -0.12, intensity: 0.95, name: 'London' },
    { lat: 40.71, lng: -74.00, intensity: 1.0, name: 'New York' },
  ];

  // 3D Spherical projection formula with uniform spherical geometry
  const project3D = (
    latDeg: number,
    lngDeg: number,
    yawDeg: number,
    pitchDeg: number,
    radius: number,
    cx: number,
    cy: number
  ) => {
    const latRad = (latDeg * Math.PI) / 180;
    const lngRad = ((lngDeg + yawDeg) * Math.PI) / 180;
    const pitchRad = (pitchDeg * Math.PI) / 180;

    const x0 = Math.cos(latRad) * Math.sin(lngRad);
    const y0 = Math.sin(latRad);
    const z0 = Math.cos(latRad) * Math.cos(lngRad);

    const x1 = x0;
    const y1 = y0 * Math.cos(pitchRad) - z0 * Math.sin(pitchRad);
    const z1 = y0 * Math.sin(pitchRad) + z0 * Math.cos(pitchRad);

    return {
      x: cx + radius * x1,
      y: cy - radius * y1,
      z: z1,
      visible: z1 > -0.05,
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let cloudAngle = 0;
    let pulseRing = 0;
    let radarWaveOffset = 0;

    let width = 0;
    let height = 0;
    let dpr = 1;

    // Background cosmic galaxy stars
    const galaxyStars: { x: number; y: number; size: number; alpha: number; color: string }[] = [];

    const handleResize = () => {
      if (!canvas || !container) return;
      const rect = container.getBoundingClientRect();
      width = Math.round(rect.width);
      height = Math.round(rect.height);
      if (width <= 0 || height <= 0) return;

      dpr = Math.min(2, window.devicePixelRatio || 1);

      // Lock internal canvas pixel buffer EXACTLY to displayed CSS dimensions
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // Generate background cosmic dust and galaxy stars across the wide banner
      galaxyStars.length = 0;
      const count = Math.min(260, Math.floor((width * height) / 3600));
      for (let s = 0; s < count; s++) {
        galaxyStars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.5 + 0.3,
          alpha: Math.random() * 0.7 + 0.2,
          color: Math.random() > 0.65 ? '#67e8f9' : Math.random() > 0.4 ? '#93c5fd' : '#f8fafc',
        });
      }
    };

    handleResize();

    // Use ResizeObserver to keep canvas strictly non-distorted under all window resizes
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(container);
    } else {
      window.addEventListener('resize', handleResize);
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Deep void background
      ctx.fillStyle = '#020408';
      ctx.fillRect(0, 0, width, height);

      // ==========================================
      // 1. FULL-WIDTH PANORAMIC GALAXY AMBIENCE
      // ==========================================
      const galaxyCoreGrad = ctx.createRadialGradient(
        cx,
        cy,
        20,
        cx,
        cy,
        Math.max(width * 0.65, height * 0.9)
      );
      galaxyCoreGrad.addColorStop(0, 'rgba(14, 116, 144, 0.16)');
      galaxyCoreGrad.addColorStop(0.3, 'rgba(30, 58, 138, 0.11)');
      galaxyCoreGrad.addColorStop(0.65, 'rgba(15, 23, 42, 0.05)');
      galaxyCoreGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = galaxyCoreGrad;
      ctx.fillRect(0, 0, width, height);

      // Render wide-field ambient galaxy stars
      galaxyStars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // Smooth target interpolation if animating to Bangladesh
      const rot = rotationRef.current;
      if (rot.isAnimatingToTarget) {
        rot.yaw += (rot.targetYaw - rot.yaw) * 0.08;
        rot.pitch += (rot.targetPitch - rot.pitch) * 0.08;
        if (Math.abs(rot.targetYaw - rot.yaw) < 0.1 && Math.abs(rot.targetPitch - rot.pitch) < 0.1) {
          rot.yaw = rot.targetYaw;
          rot.pitch = rot.targetPitch;
          rot.isAnimatingToTarget = false;
        }
      } else if (!rot.isInteracting) {
        // Momentum decay after drag
        if (Math.abs(rot.vx) > 0.005) {
          rot.yaw += rot.vx;
          rot.vx *= 0.93;
        } else if (isRotating) {
          rot.yaw += 0.22; // Natural orbital planetary spin
        }

        if (Math.abs(rot.vy) > 0.005) {
          rot.pitch = Math.max(-65, Math.min(65, rot.pitch + rot.vy));
          rot.vy *= 0.93;
        }
      }

      cloudAngle = (cloudAngle + 0.26) % 360;

      // True circular sphere radius based on strictly equal minDim
      const currentZoom = zoomRef.current;
      const minDim = Math.min(width, height);
      // Fits comfortably with ample space for orbit rings and atmosphere glow
      const baseRadius = (minDim * 0.355) * currentZoom;
      const currentYaw = rot.yaw;
      const currentPitch = rot.pitch;

      // ==========================================
      // 2. ATMOSPHERE RAYLEIGH SCATTERING (CIRCULAR LIMB GLOW)
      // ==========================================
      const atmosOuter = ctx.createRadialGradient(
        cx,
        cy,
        baseRadius * 0.96,
        cx,
        cy,
        baseRadius * 1.34
      );
      atmosOuter.addColorStop(0, 'rgba(6, 182, 212, 0.55)');
      atmosOuter.addColorStop(0.22, 'rgba(14, 165, 233, 0.28)');
      atmosOuter.addColorStop(0.55, 'rgba(37, 99, 235, 0.09)');
      atmosOuter.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius * 1.34, 0, Math.PI * 2);
      ctx.fillStyle = atmosOuter;
      ctx.fill();

      // Inner corona
      const atmosInner = ctx.createRadialGradient(
        cx - baseRadius * 0.2,
        cy - baseRadius * 0.25,
        baseRadius * 0.5,
        cx,
        cy,
        baseRadius * 1.04
      );
      atmosInner.addColorStop(0, 'transparent');
      atmosInner.addColorStop(0.85, 'rgba(56, 189, 248, 0.15)');
      atmosInner.addColorStop(1, 'rgba(6, 182, 212, 0.52)');

      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius * 1.04, 0, Math.PI * 2);
      ctx.fillStyle = atmosInner;
      ctx.fill();

      // ==========================================
      // 3. REALISTIC OCEAN WATER BODY (PURE CIRCULAR SPHERE)
      // ==========================================
      const sunX = cx - baseRadius * 0.38;
      const sunY = cy - baseRadius * 0.38;

      const oceanGrad = ctx.createRadialGradient(
        sunX,
        sunY,
        baseRadius * 0.06,
        cx,
        cy,
        baseRadius
      );
      oceanGrad.addColorStop(0, '#2563eb');     // Sunlight reflection glint
      oceanGrad.addColorStop(0.18, '#0284c7');  // Tropical blue
      oceanGrad.addColorStop(0.48, '#034a78');  // Deep abyssal plain
      oceanGrad.addColorStop(0.82, '#081e3a');  // Shadow twilight
      oceanGrad.addColorStop(1, '#020b18');     // Planet edge

      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius, 0, Math.PI * 2);
      ctx.fillStyle = oceanGrad;
      ctx.shadowColor = 'rgba(6, 182, 212, 0.38)';
      ctx.shadowBlur = 32;
      ctx.fill();
      ctx.shadowBlur = 0;

      // ==========================================
      // 4. CLIP TO PLANET SPHERE
      // ==========================================
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius, 0, Math.PI * 2);
      ctx.clip();

      // 4.1 Graticule lines (Strictly circular projection)
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 0.8;
      for (let lat = -60; lat <= 60; lat += 20) {
        ctx.beginPath();
        let started = false;
        for (let lng = 0; lng <= 360; lng += 6) {
          const pt = project3D(lat, lng, currentYaw, currentPitch, baseRadius, cx, cy);
          if (pt.visible) {
            if (!started) {
              ctx.moveTo(pt.x, pt.y);
              started = true;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            started = false;
          }
        }
        ctx.stroke();
      }

      for (let lng = 0; lng < 360; lng += 30) {
        ctx.beginPath();
        let started = false;
        for (let lat = -80; lat <= 80; lat += 5) {
          const pt = project3D(lat, lng, currentYaw, currentPitch, baseRadius, cx, cy);
          if (pt.visible) {
            if (!started) {
              ctx.moveTo(pt.x, pt.y);
              started = true;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            started = false;
          }
        }
        ctx.stroke();
      }

      // 4.2 Continents & Biomes
      continents.forEach((continent) => {
        ctx.beginPath();
        let firstPoint = true;
        let drawnCount = 0;

        continent.points.forEach(([lat, lng]) => {
          const pt = project3D(lat, lng, currentYaw, currentPitch, baseRadius, cx, cy);
          if (pt.visible) {
            if (firstPoint) {
              ctx.moveTo(pt.x, pt.y);
              firstPoint = false;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
            drawnCount++;
          }
        });

        if (drawnCount > 2) {
          ctx.closePath();
          ctx.fillStyle = continent.fill;
          ctx.fill();

          ctx.strokeStyle = continent.stroke;
          ctx.lineWidth = continent.strokeWidth;
          ctx.stroke();
        }
      });

      // 4.3 Bengal Sediment Plume in Bay of Bengal
      const bdPlume = project3D(21.4, 90.2, currentYaw, currentPitch, baseRadius, cx, cy);
      if (bdPlume.visible) {
        const plumeGrad = ctx.createRadialGradient(
          bdPlume.x,
          bdPlume.y,
          2,
          bdPlume.x,
          bdPlume.y + 16,
          46 * currentZoom
        );
        plumeGrad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
        plumeGrad.addColorStop(0.5, 'rgba(14, 116, 144, 0.22)');
        plumeGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = plumeGrad;
        ctx.beginPath();
        ctx.ellipse(bdPlume.x, bdPlume.y + 12, 36 * currentZoom, 20 * currentZoom, Math.PI / 7, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4.4 Dynamic Clouds
      if (showClouds) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
        for (let c = 0; c < 16; c++) {
          const cLat = ((c % 7) - 3) * 14;
          const cLng = c * 22.5 + cloudAngle;
          const cloudPt = project3D(cLat, cLng, currentYaw * 0.92, currentPitch, baseRadius, cx, cy);

          if (cloudPt.visible) {
            ctx.beginPath();
            ctx.ellipse(
              cloudPt.x,
              cloudPt.y,
              baseRadius * 0.26,
              baseRadius * 0.08,
              (c * Math.PI) / 5,
              0,
              Math.PI * 2
            );
            ctx.fill();
          }
        }

        // Monsoon Cyclone in Bay of Bengal
        const monsoonCyclone = project3D(18.5, 88.5, currentYaw * 0.92, currentPitch, baseRadius, cx, cy);
        if (monsoonCyclone.visible) {
          ctx.save();
          ctx.translate(monsoonCyclone.x, monsoonCyclone.y);
          ctx.rotate((cloudAngle * Math.PI) / 90);
          ctx.beginPath();
          ctx.ellipse(0, 0, 42 * currentZoom, 18 * currentZoom, 0, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.24)';
          ctx.fill();
          ctx.restore();
        }
      }

      // 4.5 Solar Day-Night Terminator
      const terminatorGrad = ctx.createLinearGradient(
        cx - baseRadius * 0.7,
        cy - baseRadius * 0.7,
        cx + baseRadius * 0.85,
        cy + baseRadius * 0.85
      );
      terminatorGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      terminatorGrad.addColorStop(0.38, 'rgba(3, 7, 18, 0.15)');
      terminatorGrad.addColorStop(0.68, 'rgba(2, 6, 23, 0.75)');
      terminatorGrad.addColorStop(1, 'rgba(2, 6, 23, 0.96)');

      ctx.fillStyle = terminatorGrad;
      ctx.fillRect(cx - baseRadius * 1.2, cy - baseRadius * 1.2, baseRadius * 2.4, baseRadius * 2.4);

      // 4.6 Night-Side City Lights
      if (showCityLights) {
        cityLights.forEach((city) => {
          const pt = project3D(city.lat, city.lng, currentYaw, currentPitch, baseRadius, cx, cy);
          if (pt.visible) {
            const nightFactor = Math.max(0, (pt.x - (cx - 35)) / baseRadius);
            if (nightFactor > 0.12) {
              const alpha = Math.min(1, nightFactor * city.intensity * 0.95);
              ctx.beginPath();
              ctx.arc(pt.x, pt.y, 2.2, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(253, 224, 71, ${alpha})`;
              ctx.shadowColor = '#f59e0b';
              ctx.shadowBlur = 7;
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }
        });
      }

      ctx.restore(); // End Sphere Clip

      // ==========================================
      // 5. BANGLADESH TARGET LOCATOR & RADAR RETICLE
      // ==========================================
      const bdPt = project3D(23.8, 90.4, currentYaw, currentPitch, baseRadius, cx, cy);

      if (bdPt.visible) {
        pulseRing = (pulseRing + 0.38) % 36;

        ctx.beginPath();
        ctx.arc(bdPt.x, bdPt.y, pulseRing, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(6, 182, 212, ${Math.max(0, 1 - pulseRing / 36)})`;
        ctx.lineWidth = 1.8;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(bdPt.x, bdPt.y, Math.max(0, pulseRing - 14), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${Math.max(0, 1 - pulseRing / 36)})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(bdPt.x, bdPt.y, 6.5, 0, Math.PI * 2);
        ctx.fillStyle = '#06b6d4';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 18;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(bdPt.x + 10, bdPt.y - 12, 138, 34);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px JetBrains Mono, monospace';
        ctx.fillText('BANGLADESH · JAMUNA', bdPt.x + 14, bdPt.y + 2);

        ctx.fillStyle = '#38bdf8';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillText('23.8° N 90.4° E · SAR ACTIVE', bdPt.x + 14, bdPt.y + 16);
      }

      // ==========================================
      // 6. ORBITING SATELLITES & ACTIVE RADAR CONES
      // ==========================================
      const renderSatellite3D = (
        orbitR: number,
        orbitTiltDeg: number,
        colorHex: string,
        satName: string,
        speedMultiplier: number,
        frequencyBand: string
      ) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate((orbitTiltDeg * Math.PI) / 180);

        ctx.beginPath();
        ctx.ellipse(0, 0, orbitR, orbitR * 0.44, 0, 0, Math.PI * 2);
        ctx.strokeStyle = colorHex.replace('1)', '0.35)');
        ctx.lineWidth = 1.2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);

        const satAngle = ((currentYaw * speedMultiplier * 1.35) * Math.PI) / 180;
        const satX = orbitR * Math.cos(satAngle);
        const satY = orbitR * 0.44 * Math.sin(satAngle);

        if (showRadarBeams && bdPt.visible) {
          const targetInCoordsX = bdPt.x - cx;
          const targetInCoordsY = bdPt.y - cy;
          const distToTarget = Math.hypot(satX - targetInCoordsX, satY - targetInCoordsY);

          if (distToTarget < baseRadius * 1.1) {
            radarWaveOffset = (radarWaveOffset + 0.08) % 1;
            const coneGrad = ctx.createLinearGradient(satX, satY, targetInCoordsX, targetInCoordsY);
            coneGrad.addColorStop(0, colorHex.replace('1)', '0.75)'));
            coneGrad.addColorStop(0.5, colorHex.replace('1)', '0.22)'));
            coneGrad.addColorStop(1, 'rgba(6, 182, 212, 0.03)');

            ctx.beginPath();
            ctx.moveTo(satX, satY);
            ctx.lineTo(targetInCoordsX - 22, targetInCoordsY);
            ctx.lineTo(targetInCoordsX + 22, targetInCoordsY);
            ctx.closePath();
            ctx.fillStyle = coneGrad;
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(satX, satY);
            ctx.lineTo(targetInCoordsX, targetInCoordsY);
            ctx.strokeStyle = colorHex.replace('1)', '0.85)');
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(satX, satY, 6, 0, Math.PI * 2);
        ctx.fillStyle = colorHex;
        ctx.shadowColor = colorHex;
        ctx.shadowBlur = 14;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(satX - 8, satY);
        ctx.lineTo(satX + 8, satY);
        ctx.stroke();

        ctx.fillStyle = colorHex;
        ctx.font = 'bold 10px JetBrains Mono, monospace';
        ctx.fillText(`${satName} [${frequencyBand}]`, satX + 12, satY - 4);

        ctx.restore();
      };

      renderSatellite3D(baseRadius * 1.35, -28, 'rgba(6, 182, 212, 1)', 'NISAR', 1.25, 'L-BAND');
      renderSatellite3D(baseRadius * 1.55, 36, 'rgba(245, 158, 11, 1)', 'SENTINEL-1', 0.92, 'C-BAND');

      // Top and bottom edge gradient fades for seamless theme integration
      const topFade = ctx.createLinearGradient(0, 0, 0, 50);
      topFade.addColorStop(0, '#020408');
      topFade.addColorStop(1, 'transparent');
      ctx.fillStyle = topFade;
      ctx.fillRect(0, 0, width, 50);

      const bottomFade = ctx.createLinearGradient(0, height - 50, 0, height);
      bottomFade.addColorStop(0, 'transparent');
      bottomFade.addColorStop(1, '#020408');
      ctx.fillStyle = bottomFade;
      ctx.fillRect(0, height - 50, width, 50);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener('resize', handleResize);
      }
      cancelAnimationFrame(animId);
    };
  }, [isRotating, showClouds, showCityLights, showRadarBeams]);

  // Pointer & Drag Handlers with Pointer Capture
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    setIsDragging(true);
    const rot = rotationRef.current;
    rot.isInteracting = true;
    rot.isAnimatingToTarget = false;
    rot.lastX = e.clientX;
    rot.lastY = e.clientY;
    rot.lastTime = performance.now();
    rot.vx = 0;
    rot.vy = 0;
    rot.dragDistance = 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const rot = rotationRef.current;
    if (!rot.isInteracting) return;

    const dx = e.clientX - rot.lastX;
    const dy = e.clientY - rot.lastY;
    const now = performance.now();
    const dt = Math.max(1, now - rot.lastTime);

    rot.dragDistance += Math.hypot(dx, dy);

    rot.yaw += dx * 0.42;
    rot.pitch = Math.max(-65, Math.min(65, rot.pitch - dy * 0.35));

    rot.vx = (dx / dt) * 4.2;
    rot.vy = (-dy / dt) * 3.5;

    rot.lastX = e.clientX;
    rot.lastY = e.clientY;
    rot.lastTime = now;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    setIsDragging(false);
    const rot = rotationRef.current;
    rot.isInteracting = false;

    if (rot.dragDistance < 6) {
      if (onSelectBangladesh) onSelectBangladesh();
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.0015;
    setZoomLevel((prev) => Math.max(0.8, Math.min(1.85, prev + delta)));
  };

  const handleFocusBangladesh = () => {
    const rot = rotationRef.current;
    rot.targetYaw = 28;
    rot.targetPitch = 16;
    rot.vx = 0;
    rot.vy = 0;
    rot.isAnimatingToTarget = true;
    setZoomLevel(1.2);
  };

  return (
    <div className="relative w-full overflow-hidden select-none py-2 my-2 bg-[#020408]">
      
      {/* Top Telemetry Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col xs:flex-row items-center justify-between py-2 text-[10px] sm:text-xs font-mono text-slate-300 gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-cyan-400 font-bold uppercase tracking-wider">3D PLANETARY OBSERVATORY · FULL-WIDTH GALAXY STAGE</span>
        </div>
        <div className="flex items-center gap-3 sm:gap-5 text-[9px] sm:text-[11px]">
          <span>ORBIT: <strong className="text-white">747 KM</strong></span>
          <span>LAT: <strong className="text-white">23.8° N · BD</strong></span>
          <span className="text-emerald-400 font-bold">● SAR MICROWAVE ACTIVE</span>
        </div>
      </div>

      {/* Main Full-Width Panoramic Planet & Galaxy Canvas Stage */}
      <div
        ref={containerRef}
        style={{ touchAction: 'none' }}
        className={`relative w-full h-[320px] xs:h-[380px] sm:h-[480px] md:h-[580px] ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        } transition-transform duration-300 flex items-center justify-center overflow-hidden`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
      >
        <canvas
          ref={canvasRef}
          className="block filter drop-shadow-[0_0_60px_rgba(6,182,212,0.25)] mx-auto"
        />

        {/* Interactive Cue Badge */}
        <div className="absolute top-2.5 sm:top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full glass-panel border border-cyan-500/30 text-[9px] sm:text-[11px] font-mono text-cyan-300 shadow-xl pointer-events-none whitespace-nowrap">
          <Move className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-cyan-400 animate-pulse" />
          <span>DRAG TO SPIN 360° · SCROLL TO ZOOM</span>
        </div>

        {/* Floating Controls Overlay (Compact for Desktop, Tablet & Mobile) */}
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 sm:gap-2 px-2 sm:px-3.5 py-1 sm:py-1.5 glass-panel rounded-full border border-slate-700/80 shadow-2xl z-20 backdrop-blur-md max-w-[98%] overflow-x-auto">
          
          {/* Play/Pause Auto-spin */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsRotating(!isRotating);
            }}
            className="p-1 sm:p-1.5 text-slate-300 hover:text-cyan-400 transition-colors min-w-[30px] min-h-[30px] flex items-center justify-center active:scale-95"
            title={isRotating ? 'Pause Auto-Spin' : 'Resume Auto-Spin'}
          >
            {isRotating ? <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>

          <div className="w-[1px] h-3.5 bg-slate-700" />

          {/* Reset / Focus Bangladesh View */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleFocusBangladesh();
            }}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1 text-[9px] sm:text-[10px] font-mono text-cyan-300 hover:bg-cyan-500/20 rounded-full transition-all min-h-[30px] active:scale-95"
            title="Focus Bangladesh / Jamuna Basin"
          >
            <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>FOCUS BD</span>
          </button>

          <div className="w-[1px] h-3.5 bg-slate-700" />

          {/* Zoom Buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setZoomLevel((prev) => Math.min(1.85, prev + 0.15));
            }}
            className="p-1 sm:p-1.5 text-slate-300 hover:text-cyan-400 transition-colors min-w-[28px] min-h-[30px] flex items-center justify-center active:scale-95"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setZoomLevel((prev) => Math.max(0.8, prev - 0.15));
            }}
            className="p-1 sm:p-1.5 text-slate-300 hover:text-cyan-400 transition-colors min-w-[28px] min-h-[30px] flex items-center justify-center active:scale-95"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <div className="w-[1px] h-3.5 bg-slate-700" />

          {/* Clouds Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowClouds(!showClouds);
            }}
            className={`px-2 sm:px-2.5 py-1 text-[9px] sm:text-[10px] font-mono rounded-full transition-all min-h-[30px] ${
              showClouds ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle Atmospheric Clouds"
          >
            CLD
          </button>

          {/* City Lights Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowCityLights(!showCityLights);
            }}
            className={`px-2 sm:px-2.5 py-1 text-[9px] sm:text-[10px] font-mono rounded-full transition-all min-h-[30px] ${
              showCityLights ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle Night City Lights"
          >
            CITY
          </button>

          {/* Radar Beams Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowRadarBeams(!showRadarBeams);
            }}
            className={`px-2 sm:px-2.5 py-1 text-[9px] sm:text-[10px] font-mono rounded-full transition-all min-h-[30px] ${
              showRadarBeams ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle SAR Microwave Swaths"
          >
            SAR
          </button>

          <div className="w-[1px] h-3.5 bg-slate-700" />

          {/* Satellite Mission Inspector */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              const sat = SIMULATED_SATELLITES[0];
              setSelectedSatInfo(sat);
              if (onSelectSatellite) onSelectSatellite(sat);
            }}
            className="p-1 sm:p-1.5 text-cyan-400 hover:text-cyan-300 transition-colors min-w-[30px] min-h-[30px] flex items-center justify-center active:scale-95"
            title="Inspect Satellite Telemetry"
          >
            <Satellite className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
