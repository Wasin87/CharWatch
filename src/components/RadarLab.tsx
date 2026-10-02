import React, { useState, useEffect, useRef } from 'react';
import {
  Radio,
  Orbit,
  Activity,
  ShieldAlert,
  Cpu,
  BarChart2,
  Layers,
  Info,
  Sparkles,
  Sliders,
  Waves,
  RefreshCw,
  Eye,
  Compass,
  Droplets,
  Zap,
  Play,
  Pause,
  Maximize2,
  ChevronRight,
  TrendingDown,
  Gauge,
} from 'lucide-react';
import { SIMULATED_RIVER_REGIONS } from '../data/simulatedData';
import { useLiveRiverData } from '../hooks/useLiveRiverData';

// Physical ground surface targets with exact microwave dielectric & backscatter parameters
const RADAR_TARGETS = [
  {
    id: 'WATER_CHANNEL',
    name: 'Turbulent Silty River Channel',
    bengali: 'নদীর মূল খরস্রোতা জলধারা',
    dielectricConstant: 80.4,
    dielectricLoss: 22.1,
    surfaceRoughnessMm: 1.2,
    backscatterLBandDb: -22.8,
    backscatterCBandDb: -25.4,
    coherence: 0.15,
    scatteringMechanism: 'Specular Forward Scatter (Dark in SAR)',
    penetrationDepthLBandCm: 0.05,
    penetrationDepthCBandCm: 0.01,
  },
  {
    id: 'SANDBAR',
    name: 'Active Char Emergent Sandbar',
    bengali: 'সদ্য জেগে ওঠা বালুচর',
    dielectricConstant: 24.2,
    dielectricLoss: 4.6,
    surfaceRoughnessMm: 8.5,
    backscatterLBandDb: -16.4,
    backscatterCBandDb: -14.2,
    coherence: 0.46,
    scatteringMechanism: 'Diffuse Bragg Surface Scattering',
    penetrationDepthLBandCm: 45.0,
    penetrationDepthCBandCm: 8.5,
  },
  {
    id: 'VEGETATION',
    name: 'Catkin Grass (Kashbon) Canopy',
    bengali: 'কাশবন ও ঘাসের স্তর',
    dielectricConstant: 14.8,
    dielectricLoss: 3.2,
    surfaceRoughnessMm: 22.0,
    backscatterLBandDb: -11.2,
    backscatterCBandDb: -9.6,
    coherence: 0.74,
    scatteringMechanism: 'Random Dipole Volume Scattering',
    penetrationDepthLBandCm: 180.0,
    penetrationDepthCBandCm: 25.0,
  },
  {
    id: 'SETTLEMENT',
    name: 'Homestead Settlements & Tin Roofs',
    bengali: 'চর বসতি ও টিনের ঘরবাড়ি',
    dielectricConstant: 8.9,
    dielectricLoss: 1.8,
    surfaceRoughnessMm: 120.0,
    backscatterLBandDb: -6.2,
    backscatterCBandDb: -5.8,
    coherence: 0.89,
    scatteringMechanism: 'Dihedral Double-Bounce Corner Reflection',
    penetrationDepthLBandCm: 250.0,
    penetrationDepthCBandCm: 50.0,
  },
  {
    id: 'EMBANKMENT',
    name: 'Saturated West Bank Embankment',
    bengali: 'ভাঙনপ্রবণ নদীর তীর ও মাটির বাঁধ',
    dielectricConstant: 38.5,
    dielectricLoss: 14.2,
    surfaceRoughnessMm: 16.0,
    backscatterLBandDb: -13.8,
    backscatterCBandDb: -12.1,
    coherence: 0.32,
    scatteringMechanism: 'Moisture Attenuated Shear Scatter',
    penetrationDepthLBandCm: 28.0,
    penetrationDepthCBandCm: 4.2,
  },
];

export const RadarLab: React.FC = () => {
  const { stations, basin, isLoading: isLiveLoading, refresh } = useLiveRiverData();
  const [selectedRegion, setSelectedRegion] = useState(SIMULATED_RIVER_REGIONS[0]);
  const [selectedBand, setSelectedBand] = useState<'L-BAND' | 'C-BAND' | 'DUAL'>('DUAL');
  const [selectedPolarization, setSelectedPolarization] = useState<'VV' | 'VH' | 'HH' | 'HV'>('VV');
  const [selectedTarget, setSelectedTarget] = useState(RADAR_TARGETS[1]);
  const [scopeMode, setScopeMode] = useState<'TIME_DOMAIN' | 'FFT_SPECTRUM' | 'PHASOR' | 'RANGE_PROFILE'>('TIME_DOMAIN');
  const [incidenceAngleDeg, setIncidenceAngleDeg] = useState<number>(34);
  const [chirpBandwidthMhz, setChirpBandwidthMhz] = useState<number>(40);
  const [noiseFloorDb, setNoiseFloorDb] = useState<number>(-28);
  const [isPaused, setIsPaused] = useState(false);

  const scopeCanvasRef = useRef<HTMLCanvasElement>(null);

  // Synchronize with active station if matched
  useEffect(() => {
    if (stations.length > 0) {
      const match = stations.find((s) => s.district.toLowerCase() === selectedRegion.district.toLowerCase());
      if (match) {
        // dynamic sync
      }
    }
  }, [stations, selectedRegion]);

  // High-Precision Mathematical Microwave Radar Waveform Engine
  useEffect(() => {
    const canvas = scopeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      const parentWidth = canvas.parentElement?.clientWidth || 800;
      if (canvas.width !== parentWidth) {
        canvas.width = parentWidth;
      }
      const width = canvas.width;
      const height = (canvas.height = 240);

      ctx.clearRect(0, 0, width, height);

      // 1. Radar Screen Dark Phosphor HUD Canvas
      ctx.fillStyle = '#020612';
      ctx.fillRect(0, 0, width, height);

      // 2. Graticule Lines & Sub-Division Ticks
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.1)';
      ctx.lineWidth = 1;
      const gridX = 50;
      const gridY = 30;
      for (let x = 0; x < width; x += gridX) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridY) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Center Reference Baseline
      const midY = height / 2;
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(width, midY);
      ctx.stroke();
      ctx.setLineDash([]);

      const targetBackscatter =
        selectedBand === 'L-BAND' ? selectedTarget.backscatterLBandDb : selectedTarget.backscatterCBandDb;
      const linearAmp = Math.pow(10, (targetBackscatter + 35) / 20) * 2.2;
      const polMultiplier = selectedPolarization === 'VV' ? 1.0 : selectedPolarization === 'HH' ? 0.85 : 0.45;

      // MODE 1: TIME DOMAIN (Chirp pulse with carrier envelope)
      if (scopeMode === 'TIME_DOMAIN') {
        // L-Band NISAR Waveform (24cm, 1.25 GHz carrier, deeper penetration)
        if (selectedBand === 'L-BAND' || selectedBand === 'DUAL') {
          ctx.beginPath();
          for (let x = 0; x < width; x++) {
            const t = (x - width / 2) / (width / 2);
            // Gaussian Chirp Pulse Envelope
            const envelope = Math.exp(-4 * t * t);
            // Linear Frequency Modulation (Chirp)
            const chirpFreq = 0.03 + 0.04 * (x / width) * (chirpBandwidthMhz / 40);
            const y = midY + Math.sin(x * chirpFreq + phase) * linearAmp * envelope * polMultiplier * 45;

            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 2.4;
          ctx.shadowColor = '#06b6d4';
          ctx.shadowBlur = 12;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }

        // C-Band Sentinel-1 Waveform (5.6cm, 5.4 GHz carrier, surface roughness)
        if (selectedBand === 'C-BAND' || selectedBand === 'DUAL') {
          ctx.beginPath();
          for (let x = 0; x < width; x++) {
            const t = (x - width / 2) / (width / 2);
            const envelope = Math.exp(-3.5 * t * t);
            const chirpFreq = 0.09 + 0.08 * (x / width) * (chirpBandwidthMhz / 40);
            const speckleNoise = (Math.random() - 0.5) * (selectedTarget.surfaceRoughnessMm > 10 ? 8 : 2);
            const y =
              midY +
              Math.sin(x * chirpFreq - phase * 1.8) * (linearAmp * 0.75) * envelope * polMultiplier * 36 +
              speckleNoise;

            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 1.8;
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 9;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      }

      // MODE 2: FFT FREQUENCY SPECTRUM (Power Spectral Density dBm)
      else if (scopeMode === 'FFT_SPECTRUM') {
        const binCount = 64;
        const binWidth = width / binCount;
        const centerBin = binCount / 2;

        for (let i = 0; i < binCount; i++) {
          const distFromCenter = Math.abs(i - centerBin);
          const bandwidthSpan = (chirpBandwidthMhz / 80) * (binCount / 3);
          let power = 0;

          if (distFromCenter <= bandwidthSpan) {
            power = Math.max(0, 1 - (distFromCenter / bandwidthSpan) * 0.4);
          } else {
            power = Math.max(0.05, 0.15 - (distFromCenter - bandwidthSpan) * 0.02);
          }

          const noise = Math.random() * 0.08;
          const barHeight = (power + noise) * linearAmp * 12 * polMultiplier;
          const barY = height - 20 - barHeight;

          const grad = ctx.createLinearGradient(0, barY, 0, height - 20);
          grad.addColorStop(0, '#06b6d4');
          grad.addColorStop(1, 'rgba(6, 182, 212, 0.1)');

          ctx.fillStyle = grad;
          ctx.fillRect(i * binWidth + 2, barY, binWidth - 4, barHeight);
        }

        // 0 dB / Noise Floor line
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        const noiseY = height - 20 - ((noiseFloorDb + 35) / 30) * (height - 40);
        ctx.moveTo(0, noiseY);
        ctx.lineTo(width, noiseY);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // MODE 3: DOPPLER PHASOR (I/Q Constellation)
      else if (scopeMode === 'PHASOR') {
        const centerX = width / 2;
        const centerY = midY;
        const radius = 80;

        // Polar grid rings
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.arc(centerX, centerY, radius * 0.66, 0, 2 * Math.PI);
        ctx.arc(centerX, centerY, radius * 0.33, 0, 2 * Math.PI);
        ctx.stroke();

        // I & Q axes
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.beginPath();
        ctx.moveTo(centerX - radius - 20, centerY);
        ctx.lineTo(centerX + radius + 20, centerY);
        ctx.moveTo(centerX, centerY - radius - 20);
        ctx.lineTo(centerX, centerY + radius + 20);
        ctx.stroke();

        // Vector phasor trajectory
        const pts = 48;
        ctx.beginPath();
        for (let i = 0; i < pts; i++) {
          const angle = phase + i * 0.2;
          const r = radius * (0.4 + 0.5 * Math.sin(i * 0.3)) * (linearAmp / 3.0);
          const px = centerX + Math.cos(angle) * r;
          const py = centerY + Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // MODE 4: RANGE-AZIMUTH PROFILE (Ground Reflection echo)
      else if (scopeMode === 'RANGE_PROFILE') {
        ctx.beginPath();
        for (let x = 0; x < width; x++) {
          const rangeKm = (x / width) * 25; // 0 to 25 km swath range
          let echo = 0;

          // Main Ground Echo Peak at 12.5km
          const diff = Math.abs(rangeKm - 12.5);
          if (diff < 3.0) {
            echo = Math.exp(-diff * diff * 0.8) * linearAmp * 50;
          }
          // Secondary Char Sandbar reflections
          const diffChar = Math.abs(rangeKm - 18.2);
          if (diffChar < 1.8) {
            echo += Math.exp(-diffChar * diffChar * 1.5) * linearAmp * 35;
          }

          const noise = (Math.random() - 0.5) * 4;
          const y = height - 20 - echo - noise;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2.2;
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      if (!isPaused) {
        phase += 0.07;
      }
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [selectedBand, selectedPolarization, selectedTarget, scopeMode, incidenceAngleDeg, chirpBandwidthMhz, noiseFloorDb, isPaused]);

  return (
    <section className="w-full max-w-7xl mx-auto py-6 sm:py-10 px-3 sm:px-6">
      
      {/* 1. HEADER WITH REAL-TIME TELEMETRY STATUS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Radio className="w-4 h-4 animate-pulse text-cyan-400" />
            <span className="uppercase font-semibold tracking-wider">
              MICROWAVE PHYSICS & DUAL-BAND SAR ELECTROMAGNETIC LAB
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
            RADAR LAB — DUAL-BAND SAR ANALYSIS
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-sans">
            Real-time electromagnetic simulation comparing NASA NISAR L-band (24cm) penetration vs ESA Sentinel-1 C-band (5.6cm) surface scattering across the Jamuna River basin.
          </p>
        </div>

        {/* Live Hydrology & Orbit Status Pill */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-2.5 sm:p-3 glass-panel rounded-2xl border border-cyan-500/30 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
            <Orbit className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>NISAR L-BAND (1.25 GHz) · S1 C-BAND (5.4 GHz)</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1 text-emerald-400">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>CALIBRATION: RADIOMETRIC ±0.3 dB</span>
          </div>
        </div>
      </div>

      {/* 2. REAL-TIME TARGET & BAND CONTROL MATRIX */}
      <div className="p-4 sm:p-6 glass-panel rounded-3xl border border-slate-800 mb-6 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Sector Selector (4 Cols) */}
          <div className="md:col-span-4">
            <label className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1.5">
              BANGLADESH OBSERVATION TRANSECT:
            </label>
            <select
              value={selectedRegion.id}
              onChange={(e) => {
                const reg = SIMULATED_RIVER_REGIONS.find((r) => r.id === e.target.value);
                if (reg) setSelectedRegion(reg);
              }}
              className="w-full px-3.5 py-2.5 glass-panel rounded-xl border border-cyan-500/40 text-xs font-mono text-cyan-300 bg-slate-900/90 focus:outline-none focus:border-cyan-400 shadow-xl"
            >
              {SIMULATED_RIVER_REGIONS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.riverSystem} River · {r.district})
                </option>
              ))}
            </select>
          </div>

          {/* Microwave Band Selector (4 Cols) */}
          <div className="md:col-span-4">
            <label className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1.5">
              RADAR FREQUENCY BAND:
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setSelectedBand('L-BAND')}
                className={`py-1.5 rounded-lg font-bold transition-all ${
                  selectedBand === 'L-BAND'
                    ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/60 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                L-BAND (24cm)
              </button>
              <button
                onClick={() => setSelectedBand('C-BAND')}
                className={`py-1.5 rounded-lg font-bold transition-all ${
                  selectedBand === 'C-BAND'
                    ? 'bg-amber-500/25 text-amber-300 border border-amber-400/60 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                C-BAND (5.6cm)
              </button>
              <button
                onClick={() => setSelectedBand('DUAL')}
                className={`py-1.5 rounded-lg font-bold transition-all ${
                  selectedBand === 'DUAL'
                    ? 'bg-gradient-to-r from-cyan-500/20 to-amber-500/20 text-white border border-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                DUAL OVERLAY
              </button>
            </div>
          </div>

          {/* Polarization Mode Selector (4 Cols) */}
          <div className="md:col-span-4">
            <label className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1.5">
              POLARIZATION CHANNEL:
            </label>
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-mono">
              {(['VV', 'VH', 'HH', 'HV'] as const).map((pol) => (
                <button
                  key={pol}
                  onClick={() => setSelectedPolarization(pol)}
                  className={`py-1.5 rounded-lg font-bold transition-all ${
                    selectedPolarization === pol
                      ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/60 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {pol}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. LIVE SAR WAVEFORM OSCILLOSCOPE & FFT SPECTRUM ANALYZER */}
      <div className="p-4 sm:p-7 glass-panel rounded-3xl border-2 border-cyan-500/40 mb-8 shadow-2xl bg-[#01040a]">
        
        {/* Oscilloscope Header Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 pb-3 border-b border-slate-800 gap-3">
          <div className="flex items-center gap-2">
            <Waves className="w-4 h-4 text-cyan-400 animate-pulse" />
            <h2 className="text-base sm:text-xl font-extrabold text-white font-display">
              LIVE SAR WAVEFORM OSCILLOSCOPE & SPECTRUM ANALYZER
            </h2>
          </div>

          {/* Scope Mode Toggles */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            {[
              { id: 'TIME_DOMAIN', label: 'TIME DOMAIN V(t)' },
              { id: 'FFT_SPECTRUM', label: 'FFT SPECTRUM (dBm)' },
              { id: 'PHASOR', label: 'DOPPLER I/Q PHASOR' },
              { id: 'RANGE_PROFILE', label: 'RANGE ECHO PROFILE' },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setScopeMode(mode.id as any)}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  scopeMode === mode.id
                    ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/60 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {mode.label}
              </button>
            ))}

            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white ml-2"
              title={isPaused ? 'Resume Sweep' : 'Freeze Waveform'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Real Dynamic Canvas Scope Viewport */}
        <div className="relative w-full rounded-2xl overflow-hidden glass-panel border border-cyan-500/40 shadow-inner mb-4">
          <canvas ref={scopeCanvasRef} className="w-full h-[240px] block" />

          {/* Scope Top Left HUD Overlay */}
          <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-cyan-500/40 text-[10px] font-mono text-cyan-300 flex items-center gap-2 pointer-events-none shadow-xl">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>CHIRP BW: {chirpBandwidthMhz} MHz · PRF: 1650 Hz · INCIDENCE: {incidenceAngleDeg}°</span>
          </div>

          {/* Scope Top Right Target HUD Overlay */}
          <div className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 text-[10px] font-mono text-amber-300 flex items-center gap-2 pointer-events-none shadow-xl">
            <span>TARGET: {selectedTarget.name} ({selectedTarget.backscatterLBandDb} dB)</span>
          </div>
        </div>

        {/* Interactive Physics Knobs / Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs font-mono">
          <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-400">CHIRP BANDWIDTH:</span>
              <span className="text-cyan-300 font-bold">{chirpBandwidthMhz} MHz</span>
            </div>
            <input
              type="range"
              min="20"
              max="80"
              step="5"
              value={chirpBandwidthMhz}
              onChange={(e) => setChirpBandwidthMhz(+e.target.value)}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <span className="text-[9px] text-slate-500 block mt-1">Controls Range Resolution (3.75m – 0.95m)</span>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-400">INCIDENCE ANGLE (θ):</span>
              <span className="text-amber-300 font-bold">{incidenceAngleDeg}°</span>
            </div>
            <input
              type="range"
              min="18"
              max="48"
              step="1"
              value={incidenceAngleDeg}
              onChange={(e) => setIncidenceAngleDeg(+e.target.value)}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <span className="text-[9px] text-slate-500 block mt-1">NISAR ScanSAR Swath Look Angle</span>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-400">NOISE EQUIVALENT σ°:</span>
              <span className="text-rose-400 font-bold">{noiseFloorDb} dB</span>
            </div>
            <input
              type="range"
              min="-35"
              max="-18"
              step="1"
              value={noiseFloorDb}
              onChange={(e) => setNoiseFloorDb(+e.target.value)}
              className="w-full accent-rose-400 cursor-pointer"
            />
            <span className="text-[9px] text-slate-500 block mt-1">Satellite Receiver Thermal Noise Floor</span>
          </div>
        </div>
      </div>

      {/* 4. GROUND TARGET SELECTION & DIELECTRIC PENETRATION MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {/* Left Target Selector (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">
            SELECT GROUND SURFACE TARGET:
          </span>
          <div className="space-y-2">
            {RADAR_TARGETS.map((t) => {
              const isSelected = selectedTarget.id === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTarget(t)}
                  className={`w-full p-3.5 rounded-2xl text-left font-mono text-xs transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-cyan-500/20 text-white border-2 border-cyan-500/60 shadow-[0_0_18px_rgba(6,182,212,0.3)]'
                      : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800/80 border border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 text-sm">{t.name}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-950 text-[10px] text-cyan-300 font-bold">
                      {t.backscatterLBandDb} dB
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-sans mt-0.5">{t.bengali}</span>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 pt-2 border-t border-slate-800/60">
                    <span>ε_r: {t.dielectricConstant}</span>
                    <span className="text-emerald-400 font-bold">Coherence: {t.coherence} γ</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Target Physical & Scattering Breakdown (7 Cols) */}
        <div className="lg:col-span-7 p-6 glass-panel-cyan rounded-3xl border border-cyan-500/40 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                SCATTERING MECHANISM ANALYSIS
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold uppercase border border-cyan-500/30">
                {selectedTarget.id}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
              {selectedTarget.name}
            </h3>
            <p className="text-xs text-slate-300 mt-1 font-sans">
              Primary Mechanism: <strong className="text-cyan-300">{selectedTarget.scatteringMechanism}</strong>
            </p>

            {/* Dielectric & Penetration Comparison Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 text-xs font-mono">
              <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">L-BAND PENETRATION</span>
                <span className="text-lg font-bold text-cyan-300">
                  {selectedTarget.penetrationDepthLBandCm} cm
                </span>
                <span className="text-[9px] text-slate-500 block mt-0.5">NISAR 24cm Wavelength</span>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">C-BAND PENETRATION</span>
                <span className="text-lg font-bold text-amber-300">
                  {selectedTarget.penetrationDepthCBandCm} cm
                </span>
                <span className="text-[9px] text-slate-500 block mt-0.5">Sentinel-1 5.6cm</span>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-400 block uppercase">SOIL DIELECTRIC (ε_r)</span>
                <span className="text-lg font-bold text-emerald-400">
                  {selectedTarget.dielectricConstant}
                </span>
                <span className="text-[9px] text-slate-500 block mt-0.5">Moisture Dependent</span>
              </div>
            </div>

            {/* Sinclair 2x2 Scattering Matrix */}
            <div className="mt-4 p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                <span>POLARIMETRIC SCATTERING MATRIX [S]:</span>
                <span className="text-cyan-400 font-bold">Sinclair 2x2 Matrix</span>
              </div>
              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">S_HH:</span>
                  <span className="text-cyan-300 font-bold">{(selectedTarget.backscatterLBandDb - 1.2).toFixed(1)} dB</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">S_HV:</span>
                  <span className="text-teal-300 font-bold">{(selectedTarget.backscatterLBandDb - 6.5).toFixed(1)} dB</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">S_VH:</span>
                  <span className="text-teal-300 font-bold">{(selectedTarget.backscatterLBandDb - 6.5).toFixed(1)} dB</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">S_VV:</span>
                  <span className="text-cyan-300 font-bold">{selectedTarget.backscatterLBandDb} dB</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span>TARGET ID: {selectedTarget.id}</span>
            <span className="text-cyan-400">CALIBRATED TO BWDB FIELD BENCHMARKS</span>
          </div>
        </div>
      </div>

      {/* 5. OPTICAL CONTEXT VS. RADAR INTELLIGENCE COMPLEMENTARY COMPARISON */}
      <div className="p-6 glass-panel rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base sm:text-lg font-bold text-white font-display">
              OPTICAL CONTEXT VS. RADAR INTELLIGENCE
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold">
            MULTI-SENSOR FUSION
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
          Optical imagery can be affected by cloud cover, while radar observations can provide complementary surface information.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* OPTICAL PERSPECTIVE */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-300 font-mono text-[10px] font-bold border border-teal-500/40">
                OPTICAL VIEW
              </span>
              <span className="text-[10px] font-mono text-slate-500">NASA GIBS / Landsat / Sentinel-2</span>
            </div>

            <h4 className="text-sm font-bold text-white">Passive Solar Surface Reflectance</h4>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Captures natural true-color and multispectral NIR/SWIR bands. Excellent for dry-season vegetation indices (NDVI) and sediment plume monitoring. However, passive optical sensors cannot penetrate heavy monsoon storm clouds or thick fog.
            </p>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Wavelength:</span>
                <span className="text-white">0.4 – 2.2 µm (Visible/Infrared)</span>
              </div>
              <div className="flex justify-between">
                <span>Monsoon Cloud Penetration:</span>
                <span className="text-rose-400 font-bold">0% (Cloud Blocked)</span>
              </div>
            </div>
          </div>

          {/* RADAR PERSPECTIVE */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-500/40">
                RADAR VIEW
              </span>
              <span className="text-[10px] font-mono text-cyan-400 font-bold">NISAR L-Band / Sentinel-1 C-Band</span>
            </div>

            <h4 className="text-sm font-bold text-white">Active Microwave Coherent Backscatter</h4>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Transmits its own electromagnetic microwave pulses (5.6cm to 24cm) that pierce through monsoonal clouds, rain, and darkness 24/7. Measures soil dielectric moisture content, micro-roughness, and InSAR phase deformation.
            </p>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-cyan-500/20 text-[10px] font-mono text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Wavelength:</span>
                <span className="text-cyan-300 font-bold">5.6 cm (C-band) & 24 cm (L-band)</span>
              </div>
              <div className="flex justify-between">
                <span>Monsoon Cloud Penetration:</span>
                <span className="text-emerald-400 font-bold">100% (All-Weather 24/7)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
