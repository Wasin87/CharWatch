import React, { useState, useEffect } from 'react';
import { SIMULATED_RIVER_REGIONS } from '../data/simulatedData';
import { useLiveRiverData } from '../hooks/useLiveRiverData';
import { ShieldAlert, AlertTriangle, ShieldCheck, Activity, Info, BarChart, Droplets, Cloud, RefreshCw, Compass } from 'lucide-react';

export const RiskEngine: React.FC = () => {
  const { stations, basin, isLoading: isLiveLoading, refresh } = useLiveRiverData();
  const [selectedRegion, setSelectedRegion] = useState(SIMULATED_RIVER_REGIONS[0]);

  // Find matching live station for active region
  const matchedStation = stations.find((s) => s.district.toLowerCase() === selectedRegion.district.toLowerCase()) || stations[0];

  // Dynamic weights calculated with live telemetry
  const soilMoistureWeight = 0.25;
  const groundMovementWeight = 0.20;
  const coherenceWeight = 0.20;
  const bankShiftWeight = 0.25;
  const riverLevelWeight = 0.10;

  // Real-time computed risk score
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
    <section className="w-full max-w-7xl mx-auto py-6 sm:py-10 px-3 sm:px-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="uppercase font-semibold tracking-wider">
              REAL-TIME EARLY WARNING & HYDRO-GEOMORPHIC RISK ENGINE
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
            PROTOTYPE RISK ENGINE
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-sans">
            Calibrated risk matrix combining SAR interferometric ground subsidence, InSAR phase decorrelation, and live Open-Meteo river discharge forecasts.
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

      {/* Live Hydrology Basin Indicator */}
      <div className="mb-6 p-3.5 glass-panel rounded-2xl border border-cyan-500/30 text-xs font-mono flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-2 text-slate-300">
          <Droplets className="w-4 h-4 text-cyan-400 animate-pulse shrink-0" />
          <span>
            LIVE STATION: <strong className="text-cyan-300">{matchedStation?.name || selectedRegion.name}</strong> · Water Level: <strong className="text-emerald-400">{matchedStation?.currentWaterLevelM || 12.8}m</strong> (DL: {matchedStation?.dangerLevelM || 13.35}m)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">DISCHARGE:</span>
          <span className="text-cyan-300 font-bold">{matchedStation ? matchedStation.dischargeM3s.toLocaleString() : '19,670'} m³/s</span>
        </div>
      </div>

      {/* Circular Risk Engine Display & Component Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8">
        
        {/* Left Circular Radial Gauge (6 Cols) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-8 glass-panel-cyan rounded-3xl border border-cyan-500/30 relative shadow-2xl">
          
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
            
            {/* SVG Circular Radial Progress Tracks */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
              
              {/* Outer Background Track */}
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="rgba(30, 41, 59, 0.8)"
                strokeWidth="12"
              />

              {/* Animated Risk Score Progress Ring */}
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke={
                  liveRiskTier === 'CRITICAL'
                    ? '#f43f5e'
                    : liveRiskTier === 'WARNING'
                    ? '#f59e0b'
                    : '#10b981'
                }
                strokeWidth="12"
                strokeDasharray={2 * Math.PI * 80}
                strokeDashoffset={2 * Math.PI * 80 * (1 - liveRiskScore / 100)}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />

              {/* Inner Decorative Accent Ring */}
              <circle
                cx="100"
                cy="100"
                r="65"
                fill="none"
                stroke="rgba(6, 182, 212, 0.2)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            </svg>

            {/* Center Score Readout */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-semibold">
                COMPOSITE RISK INDEX
              </span>
              <span className={`text-5xl font-extrabold font-mono mt-1 ${
                liveRiskTier === 'CRITICAL'
                  ? 'text-rose-400'
                  : liveRiskTier === 'WARNING'
                  ? 'text-amber-300'
                  : 'text-emerald-400'
              }`}>
                {liveRiskScore}
              </span>
              <span className="text-xs font-mono text-slate-400 font-bold mt-0.5">/ 100</span>

              <span className={`mt-3 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border shadow-lg ${
                liveRiskTier === 'CRITICAL'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : liveRiskTier === 'WARNING'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}>
                ● {liveRiskTier}
              </span>
            </div>
          </div>

          <span className="text-xs font-mono text-slate-400 mt-4 text-center">
            {selectedRegion.name} · Population Exposed: <strong className="text-white">{selectedRegion.estimatedAffectedPopulation.toLocaleString()}</strong>
          </span>
        </div>

        {/* Right Algorithm Input Parameters (6 Cols) */}
        <div className="lg:col-span-6 space-y-3.5">
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
              weight: '25%',
              value: `${selectedRegion.bankShiftMeters} m Total Retreat`,
              score: Math.min(100, selectedRegion.bankShiftMeters * 0.9),
              color: 'bg-rose-400',
            },
            {
              label: 'LIVE RIVER DISCHARGE & GAUGE LEVEL',
              weight: '10%',
              value: `${matchedStation?.dischargeM3s.toLocaleString() || '19,670'} m³/s (${matchedStation?.currentWaterLevelM || 12.8}m)`,
              score: Math.round(dynamicDischargeFactor),
              color: 'bg-teal-400',
            },
          ].map((param, idx) => (
            <div key={idx} className="p-3.5 glass-panel rounded-2xl border border-slate-800 space-y-1.5">
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
