import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { useLiveRiverData } from '../hooks/useLiveRiverData';
import { SIMULATED_RIVER_REGIONS } from '../data/simulatedData';
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
} from 'lucide-react';

const SECTOR_COORDINATES: { [key: string]: { lat: number; lng: number; zoom: number } } = {
  'REG-SRJ-01': { lat: 24.4539, lng: 89.7214, zoom: 12 },
  'REG-SRK-02': { lat: 24.8833, lng: 89.5667, zoom: 12 },
  'REG-BHD-03': { lat: 25.1833, lng: 89.7167, zoom: 12 },
  'REG-ARC-04': { lat: 23.7556, lng: 89.7889, zoom: 12 },
  'REG-CHP-05': { lat: 23.2321, lng: 90.6631, zoom: 12 },
};

export const ChangeDetection: React.FC = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyCeuvMJN64ZFTFVf-Vc9IXfkpFiGi3F5l8';
  const { stations, basin, isLoading: isLiveLoading, refresh } = useLiveRiverData();
  const [selectedRegion, setSelectedRegion] = useState(SIMULATED_RIVER_REGIONS[0]);
  const [timeIndex, setTimeIndex] = useState(4); // 0 to 4
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState<'MAP_SATELLITE' | 'INSAR_DEFORMATION' | 'SPLIT_COMPARISON'>('MAP_SATELLITE');
  const [splitPosition, setSplitPosition] = useState(50); // percentage for split slider

  const timelineYears = [
    { idx: 0, year: 2020, label: '2020 BASELINE', date: 'Oct 2020', desc: 'Pre-monsoon stable bankline reference', shiftFactor: 0 },
    { idx: 1, year: 2022, label: '2022 FLOOD PASS', date: 'Aug 2022', desc: 'Severe monsoon discharge bank scarp cut', shiftFactor: 0.35 },
    { idx: 2, year: 2024, label: '2024 RADAR TRACK', date: 'Nov 2024', desc: 'Dry-season sediment redeposition & braid', shiftFactor: 0.65 },
    { idx: 3, year: 2025, label: '2025 VERIFICATION', date: 'May 2025', desc: 'Pre-monsoon embankment shear failure', shiftFactor: 0.85 },
    { idx: 4, year: 2026, label: '2026 CURRENT ORBIT', date: 'Live Pass', desc: 'Latest NASA NISAR & Sentinel-1 InSAR coherence', shiftFactor: 1.0 },
  ];

  // Auto-play timeline loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTimeIndex((prev) => (prev + 1) % timelineYears.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isPlaying, timelineYears.length]);

  const activeYear = timelineYears[timeIndex];
  const currentShiftMeters = Math.round(selectedRegion.bankShiftMeters * activeYear.shiftFactor);
  const landAreaLostHectares = Math.round(currentShiftMeters * 2.8);
  const sedimentVolumeTonnes = Math.round(currentShiftMeters * 18400);

  const centerCoords = SECTOR_COORDINATES[selectedRegion.id] || { lat: selectedRegion.lat, lng: selectedRegion.lng, zoom: 11 };

  return (
    <section className="w-full max-w-7xl mx-auto py-6 sm:py-10 px-3 sm:px-6">
      
      {/* 1. HEADER WITH REAL-TIME TELEMETRY STATUS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="uppercase font-semibold tracking-wider">
              TEMPORAL INTERFEROMETRY & RIVERBANK RETREAT ANALYSIS
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
            RIVERBANK CHANGE DETECTION
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-sans">
            Multi-year satellite radar change detection (2020–2026) measuring bankline retreat, hydraulic shear erosion, and active silt accretion along the Jamuna-Padma delta.
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

      {/* 2. REAL-TIME CHANGE BANNER ALERT */}
      <div className="p-3.5 glass-panel-cyan rounded-2xl border border-rose-500/40 flex flex-wrap items-center justify-between gap-3 text-xs font-mono mb-6 shadow-xl">
        <div className="flex items-center gap-2 text-rose-400 font-bold">
          <ShieldAlert className="w-4 h-4 animate-pulse shrink-0" />
          <span>MEASURED BANKLINE RETREAT: {selectedRegion.name.toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-300">
            TIMEFRAME: <strong className="text-cyan-300">{activeYear.label}</strong> ({activeYear.date})
          </span>
          <span className="text-rose-400 font-bold">
            EROSION SHIFT: {currentShiftMeters} METERS
          </span>
        </div>
      </div>

      {/* 3. MAIN INTERACTIVE MAP & COMPARISON STAGE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {/* Left Map Viewport (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          
          {/* Viewport Control Bar */}
          <div className="p-3 glass-panel rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            
            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewMode('MAP_SATELLITE')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  viewMode === 'MAP_SATELLITE'
                    ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/60 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                REAL SATELLITE MAP
              </button>
              <button
                onClick={() => setViewMode('INSAR_DEFORMATION')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  viewMode === 'INSAR_DEFORMATION'
                    ? 'bg-rose-500/25 text-rose-300 border border-rose-400/60 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                INSAR DEFORMATION
              </button>
            </div>

            {/* Auto Play / Pause Timeline */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold transition-all ${
                  isPlaying
                    ? 'bg-amber-500/25 text-amber-300 border border-amber-500/60'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />}
                <span>{isPlaying ? 'PAUSE TIMELAPSE' : 'PLAY TIMELAPSE'}</span>
              </button>
            </div>
          </div>

          {/* SATELLITE MAP CANVAS CONTAINER */}
          <div className="relative w-full h-[360px] xs:h-[440px] sm:h-[540px] rounded-2xl sm:rounded-3xl overflow-hidden glass-panel border-2 border-cyan-500/40 shadow-2xl bg-[#01040a]">
            
            {viewMode === 'MAP_SATELLITE' ? (
              <APIProvider apiKey={apiKey}>
                <Map
                  id="change-detection-map"
                  mapId="DEMO_MAP_ID"
                  defaultCenter={{ lat: centerCoords.lat, lng: centerCoords.lng }}
                  center={{ lat: centerCoords.lat, lng: centerCoords.lng }}
                  defaultZoom={centerCoords.zoom}
                  zoom={centerCoords.zoom}
                  mapTypeId="hybrid"
                  gestureHandling="greedy"
                  className="w-full h-full"
                  internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                >
                  {/* Erosion Hotspot Marker */}
                  <AdvancedMarker position={{ lat: selectedRegion.lat, lng: selectedRegion.lng }}>
                    <div className="cursor-pointer transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                      <div className="px-3 py-1 rounded-xl bg-rose-950/90 text-rose-300 border border-rose-500 text-xs font-mono font-bold flex items-center gap-1.5 shadow-2xl animate-pulse">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span>BANK RETREAT: -{currentShiftMeters}m</span>
                      </div>
                      <div className="w-2.5 h-2.5 bg-rose-500 rotate-45 -mt-1" />
                    </div>
                  </AdvancedMarker>
                </Map>
              </APIProvider>
            ) : (
              /* InSAR Multi-Temporal Vector Simulation Mode */
              <div className="w-full h-full p-4 flex items-center justify-center bg-[#02050e]">
                <svg className="w-full h-full" viewBox="0 0 400 220" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <linearGradient id="insarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(244, 63, 94, 0.6)" />
                      <stop offset="50%" stopColor="rgba(245, 158, 11, 0.4)" />
                      <stop offset="100%" stopColor="rgba(6, 182, 212, 0.15)" />
                    </linearGradient>
                  </defs>

                  {/* River Channel Flow */}
                  <path
                    d="M 0,40 Q 150,60 250,90 T 400,140 L 400,220 L 0,220 Z"
                    fill="#0369a1"
                    opacity="0.75"
                  />

                  {/* 2020 Baseline Bankline (Cyan Dashed Line) */}
                  <path
                    d="M 0,40 Q 150,60 250,90 T 400,140"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />

                  {/* Current Active Eroded Scarp Path (Red Shift Line) */}
                  <path
                    d={`M 0,${40 + currentShiftMeters * 0.08} Q 150,${60 + currentShiftMeters * 0.12} 250,${90 + currentShiftMeters * 0.1} T 400,${140 + currentShiftMeters * 0.06}`}
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="3.2"
                    className="transition-all duration-700 ease-out"
                  />

                  {/* Inundated / Sunk Land Mass Shading */}
                  <path
                    d={`M 0,40 Q 150,60 250,90 T 400,140 L 400,${140 + currentShiftMeters * 0.06} Q 250,${90 + currentShiftMeters * 0.1} 150,${60 + currentShiftMeters * 0.12} L 0,${40 + currentShiftMeters * 0.08} Z`}
                    fill="url(#insarGrad)"
                  />

                  {/* Vector Displacement Arrows */}
                  {timeIndex > 0 && (
                    <g stroke="#f59e0b" strokeWidth="1.5">
                      <line x1="120" y1="55" x2="120" y2={55 + currentShiftMeters * 0.1} />
                      <line x1="220" y1="80" x2="220" y2={80 + currentShiftMeters * 0.1} />
                      <circle cx="120" cy={55 + currentShiftMeters * 0.1} r="2.5" fill="#f43f5e" />
                      <circle cx="220" cy={80 + currentShiftMeters * 0.1} r="2.5" fill="#f43f5e" />
                    </g>
                  )}
                </svg>
              </div>
            )}

            {/* Top Overlay Badge */}
            <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-cyan-500/50 text-[10px] font-mono text-cyan-300 flex items-center gap-2 pointer-events-none shadow-xl">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>TRANSECT: {selectedRegion.name} · {activeYear.label}</span>
            </div>

            {/* Bottom Timeline Quick Slider Bar */}
            <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-slate-800 flex flex-col gap-2 shadow-2xl">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">SELECT SATELLITE PASS:</span>
                <span className="text-cyan-300 font-bold">{activeYear.label} ({activeYear.date})</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {timelineYears.map((yr) => (
                  <button
                    key={yr.idx}
                    onClick={() => {
                      setIsPlaying(false);
                      setTimeIndex(yr.idx);
                    }}
                    className={`py-1.5 rounded-xl text-[10px] font-mono font-bold transition-all text-center ${
                      timeIndex === yr.idx
                        ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 shadow-[0_0_12px_#06b6d4]'
                        : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {yr.year}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Telemetry & Impact Stats (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Erosion Loss Metrics Card */}
          <div className="p-5 glass-panel-cyan rounded-3xl border border-cyan-500/40 shadow-2xl">
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-1">
              GEOMORPHIC IMPACT ESTIMATE
            </span>
            <h3 className="text-lg font-bold text-white font-display mb-3">
              Cumulative Shift Metrics
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">NET BANK RETREAT:</span>
                <span className="text-base font-bold text-rose-400">-{currentShiftMeters} m</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">ALLUVIAL LAND LOST:</span>
                <span className="text-base font-bold text-amber-300">{landAreaLostHectares} Hectares</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">SEDIMENT INGESTION:</span>
                <span className="text-base font-bold text-cyan-300">{sedimentVolumeTonnes.toLocaleString()} Tons</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">INSAR COHERENCE LOSS:</span>
                <span className="text-base font-bold text-teal-300">{((1 - activeYear.shiftFactor * 0.6) * 100).toFixed(0)}% Stable</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 font-sans mt-4 leading-relaxed">
              {activeYear.desc}. Hydraulic shear stress from monsoonal discharge causes cantilevered bank collapse.
            </p>
          </div>

          {/* Real-time Basin Hydrology Integration */}
          <div className="p-4 glass-panel rounded-3xl border border-slate-800 space-y-2.5 font-mono text-xs">
            <div className="flex items-center justify-between text-cyan-400 font-bold">
              <span>LIVE BASIN STREAM</span>
              <Activity className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">JAMUNA DISCHARGE:</span>
              <span className="text-cyan-300 font-bold">{basin ? basin.totalDischargeM3s.toLocaleString() : '142,850'} m³/s</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">CLOUD COVER:</span>
              <span className="text-amber-300 font-bold">{basin ? basin.averageCloudCoverPct : 58}% (SAR Penetrating)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
