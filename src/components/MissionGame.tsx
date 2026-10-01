import React, { useState, useEffect } from 'react';
import { SIMULATED_RIVER_REGIONS } from '../data/simulatedData';
import { RiskTier } from '../types/charwatch';
import { Satellite, Radio, Target, CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw, ArrowRight, Award, Zap } from 'lucide-react';

interface MissionGameProps {
  onOpenObservatory: () => void;
}

export const MissionGame: React.FC<MissionGameProps> = ({ onOpenObservatory }) => {
  const [gameState, setGameState] = useState<'START' | 'SCANNING' | 'COMPARING' | 'RESPONDING' | 'COMPLETE'>('START');
  const [activeRegionIndex, setActiveRegionIndex] = useState(0); // 0 to 5
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [scannedRegions, setScannedRegions] = useState<{ [id: string]: boolean }>({});
  const [selectedClassification, setSelectedClassification] = useState<RiskTier | null>(null);

  // Score metrics
  const [detectionAccuracy, setDetectionAccuracy] = useState(0);
  const [responseTimingScore, setResponseTimingScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);

  const targetRegion = SIMULATED_RIVER_REGIONS[0]; // Sirajganj Sector (High Shift)

  useEffect(() => {
    let interval: any;
    if (gameState === 'SCANNING' || gameState === 'COMPARING' || gameState === 'RESPONDING') {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setGameState('COMPLETE');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  const handleStartMission = () => {
    setGameState('SCANNING');
    setTimerSeconds(60);
    setScannedRegions({});
    setSelectedClassification(null);
  };

  const handleScanRegion = (regId: string) => {
    setScannedRegions((prev) => ({ ...prev, [regId]: true }));
  };

  const handleConfirmClassification = (tier: RiskTier) => {
    setSelectedClassification(tier);
    
    // Calculate final scores
    const isTargetCorrect = SIMULATED_RIVER_REGIONS[activeRegionIndex].id === targetRegion.id;
    const isTierCorrect = tier === targetRegion.riskTier;

    let accuracy = 50;
    if (isTargetCorrect) accuracy += 30;
    if (isTierCorrect) accuracy += 20;

    const timingScore = Math.min(100, Math.round((timerSeconds / 60) * 100));
    const total = Math.round((accuracy * 0.7) + (timingScore * 0.3));

    setDetectionAccuracy(accuracy);
    setResponseTimingScore(timingScore);
    setFinalScore(total);
    setGameState('COMPLETE');
  };

  return (
    <section className="w-full max-w-7xl mx-auto py-8 px-4">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="uppercase font-semibold tracking-wider">SIMULATION CONSOLE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-1 font-display">
            MISSION: SAVE THE BANK
          </h1>
        </div>

        <div className="flex items-center gap-3 px-3 py-1.5 glass-panel rounded-lg border border-slate-800 text-xs font-mono text-slate-300">
          <span className="text-amber-400 font-bold">EDUCATIONAL / PROTOTYPE SIMULATION</span>
        </div>
      </div>

      {/* START SCREEN */}
      {gameState === 'START' && (
        <div className="p-8 sm:p-12 glass-panel-cyan rounded-3xl border border-cyan-500/40 text-center max-w-3xl mx-auto shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <Satellite className="w-8 h-8 animate-bounce" />
          </div>

          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest block mb-2">
            MISSION DIRECTIVE #01
          </span>
          <h2 className="text-3xl font-bold text-white font-display">
            LOCATE THE SHIFTING RIVERBANK
          </h2>
          <p className="text-slate-300 text-sm mt-3 leading-relaxed max-w-xl mx-auto">
            A severe monsoonal flow shift is eroding the Jamuna River basin. Your mission as CharWatch Mission Commander: Operate the NISAR radar scanner, detect backscatter phase drift, compare T0 vs T1 boundaries, classify risk tier, and trigger emergency response!
          </p>

          <div className="grid grid-cols-5 gap-2 max-w-lg mx-auto my-6 text-[10px] font-mono text-cyan-300">
            <div className="p-2 glass-panel rounded">1. SCAN</div>
            <div className="p-2 glass-panel rounded">2. DETECT</div>
            <div className="p-2 glass-panel rounded">3. COMPARE</div>
            <div className="p-2 glass-panel rounded">4. CLASSIFY</div>
            <div className="p-2 glass-panel rounded">5. RESPOND</div>
          </div>

          <button
            onClick={handleStartMission}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-300 text-slate-950 font-bold font-mono text-sm shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:from-cyan-300 hover:to-teal-200 transition-all uppercase"
          >
            START MISSION SCANNER
          </button>
        </div>
      )}

      {/* GAME CONSOLE (SCANNING / COMPARING / RESPONDING) */}
      {(gameState === 'SCANNING' || gameState === 'COMPARING' || gameState === 'RESPONDING') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Scanner Stage (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            
            {/* Top Mission Telemetry Bar */}
            <div className="p-4 glass-panel rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className="text-cyan-400 font-bold">TIMER: {timerSeconds}s</span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-300">STATUS: {gameState}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">SCANNED:</span>
                <span className="text-teal-300 font-bold">{Object.keys(scannedRegions).length} / {SIMULATED_RIVER_REGIONS.length}</span>
              </div>
            </div>

            {/* Interactive River Grid Canvas */}
            <div className="relative w-full h-[400px] rounded-2xl glass-panel border border-slate-700 bg-[#060a14] overflow-hidden flex items-center justify-center">
              
              <svg className="w-full h-full" viewBox="0 0 600 400">
                {/* Background Grid */}
                <defs>
                  <pattern id="gameGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(6,182,212,0.1)" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="600" height="400" fill="#060a14" />
                <rect width="600" height="400" fill="url(#gameGrid)" />

                {/* River Trunk */}
                <path d="M 280 0 Q 300 200 320 400" fill="none" stroke="#0284c7" strokeWidth="24" opacity="0.6" />

                {/* Interactive Scan Nodes */}
                {SIMULATED_RIVER_REGIONS.map((region, idx) => {
                  const isSelected = activeRegionIndex === idx;
                  const isScanned = scannedRegions[region.id];

                  const x = 180 + (idx * 45);
                  const y = 80 + (idx * 50);

                  return (
                    <g
                      key={region.id}
                      className="cursor-pointer"
                      onClick={() => {
                        setActiveRegionIndex(idx);
                        handleScanRegion(region.id);
                        setGameState('COMPARING');
                      }}
                    >
                      {/* Radar Pulse Crosshair */}
                      {isSelected && (
                        <circle cx={x} cy={y} r="25" fill="rgba(6, 182, 212, 0.2)" stroke="#06b6d4" strokeWidth="1.5" className="animate-ping" />
                      )}

                      <circle
                        cx={x}
                        cy={y}
                        r="12"
                        fill={isScanned ? "#06b6d4" : "#1e293b"}
                        stroke="#ffffff"
                        strokeWidth="2"
                      />

                      <text x={x + 18} y={y + 4} fill={isSelected ? "#06b6d4" : "#cbd5e1"} fontSize="11" fontFamily="monospace" fontWeight="bold">
                        {region.name}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Crosshair Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
                <Target className="w-48 h-48 text-cyan-400" />
              </div>
            </div>
          </div>

          {/* Right Scanner Control & Response Panel (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="p-6 glass-panel-cyan rounded-2xl border border-cyan-500/30 flex flex-col h-full">
              
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                ACTIVE RADAR SCANNER
              </span>
              <h3 className="text-xl font-bold text-white font-display mt-0.5">
                {SIMULATED_RIVER_REGIONS[activeRegionIndex].name}
              </h3>

              {/* Telemetry Readout */}
              <div className="mt-4 p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-mono space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">L-BAND BACKSCATTER:</span>
                  <span className="text-cyan-300 font-bold">{SIMULATED_RIVER_REGIONS[activeRegionIndex].backscatterLBandDb} dB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">COHERENCE ($\gamma$):</span>
                  <span className="text-amber-300 font-bold">{SIMULATED_RIVER_REGIONS[activeRegionIndex].radarCoherence}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ESTIMATED SHIFT:</span>
                  <span className="text-rose-400 font-bold">{SIMULATED_RIVER_REGIONS[activeRegionIndex].bankShiftMeters} m</span>
                </div>
              </div>

              {/* Step 4 & 5: Classify & Respond */}
              <div className="mt-6">
                <span className="text-xs font-mono text-slate-300 font-bold block mb-2">
                  SELECT RESPONSE CATEGORY:
                </span>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleConfirmClassification('ADVISORY')}
                    className="w-full py-2 px-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold text-left transition-all"
                  >
                    ● ADVISORY — ROUTINE MONITORING
                  </button>

                  <button
                    onClick={() => handleConfirmClassification('WARNING')}
                    className="w-full py-2 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold text-left transition-all"
                  >
                    ▲ WARNING — PRE-POSITION SHELTERS
                  </button>

                  <button
                    onClick={() => handleConfirmClassification('CRITICAL')}
                    className="w-full py-2 px-3 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-mono text-xs font-bold text-left transition-all"
                  >
                    ✖ CRITICAL — TRIGGER EVACUATION
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* END SCREEN */}
      {gameState === 'COMPLETE' && (
        <div className="p-8 sm:p-12 glass-panel-cyan rounded-3xl border border-cyan-500/40 text-center max-w-3xl mx-auto shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mx-auto mb-6">
            <Award className="w-8 h-8" />
          </div>

          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest block mb-1">
            SIMULATION SUMMARY
          </span>
          <h2 className="text-3xl font-bold text-white font-display">MISSION COMPLETE</h2>

          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto my-6">
            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">DETECTION ACCURACY</span>
              <span className="text-2xl font-bold font-mono text-cyan-300">{detectionAccuracy}%</span>
            </div>

            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">RESPONSE TIMING</span>
              <span className="text-2xl font-bold font-mono text-teal-300">{responseTimingScore}%</span>
            </div>

            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">FINAL SCORE</span>
              <span className="text-2xl font-bold font-mono text-amber-300">{finalScore} / 100</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <button
              onClick={handleStartMission}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold transition-all"
            >
              REPLAY MISSION
            </button>

            <button
              onClick={onOpenObservatory}
              className="px-6 py-2.5 rounded-xl bg-cyan-400 text-slate-950 font-mono text-xs font-bold hover:bg-cyan-300 transition-all"
            >
              EXPLORE OBSERVATORY
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
