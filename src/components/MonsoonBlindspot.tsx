import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Eye, Radio, Cloud, ShieldCheck, CheckCircle2, Zap, ArrowLeftRight, AlertTriangle, Play, Pause, Layers, Crosshair, Sparkles, Compass } from 'lucide-react';
import { RadarMissionPlayer } from './RadarMissionPlayer';

export const MonsoonBlindspot: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 - 100
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeLayer, setActiveLayer] = useState<'ALL' | 'EROSION_VECTORS' | 'DIELECTRIC'>('ALL');
  const [isAutoScanning, setIsAutoScanning] = useState(false);
  const scanDirectionRef = useRef<'UP' | 'DOWN'>('UP');
  const autoScanAnimRef = useRef<number | null>(null);

  // Ultra-smooth pointer position updater
  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width <= 0) return;
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
  }, []);

  // Pointer event handlers with hardware pointer capture to prevent drops & stutter ("brake brake")
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsAutoScanning(false);
    setIsDragging(true);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault();
    updatePosition(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (_) {}
    }
  };

  // Keyboard navigation for precision fine-tuning
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setIsAutoScanning(false);
      setSliderPosition((prev) => Math.max(0, prev - 2));
    } else if (e.key === 'ArrowRight') {
      setIsAutoScanning(false);
      setSliderPosition((prev) => Math.min(100, prev + 2));
    }
  };

  // Silky 60/120fps auto-scan ping pong animation with timestamp delta
  useEffect(() => {
    if (!isAutoScanning) {
      if (autoScanAnimRef.current) cancelAnimationFrame(autoScanAnimRef.current);
      return;
    }

    let lastTime = performance.now();
    const animate = (currentTime: number) => {
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1); // cap max delta to avoid frame spikes
      lastTime = currentTime;

      setSliderPosition((prev) => {
        const speed = 22; // % per second for a smooth cinematic scan
        let next = scanDirectionRef.current === 'UP' ? prev + speed * delta : prev - speed * delta;
        if (next >= 96) {
          next = 96;
          scanDirectionRef.current = 'DOWN';
        } else if (next <= 4) {
          next = 4;
          scanDirectionRef.current = 'UP';
        }
        return next;
      });

      autoScanAnimRef.current = requestAnimationFrame(animate);
    };

    autoScanAnimRef.current = requestAnimationFrame(animate);
    return () => {
      if (autoScanAnimRef.current) cancelAnimationFrame(autoScanAnimRef.current);
    };
  }, [isAutoScanning]);

  // Derived penetration percentage
  const radarPenetrationPct = Math.round(100 - sliderPosition);

  return (
    <section className="w-full max-w-6xl mx-auto py-14 sm:py-20 px-3 sm:px-4">
      
      {/* Section Kicker & Headline */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
          <Cloud className="w-3.5 h-3.5" />
          <span>MONSOON SATELLITE BLINDSPOT · PHYSICAL MICROWAVE SENSING</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight font-display">
          WHEN CLOUDS HIDE THE RIVER, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
            RADAR KEEPS WATCHING.
          </span>
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm md:text-base mt-4 leading-relaxed font-sans">
          During Bangladesh's monsoon season (June to October), dense convective cloud formations blind standard optical satellites (Landsat, Sentinel-2) up to 85% of the time. Synthetic Aperture Radar (SAR) transmits microwave pulses (L-band & C-band) that penetrate storm clouds, rain curtains, and darkness to reveal changing riverbanks with surgical precision.
        </p>
      </div>

      {/* FULL-WIDTH RESPONSIVE RADAR MISSION VIDEO PLAYER SHOWCASE */}
      <div className="w-full mb-12 sm:mb-16">
        <RadarMissionPlayer />
      </div>

      {/* Interactive Reveal Control Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 px-2 gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-cyan-300 font-bold tracking-wider">
          <ArrowLeftRight className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>DRAG SLIDER TO REVEAL SAR RADAR PENETRATION</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick preset buttons */}
          <div className="flex items-center gap-1 p-1 glass-panel rounded-lg border border-slate-800">
            <button
              onClick={() => { setIsAutoScanning(false); setSliderPosition(0); }}
              className={`px-2.5 py-1 rounded text-[11px] transition-all ${
                sliderPosition === 0 ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              0% CLOUDS
            </button>
            <button
              onClick={() => { setIsAutoScanning(false); setSliderPosition(50); }}
              className={`px-2.5 py-1 rounded text-[11px] transition-all ${
                Math.abs(sliderPosition - 50) < 1 ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              50% SPLIT
            </button>
            <button
              onClick={() => { setIsAutoScanning(false); setSliderPosition(100); }}
              className={`px-2.5 py-1 rounded text-[11px] transition-all ${
                sliderPosition === 100 ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              100% RADAR
            </button>
            <button
              onClick={() => setIsAutoScanning(!isAutoScanning)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-[11px] font-bold transition-all ${
                isAutoScanning
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                  : 'text-slate-400 hover:text-cyan-300'
              }`}
              title="Continuous Automatic Radar Swath Sweep"
            >
              {isAutoScanning ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 fill-slate-400 text-slate-400" />}
              <span>{isAutoScanning ? 'PAUSE SCAN' : 'AUTO-SCAN'}</span>
            </button>
          </div>

          {/* Layer Selector Bar */}
          <div className="flex items-center gap-1 p-1 glass-panel rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveLayer('ALL')}
              className={`px-2.5 py-1 rounded text-[11px] transition-all ${
                activeLayer === 'ALL' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              COMPOSITE
            </button>
            <button
              onClick={() => setActiveLayer('EROSION_VECTORS')}
              className={`px-2.5 py-1 rounded text-[11px] transition-all ${
                activeLayer === 'EROSION_VECTORS' ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              EROSION VECTORS
            </button>
            <button
              onClick={() => setActiveLayer('DIELECTRIC')}
              className={`px-2.5 py-1 rounded text-[11px] transition-all ${
                activeLayer === 'DIELECTRIC' ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              DIELECTRIC
            </button>
          </div>
        </div>
      </div>

      {/* Photorealistic Dual-Spectrum Interactive Viewer Container */}
      <div
        ref={containerRef}
        tabIndex={0}
        role="slider"
        aria-label="SAR Radar Cloud Penetration Split Slider"
        aria-valuenow={Math.round(sliderPosition)}
        aria-valuemin={0}
        aria-valuemax={100}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative w-full h-[380px] xs:h-[440px] sm:h-[520px] md:h-[580px] rounded-2xl sm:rounded-3xl overflow-hidden glass-panel border-2 border-cyan-500/40 cursor-ew-resize select-none shadow-[0_25px_70px_rgba(0,0,0,0.9)] bg-black touch-none focus:outline-none focus:ring-2 focus:ring-cyan-400/80 transition-shadow"
      >
        
        {/* =========================================================================
            LAYER 1: AUTHENTIC SYNTHETIC APERTURE RADAR (SAR) VIEW (Bottom Layer)
           ========================================================================= */}
        <div className="absolute inset-0 select-none overflow-hidden">
          
          {/* Authentic Satellite SAR Radar Imagery */}
          <img
            src="/images/sar_radar.jpg"
            alt="Authentic Synthetic Aperture Radar (SAR) imagery of Jamuna River, Bangladesh"
            className="w-full h-full object-cover filter contrast-[1.12] brightness-[1.05] pointer-events-none select-none will-change-transform"
            draggable={false}
          />

          {/* Interactive Scientific Radar Analysis Overlays */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none select-none" viewBox="0 0 900 600" preserveAspectRatio="none">
            <defs>
              <pattern id="radarGridMeshSmooth" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(6,182,212,0.12)" strokeWidth="0.8" />
              </pattern>
            </defs>

            {/* Scientific Geospatial Grid Coordinates */}
            <rect width="900" height="600" fill="url(#radarGridMeshSmooth)" />

            {/* Erosion Scarp Lines & Vector Arrows */}
            {(activeLayer === 'ALL' || activeLayer === 'EROSION_VECTORS') && (
              <g>
                {/* Active Erosion Scarp Line Along West Bank */}
                <path
                  d="M 230,20 C 310,140 280,260 360,390 C 410,470 380,530 450,580"
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="3.5"
                  strokeDasharray="8 5"
                />

                {/* Lateral Bank Retreat Vectors */}
                <g stroke="#f43f5e" strokeWidth="2.2" opacity="0.95">
                  <line x1="290" y1="180" x2="245" y2="180" />
                  <line x1="330" y1="320" x2="280" y2="325" />
                  <line x1="410" y1="480" x2="360" y2="490" />
                </g>

                {/* Hotspot Alert Labels */}
                <g fill="#f43f5e" fontFamily="monospace" fontSize="10" fontWeight="bold">
                  <text x="215" y="172">SHIFT: -340m</text>
                  <text x="250" y="315">RATE: 4.8m/DAY</text>
                  <text x="325" y="475">SLIP RISK: 94%</text>
                </g>
              </g>
            )}

            {/* Emerging Sandbar Char Island Identification */}
            {(activeLayer === 'ALL') && (
              <g>
                {/* Char Island CW-0241 Contour */}
                <ellipse
                  cx="540"
                  cy="290"
                  rx="95"
                  ry="52"
                  fill="rgba(245, 158, 11, 0.22)"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeDasharray="6 3"
                />
                <circle cx="540" cy="290" r="3" fill="#f59e0b" />
                <text x="475" y="278" fill="#fde68a" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  CHAR CW-0241 (ACCRETING)
                </text>
                <text x="475" y="294" fill="#cbd5e1" fontSize="9" fontFamily="monospace">
                  AREA: +6.42 km² · 82% BIOMASS
                </text>

                {/* Silt Shoal CW-0242 */}
                <ellipse
                  cx="380"
                  cy="440"
                  rx="65"
                  ry="36"
                  fill="rgba(16, 185, 129, 0.2)"
                  stroke="#10b981"
                  strokeWidth="1.8"
                />
                <text x="330" y="442" fill="#a7f3d0" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  CHAR CW-0242 · NEW SILT
                </text>
              </g>
            )}

            {/* Dielectric Soil Moisture Gradient Tint */}
            {activeLayer === 'DIELECTRIC' && (
              <g style={{ opacity: 0.45, mixBlendMode: 'screen' }}>
                <rect width="900" height="600" fill="url(#radarGridMeshSmooth)" />
                <path
                  d="M 180,0 C 270,140 240,260 320,380 C 380,460 350,520 430,600 L 640,600 C 560,520 540,440 510,360 C 470,250 430,140 350,0 Z"
                  fill="#06b6d4"
                />
              </g>
            )}

            {/* Hardpoint Embankment Spurs (Corner Reflectors = High Backscatter Bright Points) */}
            {[
              [260, 140], [275, 190], [300, 270], [325, 330], [370, 420], [420, 500]
            ].map(([x, y], idx) => (
              <g key={idx}>
                <circle cx={x} cy={y} r="4.5" fill="#ffffff" stroke="#06b6d4" strokeWidth="2.5" />
                <circle cx={x} cy={y} r="8" fill="none" stroke="rgba(6,182,212,0.4)" strokeWidth="1" />
              </g>
            ))}
          </svg>

          {/* SAR Scientific HUD Badges */}
          <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-cyan-500/50 text-cyan-300 font-mono text-[10px] sm:text-xs shadow-xl pointer-events-none">
            <Radio className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 animate-pulse shrink-0" />
            <span className="font-bold">SAR MICROWAVE VIEW · 100% CLOUD PENETRATION</span>
          </div>

          <div className="absolute bottom-4 right-4 text-right font-mono text-[9px] sm:text-[11px] text-slate-300 bg-slate-950/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-800 shadow-2xl pointer-events-none">
            <div className="flex items-center justify-end gap-1.5 text-emerald-400 font-bold mb-0.5 sm:mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>RADAR PENETRATION: {radarPenetrationPct}%</span>
            </div>
            <span className="text-slate-400 block hidden xs:block">SENSORS: NISAR (L-BAND 24cm) + SENTINEL-1 (C-BAND 5.6cm)</span>
            <span className="text-cyan-400 block font-semibold">POLARIMETRY: DUAL-POL VV+VH</span>
          </div>
        </div>

        {/* =========================================================================
            LAYER 2: OPTICAL MONSOON CLOUD COVER (Top Layer - GPU clip-path)
            NO reflow, NO inner resizing, 100% pixel-perfect GPU clipped alignment!
           ========================================================================= */}
        <div
          className="absolute inset-0 select-none overflow-hidden pointer-events-none will-change-[clip-path]"
          style={{
            clipPath: `polygon(0% 0%, ${sliderPosition}% 0%, ${sliderPosition}% 100%, 0% 100%)`,
            WebkitClipPath: `polygon(0% 0%, ${sliderPosition}% 0%, ${sliderPosition}% 100%, 0% 100%)`,
          }}
        >
          {/* Authentic High-Resolution Optical Monsoon Satellite Imagery */}
          <img
            src="/images/optical_monsoon.jpg"
            alt="Authentic optical satellite monsoon cloud cover over Bangladesh"
            className="w-full h-full object-cover filter contrast-[1.05] pointer-events-none select-none"
            draggable={false}
          />

          {/* Realistic Atmospheric Monsoon Storm Vignette */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 via-transparent to-slate-900/50 pointer-events-none" />

          {/* Central Blindspot Warning Banner (visible when cloud side is open) */}
          {sliderPosition > 35 && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-3 sm:p-5 bg-slate-950/90 backdrop-blur-md rounded-2xl border border-rose-500/50 shadow-2xl max-w-[260px] sm:max-w-sm text-center mx-4 pointer-events-none">
              <Cloud className="w-8 h-8 sm:w-10 sm:h-10 text-rose-400 mx-auto mb-1.5 animate-bounce" />
              <span className="text-[10px] sm:text-xs font-mono text-rose-400 uppercase tracking-widest block font-bold">
                85% MONSOON CLOUD COVER DETECTED
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-300 font-sans block mt-1 leading-relaxed">
                Optical satellites (Landsat, Sentinel-2) blinded by torrential monsoon storms. Ground riverbanks obscured.
              </span>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[9px] sm:text-[10px] font-mono">
                <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
                <span>BLINDSPOT: 0.4–0.9 µm BLOCKED</span>
              </div>
            </div>
          )}

          {/* Optical Sensor HUD Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-700 text-slate-300 font-mono text-[10px] sm:text-xs shadow-xl pointer-events-none">
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 shrink-0" />
            <span className="font-bold">OPTICAL MULTISPECTRAL (BLINDED)</span>
          </div>

          <div className="absolute bottom-4 left-4 font-mono text-[9px] sm:text-[11px] text-slate-400 bg-slate-950/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-800 shadow-2xl pointer-events-none">
            <span className="text-rose-400 block font-bold">ATMOSPHERIC TRANSMISSION: 14%</span>
            <span className="hidden xs:block">VISIBLE & NIR SPECTRUM BLOCKED BY CONVECTIVE STORMS</span>
          </div>
        </div>

        {/* =========================================================================
            CENTER DIVIDER SLIDER LINE & ULTRA-TACTILE GLOWING DRAG HANDLE
           ========================================================================= */}
        <div
          className="absolute top-0 bottom-0 pointer-events-none will-change-[left] z-20"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
          {/* Laser Cut Dividing Line */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[3px] bg-gradient-to-b from-cyan-300 via-teal-200 to-cyan-400 shadow-[0_0_20px_rgba(6,182,212,1)]" />

          {/* Glowing Tactile Center Knob */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-950 border-2 border-cyan-400 text-cyan-300 flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.9)] transition-transform duration-75 ${
              isDragging ? 'scale-110 ring-4 ring-cyan-500/40 border-white text-white' : 'hover:scale-105'
            }`}
          >
            <div className="flex items-center gap-0.5 font-mono text-[11px] sm:text-[13px] font-extrabold tracking-tighter">
              <span className="text-cyan-400 font-bold">◀</span>
              <div className="w-0.5 h-3.5 bg-cyan-400/80 rounded-full mx-0.5" />
              <span className="text-cyan-400 font-bold">▶</span>
            </div>
          </div>

          {/* Floating Live Telemetry Depth Badge */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-slate-950/95 border border-cyan-400/80 text-cyan-300 font-mono text-[10px] whitespace-nowrap shadow-2xl backdrop-blur-md">
            <span className="font-bold">RADAR PENETRATION: {radarPenetrationPct}%</span>
          </div>

          {/* Bottom Coordinate Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-slate-950/90 border border-slate-700 text-slate-300 font-mono text-[9px] whitespace-nowrap shadow-xl">
            <span>TRANSECT: 89.65°E</span>
          </div>
        </div>
      </div>

      {/* Scrub Slider Track For Ultra-Precision Dragging */}
      <div className="mt-4 px-2 flex items-center gap-3">
        <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">OPTICAL (0%)</span>
        <div className="relative flex-1 flex items-center">
          <input
            type="range"
            min="0"
            max="100"
            step="0.5"
            value={sliderPosition}
            onChange={(e) => {
              setIsAutoScanning(false);
              setSliderPosition(parseFloat(e.target.value));
            }}
            aria-label="Fine radar scrub control"
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
          />
        </div>
        <span className="text-[10px] font-mono text-cyan-400 whitespace-nowrap">100% SAR RADAR</span>
      </div>

      {/* Comparison Explainer Cards Below Slider */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-8 text-xs font-mono">
        <div className="p-4 glass-panel rounded-2xl border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center gap-2 mb-2 text-slate-400">
            <Cloud className="w-4 h-4 text-slate-400" />
            <span className="font-bold text-[10px] tracking-wider uppercase">OPTICAL MULTISPECTRAL SENSOR</span>
          </div>
          <p className="text-slate-300 leading-relaxed font-sans text-xs">
            Wavelengths: <span className="font-mono text-cyan-300">0.4 – 0.9 µm</span>. Rayleigh and Mie atmospheric scattering by water droplets completely block optical satellites during torrential June–October monsoons, rendering bank collapse unseen.
          </p>
        </div>

        <div className="p-4 glass-panel-cyan rounded-2xl border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
          <div className="flex items-center gap-2 mb-2 text-cyan-400">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="font-bold text-[10px] tracking-wider uppercase">MICROWAVE SAR ADVANTAGE</span>
          </div>
          <p className="text-cyan-100 leading-relaxed font-sans text-xs">
            Wavelengths: <span className="font-mono text-cyan-300 font-bold">5.6 cm (C-band) & 24 cm (L-band)</span>. Microwaves pass directly through clouds, rain curtains, and nighttime to measure river channel morphodynamics at millimeter phase coherence.
          </p>
        </div>

        <div className="p-4 glass-panel rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all">
          <div className="flex items-center gap-2 mb-2 text-emerald-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-[10px] tracking-wider uppercase">COMMUNITY RISK EARLY WARNING</span>
          </div>
          <p className="text-slate-300 leading-relaxed font-sans text-xs">
            CharWatch computes automated radar interferometry (InSAR) and backscatter differentials across consecutive satellite passes, providing up to <span className="font-mono text-emerald-300 font-bold">72 hours advance warning</span> to vulnerable chars.
          </p>
        </div>
      </div>
    </section>
  );
};
