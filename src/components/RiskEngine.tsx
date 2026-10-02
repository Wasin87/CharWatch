import React, { useState, useEffect } from 'react';
import { SIMULATED_RIVER_REGIONS } from '../data/simulatedData';
import { useLiveRiverData } from '../hooks/useLiveRiverData';
import {
  ShieldAlert,
  AlertTriangle,
  ShieldCheck,
  Activity,
  Info,
  BarChart,
  Droplets,
  Cloud,
  RefreshCw,
  Compass,
  Satellite,
  Layers,
  CheckCircle2,
} from 'lucide-react';

export const RiskEngine: React.FC = () => {
  const { stations, basin, isLoading: isLiveLoading, refresh } = useLiveRiverData();
  const [selectedRegion, setSelectedRegion] = useState(SIMULATED_RIVER_REGIONS[0]);

  // Find matching live station for active region
  const matchedStation = stations.find((s) => s.district.toLowerCase() === selectedRegion.district.toLowerCase()) || stations[0];

  // Dynamic weights calculated with live telemetry
  const dynamicWaterLevelFactor = matchedStation ? (matchedStation.currentWaterLevelM / matchedStation.dangerLevelM) * 100 : 78;
  const dynamicDischargeFactor = matchedStation ? Math.min(100, (matchedStation.dischargeM3s / 20000) * 85) : 75;

  const liveRiskScore = Math.min(
    98,
    Math.max(
      20,
      Math.round(
        selectedRegion.riskScore * 0.4 +
        dynamicWaterLevelFactor * 0.35 +
        dynamicDischargeFactor * 0.25
      )
    )
  );

  const liveRiskTier = liveRiskScore >= 80 ? 'CRITICAL' : liveRiskScore >= 60 ? 'WARNING' : 'ADVISORY';

  return (
    <section className="w-full max-w-7xl mx-auto py-6 sm:py-10 px-3 sm:px-6 space-y-6">
      
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-2">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>HYDRO-GEOMORPHIC RISK ENGINE</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
            PROTOTYPE RISK INDICATOR
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-sans leading-relaxed">
            Multi-parameter risk matrix combining microwave SAR ground deformation, InSAR phase decorrelation, BWDB hydrometric river levels, and NASA GIBS supporting visual context.
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

      {/* 2. RISK ARCHITECTURE FUSION FLOW */}
      <div className="p-4 glass-panel rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
            MULTI-PARAMETER RISK INDICATOR ARCHITECTURE:
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
            PROTOTYPE MODEL
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 text-center text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">SAR Change</span>
            <strong className="text-cyan-300 text-[11px]">NISAR / S1</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Bankline Shift</span>
            <strong className="text-rose-400 text-[11px]">-{selectedRegion.bankShiftMeters}m</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">River Level</span>
            <strong className="text-emerald-400 text-[11px]">{matchedStation?.currentWaterLevelM.toFixed(1)}m PWD</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Rainfall / Monsoon</span>
            <strong className="text-teal-300 text-[11px]">ECMWF</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Terrain DEM</span>
            <strong className="text-white text-[11px]">GLO-30m</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-cyan-500/30">
            <span className="text-[10px] text-cyan-400 block">GIBS Visual Context</span>
            <strong className="text-cyan-300 text-[11px]">NASA GIBS</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-cyan-400 block font-bold">Risk Indicator</span>
            <strong className="text-white text-xs">{liveRiskScore}/100</strong>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
          <span>*GIBS is utilized as supporting visual evidence, not an automated predictor.</span>
          <span className="text-amber-300 font-semibold">Requires historical and field validation before operational use.</span>
        </div>
      </div>

      {/* 3. CIRCULAR GAUGE & BREAKDOWN DECK */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Circular Radial Gauge (6 Cols) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 sm:p-8 glass-panel-cyan rounded-3xl border border-cyan-500/30 relative shadow-2xl">
          
          <div className="relative w-56 h-56 xs:w-64 xs:h-64 sm:w-80 sm:h-80 flex items-center justify-center">
            
            {/* SVG Circular Radial Progress Tracks */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="rgba(15, 23, 42, 0.8)"
                strokeWidth="16"
              />
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke={liveRiskScore >= 80 ? '#f43f5e' : liveRiskScore >= 60 ? '#f59e0b' : '#06b6d4'}
                strokeWidth="16"
                strokeDasharray="502.65"
                strokeDashoffset={502.65 - (502.65 * liveRiskScore) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                PROTOTYPE RISK SCORE
              </span>
              <span className="text-4xl sm:text-6xl font-extrabold text-white font-display my-1">
                {liveRiskScore}
              </span>
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase border ${
                  liveRiskTier === 'CRITICAL'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : liveRiskTier === 'WARNING'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                }`}
              >
                {liveRiskTier} ALERT TIER
              </span>
            </div>
          </div>

          <div className="mt-4 text-center">
            <h3 className="text-base sm:text-lg font-bold text-white font-display">
              {selectedRegion.name}
            </h3>
            <span className="text-xs font-mono text-cyan-300">
              {selectedRegion.riverSystem} River Basin · {selectedRegion.district} District
            </span>
          </div>
        </div>

        {/* Right Parameter Weight Cards (6 Cols) */}
        <div className="lg:col-span-6 space-y-3">
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">
            RADAR & HYDROLOGICAL INPUT WEIGHTS:
          </span>

          {[
            {
              label: 'SAR DIELECTRIC SOIL MOISTURE',
              weight: '25%',
              value: `${selectedRegion.soilMoisturePercent}% Saturation`,
              score: selectedRegion.soilMoisturePercent,
              color: 'bg-cyan-500',
            },
            {
              label: 'INSAR GROUND SUBSIDENCE VELOCITY',
              weight: '20%',
              value: `${selectedRegion.groundSubsidenceMm} mm/yr`,
              score: Math.min(100, selectedRegion.groundSubsidenceMm * 6),
              color: 'bg-rose-500',
            },
            {
              label: 'INTERFEROMETRIC PHASE COHERENCE',
              weight: '20%',
              value: `${selectedRegion.radarCoherence} γ (High Decorrelation)`,
              score: Math.round((1 - selectedRegion.radarCoherence) * 100),
              color: 'bg-amber-500',
            },
            {
              label: 'CUMULATIVE RIVERBANK SHIFT',
              weight: '20%',
              value: `${selectedRegion.bankShiftMeters} m Total Retreat`,
              score: Math.min(100, selectedRegion.bankShiftMeters * 0.9),
              color: 'bg-rose-400',
            },
            {
              label: 'LIVE RIVER DISCHARGE & GAUGE LEVEL',
              weight: '10%',
              value: `${matchedStation?.dischargeM3s.toLocaleString() || '19,670'} m³/s (${matchedStation?.currentWaterLevelM.toFixed(1) || '12.8'}m)`,
              score: Math.round(dynamicDischargeFactor),
              color: 'bg-teal-400',
            },
            {
              label: 'NASA GIBS VISUAL SURFACE CONTEXT',
              weight: '5%',
              value: 'MODIS 250m & Landsat 30m Optical Reference',
              score: 85,
              color: 'bg-indigo-400',
            },
          ].map((param, idx) => (
            <div key={idx} className="p-3 glass-panel rounded-2xl border border-slate-800 space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300 font-bold">{param.label}</span>
                <span className="text-cyan-400 font-bold">Weight {param.weight}</span>
              </div>
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>{param.value}</span>
                <span className="text-white font-bold">{param.score}/100</span>
              </div>
              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                <div className={`h-full ${param.color}`} style={{ width: `${param.score}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};
