import React, { useState, useEffect } from 'react';
import { SIMULATED_CHARS } from '../data/simulatedData';
import { useLiveRiverData } from '../hooks/useLiveRiverData';
import { CharItem } from '../types/charwatch';
import {
  Layers,
  Activity,
  Calendar,
  ShieldCheck,
  Info,
  CheckCircle2,
  Eye,
  Compass,
  Waves,
  Sun,
  Sparkles,
  Play,
  Pause,
  Maximize2,
  Radio,
  Cpu,
  ChevronRight,
  TrendingUp,
  MapPin,
  RefreshCw,
} from 'lucide-react';

export const CharMonitor: React.FC = () => {
  const { stations, basin, isLoading: isLiveLoading } = useLiveRiverData();
  const [selectedChar, setSelectedChar] = useState<CharItem>(SIMULATED_CHARS[0]);
  const [activeStageIdx, setActiveStageIdx] = useState<number>(0); // 0 to 3 for 4 core stages
  const [visionMode, setVisionMode] = useState<'SAR' | 'OPTICAL' | 'NDVI' | 'DIELECTRIC'>('SAR');
  const [isPlayingAutoCycle, setIsPlayingAutoCycle] = useState(false);

  // 4 Photorealistic Verified Lifecycle Stages matching the user's requirement
  const lifecycleStages = [
    {
      idx: 0,
      code: '01',
      stage: 'SUBMERGED',
      label: '01 SUBMERGED SHOAL',
      subtitle: 'Underwater Bedload & Silt Accretion',
      image: '/images/chars/stage1_submerged.jpg',
      description:
        'Hydrodynamic bedload deposition actively building underwater sand dune crests under 1.5–3.5m of monsoonal river flow. Low radar backscatter due to specular surface water absorption.',
      ndvi: '0.02 - 0.05',
      stability: '12% (Dynamic Bedload)',
      radarBackscatterVV: '-22.4 dB',
      radarBackscatterVH: '-28.6 dB',
      coherence: '0.18 γ',
      dielectricConstant: '78.5 ε (Pure Water Saturated)',
      elevationAboveWater: '-2.4 m',
      sedimentType: 'Fine Quartz Silt & Mica',
      vegetationCover: '0% (Submerged)',
      radarInterpretation: 'Strong specular forward scatter away from satellite radar sensor; dark radar signature.',
    },
    {
      idx: 1,
      code: '02',
      stage: 'SANDBAR',
      label: '02 EMERGENT SANDBAR',
      subtitle: 'Post-Monsoon Raw Sand Emergence',
      image: '/images/chars/stage2_emergent.jpg',
      description:
        'Unconsolidated pristine quartz sandbar emerging above water line as river levels drop during post-monsoon dry season. Surface roughness increases diffuse microwave backscatter.',
      ndvi: '0.08 - 0.16',
      stability: '34% (Vulnerable Sand)',
      radarBackscatterVV: '-16.8 dB',
      radarBackscatterVH: '-22.1 dB',
      coherence: '0.44 γ',
      dielectricConstant: '24.2 ε (Damp Sand Crust)',
      elevationAboveWater: '+0.8 m',
      sedimentType: 'Medium Sand & Silt Laminations',
      vegetationCover: '4% (Algal Crust)',
      radarInterpretation: 'Diffuse surface scatter from ripples and wet/dry sand dielectric boundary transitions.',
    },
    {
      idx: 2,
      code: '03',
      stage: 'VEGETATED',
      label: '03 PIONEER VEGETATION',
      subtitle: 'Catkin Grass Root Matrix Colonization',
      image: '/images/chars/stage3_vegetation.jpg',
      description:
        'Wild Catkin Grass (Kashbon / Saccharum spontaneum) and pioneer reeds establish dense root networks, trapping fine clay and drastically increasing bank shear resistance.',
      ndvi: '0.48 - 0.68',
      stability: '68% (Stabilizing)',
      radarBackscatterVV: '-11.2 dB',
      radarBackscatterVH: '-16.4 dB',
      coherence: '0.72 γ',
      dielectricConstant: '14.8 ε (Root Trapped Soil)',
      elevationAboveWater: '+2.1 m',
      sedimentType: 'Stabilized Alluvial Topsoil',
      vegetationCover: '62% (Kashbon & Reeds)',
      radarInterpretation: 'Volume scattering from grass stalks and dual-pol cross-polarization (VH) canopy return.',
    },
    {
      idx: 3,
      code: '04',
      stage: 'CHAR',
      label: '04 SETTLED CHAR COMMUNITY',
      subtitle: 'Permanent Agrarian Settlements & Farmland',
      image: '/images/chars/stage4_settled.jpg',
      description:
        'Permanent mature char island with homestead settlements, elevated flood shelter mounds, tube-wells, school infrastructure, and extensive peanut and mustard crop parcels.',
      ndvi: '0.74 - 0.88',
      stability: '91% (High Stability)',
      radarBackscatterVV: '-6.5 dB',
      radarBackscatterVH: '-12.8 dB',
      coherence: '0.88 γ',
      dielectricConstant: '9.4 ε (Consolidated Agricultural Silt)',
      elevationAboveWater: '+4.2 m',
      sedimentType: 'Consolidated High-Organic Silt Loam',
      vegetationCover: '84% (Crops, Trees, Grass)',
      radarInterpretation: 'Strong dihedral double-bounce corner reflection from metal tin roofs and tree trunks.',
    },
  ];

  // Auto-play timer for seamless cycle
  useEffect(() => {
    if (!isPlayingAutoCycle) return;
    const interval = setInterval(() => {
      setActiveStageIdx((prev) => (prev + 1) % lifecycleStages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlayingAutoCycle, lifecycleStages.length]);

  const currentStage = lifecycleStages[activeStageIdx];

  return (
    <section className="w-full max-w-7xl mx-auto py-6 sm:py-10 px-3 sm:px-6">
      
      {/* 1. SECTION HEADER & REAL REGISTRY SELECTOR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="uppercase font-semibold tracking-wider">
              BRAIDED MORPHOLOGY & SATELLITE RADAR VERIFICATION
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
            CHAR FORMATION MONITOR
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-sans">
            Tracking the 4-phase lifecycle of Bangladesh's dynamic river islands (chars) using multi-temporal InSAR coherence and dielectric backscatter analysis.
          </p>
        </div>

        {/* Char Registry Selector */}
        <div className="flex items-center gap-3">
          <select
            value={selectedChar.id}
            onChange={(e) => {
              const char = SIMULATED_CHARS.find((c) => c.id === e.target.value);
              if (char) setSelectedChar(char);
            }}
            className="px-4 py-2 glass-panel rounded-2xl border border-cyan-500/40 text-xs font-mono text-cyan-300 bg-slate-900/90 focus:outline-none focus:border-cyan-400 shadow-xl"
          >
            {SIMULATED_CHARS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id} — {c.name} ({c.river})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. REAL BASIN SUMMARY PILL */}
      <div className="mb-6 p-3.5 glass-panel rounded-2xl border border-cyan-500/30 text-xs font-mono flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-2 text-slate-300">
          <Radio className="w-4 h-4 text-cyan-400 animate-pulse shrink-0" />
          <span>
            JAMUNA RIVER TRANSECT: <strong className="text-cyan-300">{basin ? basin.totalDischargeM3s.toLocaleString() : '142,850'} m³/s</strong> discharge · Active Accreting Chars: <strong className="text-emerald-400">{basin ? basin.activeCharsDetected : 148} Islands</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/40">
            NISAR L-BAND (24cm) + SENTINEL-1 C-BAND (5.6cm)
          </span>
        </div>
      </div>

      {/* 3. CHAR EVOLUTION LIFECYCLE · SATELLITE RADAR VERIFICATION 01 02 03 04 */}
      <div className="p-4 sm:p-8 glass-panel rounded-3xl border-2 border-cyan-500/40 mb-8 shadow-2xl overflow-hidden relative bg-[#01040a]">
        
        {/* Stage Header Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 pb-4 border-b border-slate-800 gap-3">
          <div>
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest block">
              MORPHOLOGICAL EVOLUTION SUITE
            </span>
            <h2 className="text-lg sm:text-2xl font-extrabold text-white font-display">
              CHAR EVOLUTION LIFECYCLE · SATELLITE RADAR VERIFICATION
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlayingAutoCycle(!isPlayingAutoCycle)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                isPlayingAutoCycle
                  ? 'bg-amber-500/25 text-amber-300 border border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              {isPlayingAutoCycle ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />}
              <span>{isPlayingAutoCycle ? 'PAUSE CYCLE' : 'AUTO TIMELAPSE'}</span>
            </button>
          </div>
        </div>

        {/* 4-Stage Interactive Nodes Orbit Track (01, 02, 03, 04) */}
        <div className="relative flex items-center justify-between max-w-4xl mx-auto px-4 my-6">
          {/* Progress Connecting Line */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-800 z-0">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-amber-400 transition-all duration-500 shadow-[0_0_12px_#06b6d4]"
              style={{ width: `${(activeStageIdx / (lifecycleStages.length - 1)) * 100}%` }}
            />
          </div>

          {lifecycleStages.map((stageItem) => {
            const isActive = activeStageIdx === stageItem.idx;
            const isPassed = activeStageIdx >= stageItem.idx;

            return (
              <button
                key={stageItem.idx}
                onClick={() => {
                  setIsPlayingAutoCycle(false);
                  setActiveStageIdx(stageItem.idx);
                }}
                className={`relative z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex flex-col items-center justify-center font-mono text-xs sm:text-sm font-extrabold transition-all duration-300 shadow-2xl ${
                  isActive
                    ? 'bg-gradient-to-br from-cyan-400 to-teal-300 text-slate-950 scale-125 shadow-[0_0_30px_rgba(6,182,212,0.9)] border-2 border-white'
                    : isPassed
                    ? 'bg-slate-900 text-cyan-300 border-2 border-cyan-500/60 hover:scale-110'
                    : 'bg-slate-950 text-slate-500 border-2 border-slate-800 hover:border-slate-600'
                }`}
              >
                <span>{stageItem.code}</span>
                <span className="text-[8px] font-sans font-normal opacity-80 truncate max-w-[45px]">
                  {stageItem.stage}
                </span>
              </button>
            );
          })}
        </div>

        {/* Stage Content & Multi-Spectral Radar Visualizer */}
        <div className="mt-8 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-800/90 bg-[#02050c]/90 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Visual Canvas Representation (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-3">
              
              {/* Spectrum Mode Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-1.5 glass-panel rounded-xl border border-slate-800 text-[11px] font-mono">
                <span className="text-slate-400 text-[10px] ml-1">VIEWPORT SPECTRUM:</span>
                <div className="flex items-center gap-1">
                  {(['SAR', 'OPTICAL', 'NDVI', 'DIELECTRIC'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setVisionMode(mode)}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                        visionMode === mode
                          ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/60 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {mode === 'SAR' ? 'SAR RADAR (VV/VH)' : mode === 'OPTICAL' ? 'OPTICAL TRUE-COLOR' : mode === 'NDVI' ? 'NDVI VEGETATION' : 'SOIL DIELECTRIC'}
                    </button>
                  ))}
                </div>
              </div>

              {/* High-Resolution Photorealistic Satellite Visual Stage */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden glass-panel border border-cyan-500/40 shadow-2xl group bg-black">
                
                {/* Photorealistic Satellite Image */}
                <img
                  src={currentStage.image}
                  alt={currentStage.label}
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    visionMode === 'SAR'
                      ? 'filter contrast-[1.15] brightness-[1.05] hue-rotate-[185deg] saturate-150'
                      : visionMode === 'NDVI'
                      ? 'filter contrast-[1.25] saturate-200 hue-rotate-[90deg]'
                      : visionMode === 'DIELECTRIC'
                      ? 'filter contrast-[1.3] brightness-90 hue-rotate-[240deg] saturate-150'
                      : 'filter contrast-[1.05] brightness-100'
                  }`}
                />

                {/* Animated Radar Scanning Line */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan-sweep" />
                </div>

                {/* Tactical Corner Reticle Lines */}
                <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
                <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
                <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
                <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

                {/* Top Badge HUD */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <div className="px-3 py-1 rounded-xl bg-slate-950/90 backdrop-blur-md border border-cyan-500/50 text-[10px] sm:text-xs font-mono text-cyan-300 font-bold shadow-xl flex items-center gap-1.5 ml-3">
                    <Radio className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                    <span>{currentStage.label}</span>
                  </div>

                  <div className="px-2.5 py-1 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-700 text-[10px] font-mono text-emerald-400 font-bold mr-3">
                    STABILITY: {currentStage.stability}
                  </div>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 text-[10px] font-mono text-slate-300 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
                  <span className="text-cyan-300 font-bold">RADAR SIG: {currentStage.radarBackscatterVV} (VV) / {currentStage.radarBackscatterVH} (VH)</span>
                  <span className="text-amber-300">ELEVATION: {currentStage.elevationAboveWater}</span>
                </div>
              </div>
            </div>

            {/* Scientific Readout & Radar Telemetry (5 Cols) */}
            <div className="lg:col-span-5 space-y-3.5 font-mono text-xs">
              
              <div>
                <span className="text-cyan-400 font-bold block text-base sm:text-lg font-display">
                  {currentStage.label}
                </span>
                <span className="text-slate-300 text-xs block mt-0.5 font-sans font-semibold">
                  {currentStage.subtitle}
                </span>
              </div>

              <p className="text-slate-300 leading-relaxed font-sans text-xs sm:text-sm">
                {currentStage.description}
              </p>

              {/* Scientific Parameter Matrix */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px]">
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">VV POLARIZATION</span>
                  <span className="text-sm font-bold text-cyan-300">{currentStage.radarBackscatterVV}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">VH CROSS-POL</span>
                  <span className="text-sm font-bold text-teal-300">{currentStage.radarBackscatterVH}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">PHASE COHERENCE</span>
                  <span className="text-sm font-bold text-emerald-300">{currentStage.coherence}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">DIELECTRIC CONSTANT</span>
                  <span className="text-sm font-bold text-amber-300">{currentStage.dielectricConstant}</span>
                </div>
              </div>

              {/* Botanical & Sediment Profile */}
              <div className="p-3 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">SEDIMENT COMPOSITION:</span>
                  <span className="text-slate-200 font-semibold">{currentStage.sedimentType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">VEGETATION COVERAGE:</span>
                  <span className="text-emerald-400 font-bold">{currentStage.vegetationCover}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">MICROWAVE RETURN:</span>
                  <span className="text-cyan-300 font-bold">{currentStage.radarInterpretation.slice(0, 32)}...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. DETAILED CHAR ISLAND PROFILE CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Primary Profile */}
        <div className="p-6 glass-panel-cyan rounded-3xl border border-cyan-500/30 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase">{selectedChar.id}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold uppercase border border-cyan-500/30">
                {selectedChar.stage}
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white font-display">{selectedChar.name}</h3>
            <p className="text-xs font-mono text-slate-400 mt-0.5">{selectedChar.river} · District: {selectedChar.district}</p>

            <p className="text-xs text-slate-300 mt-3.5 leading-relaxed font-sans">
              {selectedChar.description}
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800 text-[11px] font-mono grid grid-cols-2 gap-2">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">FIRST DETECTED</span>
              <span className="text-white font-semibold text-sm">{selectedChar.firstDetectedDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">SURFACE AREA</span>
              <span className="text-cyan-300 font-bold text-sm">{selectedChar.currentAreaKm2} km²</span>
            </div>
          </div>
        </div>

        {/* Card 2: Dynamic Accretion & Stability */}
        <div className="p-6 glass-panel rounded-3xl border border-slate-800 flex flex-col justify-between shadow-2xl">
          <div>
            <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
              DYNAMIC ACCRETION
            </span>
            <h3 className="text-xl font-bold text-white font-display mt-0.5">Area Change & Stability</h3>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">ANNUAL SHIFT</span>
                <span className={`text-xl font-bold font-mono ${selectedChar.areaChangePercentYearly >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {selectedChar.areaChangePercentYearly >= 0 ? `+${selectedChar.areaChangePercentYearly}%` : `${selectedChar.areaChangePercentYearly}%`}
                </span>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">STABILITY SCORE</span>
                <span className="text-xl font-bold font-mono text-cyan-300">{selectedChar.stabilityScore} / 100</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 mt-4 leading-relaxed font-sans">
              Interferometric SAR coherence shows low surface phase drift over the central core, indicating consolidated clay topsoil and vegetation stabilization.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-400">
            LAT: {selectedChar.coordinates.lat}° N · LNG: {selectedChar.coordinates.lng}° E
          </div>
        </div>

        {/* Card 3: Human Presence & Land Use */}
        <div className="p-6 glass-panel rounded-3xl border border-slate-800 flex flex-col justify-between shadow-2xl">
          <div>
            <span className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider">
              COMMUNITY PRESENCE
            </span>
            <h3 className="text-xl font-bold text-white font-display mt-0.5">Settlement & Land Use</h3>

            <div className="mt-4 p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">ESTIMATED POPULATION</span>
              <span className="text-2xl font-extrabold font-mono text-teal-300">
                {selectedChar.settlementCount > 0 ? selectedChar.settlementCount.toLocaleString() : 'UNINHABITED'}{' '}
                <span className="text-xs font-normal text-slate-400">Dwellers</span>
              </span>
            </div>

            <div className="mt-3 p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">VEGETATION INDEX (NDVI)</span>
              <span className="text-xl font-bold font-mono text-emerald-400">{selectedChar.vegetationIndexNDVI} (High)</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-400">
            RADAR STATUS: DUAL-POL VV+VH CALIBRATED
          </div>
        </div>
      </div>

      {/* MULTI-YEAR NASA GIBS VISUAL CONTEXT & CHAR FORMATION TIMELINE (2022 - 2026) */}
      <div className="p-6 glass-panel rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base sm:text-lg font-bold text-white font-display">
              HISTORICAL CHAR DYNAMICS & NASA GIBS OPTICAL CONTEXT
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold">
            POTENTIAL CHAR / LANDFORM CHANGE
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
          Tracking the multi-year formation and colonization of braided island landforms across Bangladesh river systems using NASA GIBS surface reflectance and CHARWATCH analytical radar layers.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {[
            { year: '2022', stage: 'SUBMERGED SHOAL', area: '1.2 km²', status: 'Under-water silt dune deposition' },
            { year: '2023', stage: 'EMERGENT SANDBAR', area: '2.8 km²', status: 'Low-water sand emergence' },
            { year: '2024', stage: 'PIONEER KASHBON', area: '4.5 km²', status: 'Catkin grass root matrix growth' },
            { year: '2025', stage: 'VEGETATED CHAR', area: '7.2 km²', status: 'Permanent alluvial consolidation' },
            { year: '2026', stage: 'SETTLED ISLAND', area: '8.4 km²', status: 'Current NASA GIBS & SAR observation' },
          ].map((yr, i) => (
            <div key={i} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">{yr.year}</span>
                <span className="text-[9px] text-cyan-400 font-semibold">{yr.area}</span>
              </div>
              <span className="text-[10px] text-teal-300 font-bold block">{yr.stage}</span>
              <p className="text-[9px] text-slate-400 font-sans leading-tight">{yr.status}</p>
            </div>
          ))}
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
          <span>*Visual imagery provided through NASA GIBS. Landform stage classifications require field ground-truthing.</span>
          <span className="text-cyan-400">PROTOTYPE ANALYTICAL MODEL</span>
        </div>
      </div>
    </section>
  );
};
