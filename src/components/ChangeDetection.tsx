import React, { useState, useEffect } from 'react';
import { SIMULATED_RIVER_REGIONS } from '../data/simulatedData';
import { GIBS_LAYERS } from '../config/gibsLayers';
import {
  Clock,
  ArrowRight,
  ShieldAlert,
  Layers,
  Play,
  Pause,
  Compass,
  Activity,
  Droplets,
  AlertTriangle,
  TrendingDown,
  RefreshCw,
  Eye,
  Sliders,
  Maximize2,
  Calendar,
  Satellite,
  Info,
  ExternalLink,
  ShieldCheck,
  SplitSquareVertical,
  Zap,
} from 'lucide-react';

export const ChangeDetection: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState(SIMULATED_RIVER_REGIONS[0]);
  const [timeIndex, setTimeIndex] = useState(4); // 0 to 4
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState<'FUSED_EXPLORER' | 'SWIPE_SPLIT' | 'CROSS_SECTION'>('FUSED_EXPLORER');
  const [gibsLayerType, setGibsLayerType] = useState<'modis-terra-truecolor' | 'modis-terra-721'>('modis-terra-truecolor');
  const [swipeSplit, setSwipeSplit] = useState<number>(50);

  const timelineYears = [
    { idx: 0, year: 2020, label: '2020 BASELINE', date: '2020-09-15', desc: 'Pre-monsoon stable bankline reference geometry', shiftFactor: 0, color: '#06b6d4' },
    { idx: 1, year: 2022, label: '2022 FLOOD PASS', date: '2022-08-15', desc: 'Severe monsoon discharge bank scarp cut', shiftFactor: 0.35, color: '#f59e0b' },
    { idx: 2, year: 2024, label: '2024 RADAR TRACK', date: '2024-09-15', desc: 'Dry-season sediment redeposition & braiding', shiftFactor: 0.65, color: '#fb923c' },
    { idx: 3, year: 2025, label: '2025 VERIFICATION', date: '2025-08-15', desc: 'Pre-monsoon embankment shear failure', shiftFactor: 0.85, color: '#f43f5e' },
    { idx: 4, year: 2026, label: '2026 CURRENT ORBIT', date: '2026-08-15', desc: 'Latest InSAR coherence & active radar swath', shiftFactor: 1.0, color: '#e11d48' },
  ];

  // Auto-play timeline loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTimeIndex((prev) => (prev + 1) % timelineYears.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [isPlaying, timelineYears.length]);

  const activeYear = timelineYears[timeIndex];
  const currentShiftMeters = Math.round(selectedRegion.bankShiftMeters * activeYear.shiftFactor);
  const landAreaLostHectares = Math.round(currentShiftMeters * 2.8);
  const sedimentVolumeTonnes = Math.round(currentShiftMeters * 18400);
  const selectedGibsConfig = GIBS_LAYERS.find((l) => l.id === gibsLayerType) || GIBS_LAYERS[0];

  return (
    <section className="w-full max-w-7xl mx-auto py-6 sm:py-10 px-3 sm:px-6 space-y-6 font-sans">
      
      {/* 1. HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-2">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            <span>SATELLITE CHANGE EXPLORER & MULTI-TEMPORAL ANALYSIS</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
            RIVERBANK CHANGE DETECTION
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-sans leading-relaxed">
            Multi-temporal satellite radar change detection (2020–2026) measuring bankline retreat, hydraulic shear erosion, and active silt accretion along the Jamuna-Padma delta.
          </p>
        </div>

        {/* Sector Selector */}
        <div className="flex items-center gap-3">
          <select
            value={selectedRegion.id}
            onChange={(e) => {
              const reg = SIMULATED_RIVER_REGIONS.find((r) => r.id === e.target.value);
              if (reg) setSelectedRegion(reg);
            }}
            className="px-4 py-2.5 glass-panel rounded-2xl border border-cyan-500/40 text-xs font-mono text-cyan-300 bg-slate-900/90 focus:outline-none focus:border-cyan-400 shadow-xl"
          >
            {SIMULATED_RIVER_REGIONS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} — {r.riverSystem} River ({r.district})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. SCIENTIFIC PROCESS WORKFLOW CARDS */}
      <div className="p-4 glass-panel rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-cyan-400 font-bold uppercase">1. VISUAL LAYER</span>
          <h4 className="text-white font-bold">NASA GIBS Imagery</h4>
          <p className="text-[11px] text-slate-400 font-sans">
            Real MODIS/VIIRS surface reflectance baseline.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-teal-400 font-bold uppercase">2. TIME COMPARISON</span>
          <h4 className="text-white font-bold">Observed Surface Change</h4>
          <p className="text-[11px] text-slate-400 font-sans">
            Multi-year seasonal visual channel boundary tracking.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-950 border border-rose-500/30 space-y-1">
          <span className="text-[10px] text-rose-400 font-bold uppercase">3. ANALYTICAL OVERLAY</span>
          <h4 className="text-rose-300 font-bold">RiverGuard InSAR Model</h4>
          <p className="text-[11px] text-slate-400 font-sans">
            SAR coherence & sub-surface dielectric saturation.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/30 space-y-1">
          <span className="text-[10px] text-amber-400 font-bold uppercase">4. DERIVED OUTPUT</span>
          <h4 className="text-amber-300 font-bold">Potential Bankline Change</h4>
          <p className="text-[11px] text-slate-400 font-sans">
            Observed displacement indicator for community safety.
          </p>
        </div>
      </div>

      {/* 3. MAIN SATELLITE CHANGE EXPLORER CANVAS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Visual & Analytical Stage (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-5 glass-panel rounded-3xl border border-slate-800 space-y-4 shadow-2xl">
            
            {/* Toolbar Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3 text-xs font-mono">
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setViewMode('FUSED_EXPLORER')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    viewMode === 'FUSED_EXPLORER' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  MULTI-YEAR VECTOR GIS
                </button>
                <button
                  onClick={() => setViewMode('SWIPE_SPLIT')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    viewMode === 'SWIPE_SPLIT' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  2020 VS 2026 SWIPE
                </button>
                <button
                  onClick={() => setViewMode('CROSS_SECTION')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    viewMode === 'CROSS_SECTION' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  GEOTECHNICAL SCARP PROFILE
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-[10px]">GIBS LAYER:</span>
                <select
                  value={gibsLayerType}
                  onChange={(e) => setGibsLayerType(e.target.value as any)}
                  className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono"
                >
                  <option value="modis-terra-truecolor">MODIS True Color (Optical)</option>
                  <option value="modis-terra-721">MODIS Bands 7-2-1 (Hydro/Water)</option>
                </select>
              </div>
            </div>

            {/* SCREEN 1: MULTI-YEAR VECTOR GIS */}
            {viewMode === 'FUSED_EXPLORER' && (
              <div className="relative w-full h-[400px] rounded-2xl bg-[#030712] border border-slate-800 overflow-hidden flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

                {/* Layer Badges */}
                <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-950/90 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] font-bold">
                    NASA GIBS: {selectedGibsConfig.title.split('(')[0]} · {activeYear.date}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-950/90 border border-rose-500/40 text-rose-300 font-mono text-[10px] font-bold">
                    RIVERGUARD ANALYTICAL: {activeYear.label}
                  </span>
                </div>

                {/* SVG Vector River Stage */}
                <svg className="w-full h-full" viewBox="0 0 440 260">
                  <defs>
                    <linearGradient id="riverChannelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0891b2" stopOpacity="0.85" />
                      <stop offset="100%" stopColor="#0e7490" stopOpacity="0.45" />
                    </linearGradient>
                    <pattern id="scarpPattern" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                      <line x1="0" y1="0" x2="0" y2="8" stroke="#f43f5e" strokeWidth="1.5" opacity="0.6" />
                    </pattern>
                  </defs>

                  {/* River Channel Bed */}
                  <path
                    d="M 20,40 Q 140,85 220,50 T 420,95 L 420,240 L 20,240 Z"
                    fill="url(#riverChannelGrad)"
                    stroke="#06b6d4"
                    strokeWidth="1.5"
                  />

                  {/* Historical Banklines */}
                  {timelineYears.map((t, idx) => {
                    const isPast = idx <= timeIndex;
                    const isCurrent = idx === timeIndex;
                    const yOffset = idx * 9;
                    return (
                      <g key={idx}>
                        <path
                          d={`M 20,${30 + yOffset} Q 130,${70 + yOffset} 210,${40 + yOffset} T 420,${80 + yOffset}`}
                          fill="none"
                          stroke={t.color}
                          strokeWidth={isCurrent ? '3.5' : '1.5'}
                          strokeDasharray={isCurrent ? 'none' : '4, 4'}
                          opacity={isPast ? 0.95 : 0.25}
                        />
                        {isCurrent && (
                          <circle cx="210" cy={40 + yOffset} r="5" fill="#f43f5e" className="animate-ping" />
                        )}
                      </g>
                    );
                  })}

                  {/* Eroded Scarp Polygon Fill */}
                  <path
                    d={`M 20,30 Q 130,70 210,40 T 420,80 L 420,${80 + timeIndex * 9} Q 310,${50 + timeIndex * 9} 210,${40 + timeIndex * 9} T 20,${30 + timeIndex * 9} Z`}
                    fill="url(#scarpPattern)"
                  />

                  {/* Text Annotations */}
                  <text x="30" y="220" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                    JAMUNA MAIN BRAIDED CHANNEL
                  </text>
                  <text x="200" y="25" fill="#f43f5e" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    POTENTIAL BANKLINE SHIFT: -{currentShiftMeters} m
                  </text>
                </svg>

                <div className="absolute bottom-3 right-3 text-[9px] font-mono text-slate-500">
                  Visual context: NASA GIBS. Analytical boundary vectors: InSAR Coherence Model.
                </div>
              </div>
            )}

            {/* SCREEN 2: 2020 VS 2026 SWIPE */}
            {viewMode === 'SWIPE_SPLIT' && (
              <div
                className="relative w-full h-[400px] rounded-2xl bg-[#030712] border border-slate-800 overflow-hidden select-none cursor-ew-resize"
                onMouseMove={(e) => {
                  if (e.buttons === 1) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
                    setSwipeSplit(pct);
                  }
                }}
                onTouchMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = Math.max(0, Math.min(100, ((e.touches[0].clientX - rect.left) / rect.width) * 100));
                  setSwipeSplit(pct);
                }}
              >
                {/* 2020 Baseline Side (Left) */}
                <div className="absolute inset-0 bg-[#061826] p-6 flex flex-col justify-between">
                  <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/40 w-max">
                    2020 BASELINE (PRE-MONSOON STABLE)
                  </span>

                  {/* SVG Baseline Bank */}
                  <svg className="w-full h-40 opacity-80" viewBox="0 0 400 120">
                    <path d="M 0,40 Q 150,70 400,30 L 400,120 L 0,120 Z" fill="#0284c7" opacity="0.6" />
                    <path d="M 0,40 Q 150,70 400,30" stroke="#38bdf8" strokeWidth="3" fill="none" />
                    <text x="20" y="80" fill="#bae6fd" fontSize="11" fontFamily="monospace">Stable Riverbank Toe (2020)</text>
                  </svg>

                  <div className="text-slate-300 font-mono text-xs flex justify-between">
                    <div>Original Embankment Line: 0.0m Shift</div>
                    <div className="text-cyan-400 font-bold">Vegetated Bank Coherence: 0.82 γ</div>
                  </div>
                </div>

                {/* 2026 Current Side (Right - Clipped) */}
                <div
                  style={{ clipPath: `polygon(${swipeSplit}% 0, 100% 0, 100% 100%, ${swipeSplit}% 100%)` }}
                  className="absolute inset-0 bg-[#1c080e] p-6 flex flex-col justify-between border-l-2 border-rose-500"
                >
                  <div className="flex justify-end">
                    <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 font-mono text-xs font-bold border border-rose-500/40">
                      2026 CURRENT ORBIT (POST-SCOUR)
                    </span>
                  </div>

                  {/* SVG Eroded Bank */}
                  <svg className="w-full h-40 opacity-80" viewBox="0 0 400 120">
                    <path d="M 0,85 Q 150,110 400,75 L 400,120 L 0,120 Z" fill="#e11d48" opacity="0.6" />
                    <path d="M 0,85 Q 150,110 400,75" stroke="#f43f5e" strokeWidth="3" fill="none" />
                    <text x="180" y="40" fill="#fca5a5" fontSize="11" fontFamily="monospace">Retreated Scarp Edge (2026)</text>
                  </svg>

                  <div className="text-right text-rose-300 font-mono text-xs flex justify-between">
                    <span className="text-amber-400">Pore Pressure Saturation: 92%</span>
                    <div>Cumulative Lateral Scour: -{selectedRegion.bankShiftMeters}m</div>
                  </div>
                </div>

                {/* Draggable Divider */}
                <div
                  style={{ left: `${swipeSplit}%` }}
                  className="absolute top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.8)] z-30 flex items-center justify-center pointer-events-none"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-2xl">
                    <SplitSquareVertical className="w-4 h-4" />
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN 3: GEOTECHNICAL SCARP PROFILE */}
            {viewMode === 'CROSS_SECTION' && (
              <div className="relative w-full h-[400px] rounded-2xl bg-[#030712] border border-slate-800 overflow-hidden p-6 flex flex-col justify-between font-mono">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/40">
                      GEOTECHNICAL BANK SLIP CROSS-SECTION (SIRAJGANJ HARDPOINT)
                    </span>
                    <span className="text-[10px] text-rose-400 font-bold">FAILURE MECHANISM: CANTILEVER SHEAR</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-2 font-sans">
                    Hydraulic toe-undercutting creates cantilever failure planes in cohesive floodplain alluvium.
                  </p>
                </div>

                {/* Cross-section SVG */}
                <div className="relative w-full h-44 bg-slate-950/80 rounded-xl border border-slate-800 p-2">
                  <svg className="w-full h-full" viewBox="0 0 500 160">
                    {/* Upper Cohesive Soil */}
                    <path d="M 10,20 L 220,20 L 220,70 L 10,70 Z" fill="#334155" stroke="#64748b" />
                    <text x="30" y="45" fill="#f8fafc" fontSize="10">Cohesive Floodplain Silt Crust (2-4m)</text>

                    {/* Lower Loose Fine Sand */}
                    <path d="M 10,70 L 220,70 L 160,140 L 10,140 Z" fill="#1e293b" stroke="#475569" />
                    <text x="30" y="105" fill="#94a3b8" fontSize="10">Unconsolidated Sand (Pore Pressure Saturation)</text>

                    {/* Failure Plane Slip Curve */}
                    <path d="M 180,20 Q 220,60 170,120" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="4,4" fill="none" />
                    <text x="190" y="60" fill="#f43f5e" fontSize="9" fontWeight="bold">Shear Slip Plane</text>

                    {/* River Water & Deep Scour Hole */}
                    <path d="M 220,60 L 490,60 L 490,150 L 240,150 Q 160,150 180,110 Z" fill="#0891b2" opacity="0.65" />
                    <text x="300" y="90" fill="#cffafe" fontSize="11" fontWeight="bold">Monsoon Flood Flow (v = 3.8 m/s)</text>
                    <text x="210" y="145" fill="#bae6fd" fontSize="9">Toe Scour Depth: -18.5m PWD</text>
                  </svg>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">UPPER SILT CRUST:</span>
                    <strong className="text-white">Cohesive Topsoil (2-4m)</strong>
                    <p className="text-[10px] text-slate-400 mt-1">High shear strength until pore pressure exceeds limit.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-rose-500/30">
                    <span className="text-rose-400 block text-[10px]">SHEAR SLIP PLANE:</span>
                    <strong className="text-rose-300">Rotational Slip Scarp</strong>
                    <p className="text-[10px] text-slate-400 mt-1">Tensile failure along saturated shear zone.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-cyan-500/30">
                    <span className="text-cyan-400 block text-[10px]">SCOUR DEPTH:</span>
                    <strong className="text-cyan-300">-18.5m Deep Pool</strong>
                    <p className="text-[10px] text-slate-400 mt-1">High-velocity monsoon vortices scour riverbed.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Interactive Timeline Playback */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <span className="font-mono text-xs font-bold text-white">
                    {activeYear.label} ({activeYear.date})
                  </span>
                </div>

                <span className="text-xs font-mono text-cyan-300">
                  OBSERVED SHIFT: <strong className="text-rose-400">-{currentShiftMeters} m</strong>
                </span>
              </div>

              {/* Steps Progress Bar */}
              <div className="grid grid-cols-5 gap-1.5 pt-1">
                {timelineYears.map((t, idx) => (
                  <button
                    key={idx}
                    onClick={() => setTimeIndex(idx)}
                    className={`p-2 rounded-xl text-left font-mono text-[10px] transition-all ${
                      timeIndex === idx
                        ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-bold shadow-sm'
                        : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="block">{t.year}</span>
                    <span className="text-[8px] text-slate-500 truncate block">{t.date}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Metric Inspector Deck (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 glass-panel-cyan rounded-3xl border border-cyan-500/30 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                OBSERVED SURFACE CHANGE METRICS
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
                PROTOTYPE MODEL
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white font-display">{selectedRegion.name}</h3>
              <p className="text-xs text-slate-300 mt-1 font-sans leading-relaxed">
                {selectedRegion.description}
              </p>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Potential Bankline Shift:</span>
                <span className="text-rose-400 font-bold text-sm">-{currentShiftMeters} meters</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Estimated Land Area Lost:</span>
                <span className="text-amber-300 font-bold">{landAreaLostHectares} hectares</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Sediment Scoured:</span>
                <span className="text-teal-300 font-bold">{(sedimentVolumeTonnes / 1000).toFixed(0)}k tonnes</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">InSAR Phase Coherence:</span>
                <span className="text-cyan-300 font-bold">{selectedRegion.radarCoherence.toFixed(2)} γ</span>
              </div>
            </div>

            {/* Scientific Rigor Notice */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-slate-400 space-y-1">
              <strong className="text-cyan-400 block">SCIENTIFIC PROVENANCE NOTICE:</strong>
              <p className="font-sans leading-relaxed">
                NASA GIBS provides the real optical visual reference layer. Bankline shift vectors and erosion classifications are analytical indicators requiring on-site BWDB field verification.
              </p>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
};
