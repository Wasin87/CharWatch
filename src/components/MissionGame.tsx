import React, { useState, useEffect, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { SIMULATED_RIVER_REGIONS } from '../data/simulatedData';
import { RiskTier, RiverRegion } from '../types/charwatch';
import {
  Satellite,
  Radio,
  Target,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  RefreshCw,
  ArrowRight,
  Award,
  Zap,
  Play,
  Pause,
  Layers,
  Sparkles,
  MapPin,
  Waves,
  TreePine,
  Volume2,
  ShieldAlert,
  Compass,
  Eye,
  Sliders,
} from 'lucide-react';

interface MissionGameProps {
  onOpenObservatory: () => void;
}

interface DefensiveTactic {
  id: string;
  name: string;
  category: 'ENGINEERING' | 'NATURE_BASED' | 'EARLY_WARNING';
  cost: number;
  protectionBoost: number;
  description: string;
  icon: any;
  deployed: boolean;
  latOffset: number;
  lngOffset: number;
}

export const MissionGame: React.FC<MissionGameProps> = ({ onOpenObservatory }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyCeuvMJN64ZFTFVf-Vc9IXfkpFiGi3F5l8';

  const [gameState, setGameState] = useState<'BRIEFING' | 'SCANNING' | 'TACTICAL_DEPLOY' | 'EVALUATION'>('BRIEFING');
  const [selectedRegionIndex, setSelectedRegionIndex] = useState<number>(0);
  const [activeRegion, setActiveRegion] = useState<RiverRegion>(SIMULATED_RIVER_REGIONS[0]);
  
  // Tactical Simulation State
  const [timerSeconds, setTimerSeconds] = useState(75);
  const [budgetCredits, setBudgetCredits] = useState(100);
  const [radarScanProgress, setRadarScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanFilter, setScanFilter] = useState<'SAR_HYBRID' | 'INSAR_COHERENCE' | 'SOIL_MOISTURE'>('SAR_HYBRID');

  // Defensive Countermeasures
  const [tactics, setTactics] = useState<DefensiveTactic[]>([
    {
      id: 'geotubes',
      name: 'High-Density Geotube Revetments',
      category: 'ENGINEERING',
      cost: 30,
      protectionBoost: 32,
      description: 'Massive sand-filled geotextile tubes submerged along the toe of the riverbank to absorb high-velocity monsoonal scour.',
      icon: ShieldCheck,
      deployed: false,
      latOffset: 0.004,
      lngOffset: -0.003,
    },
    {
      id: 'porcupines',
      name: 'Bamboo Porcupine Groynes',
      category: 'ENGINEERING',
      cost: 25,
      protectionBoost: 24,
      description: 'Tetrahedral permeable groyne arrays that slow incoming flood currents and induce rapid silt sedimentation.',
      icon: Waves,
      deployed: false,
      latOffset: -0.005,
      lngOffset: 0.004,
    },
    {
      id: 'kashbon',
      name: 'Kashbon & Vetiver Bio-Matrix',
      category: 'NATURE_BASED',
      cost: 20,
      protectionBoost: 22,
      description: 'Deep-rooting Catkin Grass (Kashbon) and Vetiver bio-revetment anchoring loose alluvial sands against shear peeling.',
      icon: TreePine,
      deployed: false,
      latOffset: 0.002,
      lngOffset: 0.006,
    },
    {
      id: 'siren_sms',
      name: 'Union Parishad 72h Early Warning Siren',
      category: 'EARLY_WARNING',
      cost: 15,
      protectionBoost: 18,
      description: 'Automated SMS broadcast & community siren dispatch alerting 14,000+ char inhabitants for orderly evacuation.',
      icon: Volume2,
      deployed: false,
      latOffset: -0.003,
      lngOffset: -0.005,
    },
  ]);

  // Results calculation
  const [bankStabilityScore, setBankStabilityScore] = useState(18); // Base stability %
  const [citizensProtected, setCitizensProtected] = useState(0);
  const [bankProtectedMeters, setBankProtectedMeters] = useState(0);

  // Sync active region
  useEffect(() => {
    setActiveRegion(SIMULATED_RIVER_REGIONS[selectedRegionIndex]);
  }, [selectedRegionIndex]);

  // Countdown timer during tactical mission
  useEffect(() => {
    let timer: any;
    if ((gameState === 'SCANNING' || gameState === 'TACTICAL_DEPLOY') && timerSeconds > 0) {
      timer = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setGameState('EVALUATION');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, timerSeconds]);

  // Start mission
  const handleStartMission = () => {
    setGameState('SCANNING');
    setTimerSeconds(75);
    setBudgetCredits(100);
    setRadarScanProgress(0);
    setIsScanning(true);

    // Reset tactics
    setTactics((prev) => prev.map((t) => ({ ...t, deployed: false })));
    setBankStabilityScore(18);
  };

  // Run Radar Scan simulation
  useEffect(() => {
    if (gameState === 'SCANNING') {
      const interval = setInterval(() => {
        setRadarScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsScanning(false);
            setGameState('TACTICAL_DEPLOY');
            return 100;
          }
          return prev + 20;
        });
      }, 400);
      return () => clearInterval(interval);
    }
  }, [gameState]);

  // Deploy tactic
  const handleDeployTactic = (tacticId: string) => {
    const tactic = tactics.find((t) => t.id === tacticId);
    if (!tactic || tactic.deployed || budgetCredits < tactic.cost) return;

    setBudgetCredits((prev) => prev - tactic.cost);
    setTactics((prev) =>
      prev.map((t) => (t.id === tacticId ? { ...t, deployed: true } : t))
    );

    setBankStabilityScore((prev) => Math.min(98, prev + tactic.protectionBoost));
  };

  // Evaluate & finish mission
  const handleCompleteMission = () => {
    const deployedCount = tactics.filter((t) => t.deployed).length;
    const stability = Math.min(98, 18 + deployedCount * 22);
    const lives = Math.round(deployedCount * 4650 + (timerSeconds * 50));
    const meters = Math.round(deployedCount * 750 + 400);

    setBankStabilityScore(stability);
    setCitizensProtected(lives);
    setBankProtectedMeters(meters);
    setGameState('EVALUATION');
  };

  return (
    <section className="w-full max-w-7xl mx-auto py-6 sm:py-10 px-3 sm:px-6">
      
      {/* 1. MISSION HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="uppercase font-semibold tracking-wider">
              REALISTIC GIS SATELLITE COMMAND CONSOLE · HYDRAULIC DEFENSE SIMULATOR
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
            MISSION: SAVE THE RIVERBANK
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-sans">
            Deploy satellite radar intelligence, detect monsoonal bank scour in real-time, and strategically position defensive countermeasures on high-resolution Google Maps imagery.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-2.5 sm:p-3 glass-panel rounded-2xl border border-cyan-500/30 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-cyan-300">
            <Satellite className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>NISAR + S1 ACTIVE</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1 text-amber-300 font-bold">
            <span>TIMER: {timerSeconds}s</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1 text-emerald-300 font-bold">
            <span>BUDGET: {budgetCredits} CR</span>
          </div>
        </div>
      </div>

      {/* 2. STAGE 1: MISSION BRIEFING SCREEN */}
      {gameState === 'BRIEFING' && (
        <div className="p-6 sm:p-10 glass-panel-cyan rounded-3xl border border-cyan-500/40 text-center max-w-4xl mx-auto shadow-2xl">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-4">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <span>CRITICAL MONSOON SCENARIO #04</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold text-white font-display tracking-tight">
            HIGH-SHEAR BANK EROSION DETECTED
          </h2>
          
          <p className="text-slate-300 text-xs sm:text-sm mt-3 leading-relaxed max-w-2xl mx-auto">
            A severe 142,000 m³/s monsoonal flood pulse is destabilizing the loose alluvial riverbanks of the Jamuna basin. As RiverGuard Tactical Commander, operate the real-time satellite radar scanner, identify the critical erosion zone on high-resolution satellite imagery, and deploy defensive countermeasures before bank breach.
          </p>

          {/* Sector Selection Cards */}
          <div className="mt-6 mb-8 text-left">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-3 text-center">
              SELECT TARGET RIVER SECTOR FOR DEFENSE:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SIMULATED_RIVER_REGIONS.slice(0, 3).map((reg, idx) => {
                const isSel = selectedRegionIndex === idx;
                return (
                  <button
                    key={reg.id}
                    onClick={() => setSelectedRegionIndex(idx)}
                    className={`p-3.5 rounded-2xl glass-panel text-left transition-all border ${
                      isSel
                        ? 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold font-mono text-white">{reg.name}</span>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {reg.riskTier}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      {reg.riverSystem} River · {reg.district}
                    </p>
                    <div className="mt-2 text-[10px] font-mono text-cyan-300 flex items-center justify-between">
                      <span>Shift: -{reg.bankShiftMeters}m</span>
                      <span>Coherence: {reg.radarCoherence}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleStartMission}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-200 text-slate-950 font-bold font-mono text-xs sm:text-sm shadow-[0_0_30px_rgba(6,182,212,0.45)] hover:from-cyan-300 hover:to-white transition-all uppercase tracking-wider active:scale-95"
          >
            INITIALIZE SATELLITE COMMAND CONSOLE
          </button>
        </div>
      )}

      {/* 3. STAGE 2 & 3: REALISTIC GIS MAP COMMAND SIMULATOR */}
      {(gameState === 'SCANNING' || gameState === 'TACTICAL_DEPLOY') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: REAL GOOGLE MAPS GIS SIMULATION CANVAS (8 COLS) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            
            {/* Map Filter Controls Bar */}
            <div className="p-3 glass-panel rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setScanFilter('SAR_HYBRID')}
                  className={`px-3 py-1 rounded-lg transition-all font-bold ${
                    scanFilter === 'SAR_HYBRID'
                      ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  HYBRID GIS SATELLITE
                </button>
                <button
                  onClick={() => setScanFilter('INSAR_COHERENCE')}
                  className={`px-3 py-1 rounded-lg transition-all font-bold ${
                    scanFilter === 'INSAR_COHERENCE'
                      ? 'bg-amber-500/25 text-amber-300 border border-amber-400/50 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  INSAR INTERFEROGRAM
                </button>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-emerald-400 font-bold">
                  {gameState === 'SCANNING' ? 'ORBITAL SAR RADAR SWEEP...' : 'TACTICAL DEFENSE ACTIVE'}
                </span>
              </div>
            </div>

            {/* REAL GOOGLE MAPS STAGE */}
            <div className="relative w-full h-[380px] xs:h-[460px] sm:h-[540px] rounded-3xl overflow-hidden glass-panel border-2 border-cyan-500/40 shadow-2xl bg-[#01040a]">
              
              <APIProvider apiKey={apiKey}>
                <Map
                  id="mission-game-map"
                  mapId="DEMO_MAP_ID"
                  defaultCenter={{ lat: activeRegion.lat, lng: activeRegion.lng }}
                  center={{ lat: activeRegion.lat, lng: activeRegion.lng }}
                  defaultZoom={13}
                  zoom={13}
                  mapTypeId="hybrid"
                  gestureHandling="greedy"
                  disableDefaultUI={false}
                  zoomControl={true}
                  className="w-full h-full"
                  internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                >
                  {/* 1. Critical Riverbank Scour Center Node */}
                  <AdvancedMarker position={{ lat: activeRegion.lat, lng: activeRegion.lng }}>
                    <div className="cursor-pointer transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                      <div className="px-3 py-1 rounded-xl bg-rose-950/90 text-rose-300 border-2 border-rose-500 text-xs font-mono font-bold flex items-center gap-1.5 shadow-[0_0_20px_rgba(244,63,94,0.6)] animate-pulse">
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>SCOUR ZONE: -{activeRegion.bankShiftMeters}m SHIFT</span>
                      </div>
                      <div className="w-3 h-3 bg-rose-500 rotate-45 -mt-1.5 shadow-lg" />
                    </div>
                  </AdvancedMarker>

                  {/* 2. Vulnerable Char Settlement Marker */}
                  <AdvancedMarker position={{ lat: activeRegion.lat - 0.008, lng: activeRegion.lng + 0.008 }}>
                    <div className="px-2.5 py-1 rounded-lg bg-amber-950/90 text-amber-300 border border-amber-500 text-[10px] font-mono flex items-center gap-1 shadow-lg">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      <span>14,200 CHAR RESIDENTS AT RISK</span>
                    </div>
                  </AdvancedMarker>

                  {/* 3. Render Deployed Defensive Countermeasures as Interactive Markers on Map */}
                  {tactics
                    .filter((t) => t.deployed)
                    .map((tactic) => {
                      const Icon = tactic.icon;
                      return (
                        <AdvancedMarker
                          key={tactic.id}
                          position={{
                            lat: activeRegion.lat + tactic.latOffset,
                            lng: activeRegion.lng + tactic.lngOffset,
                          }}
                        >
                          <div className="transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-in zoom-in duration-300">
                            <div className="p-2 rounded-2xl bg-cyan-950/90 border-2 border-cyan-400 text-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.8)] flex items-center gap-1.5">
                              <Icon className="w-4 h-4 text-cyan-300" />
                              <span className="text-[10px] font-mono font-bold">{tactic.name}</span>
                            </div>
                            <div className="w-2.5 h-2.5 bg-cyan-400 rotate-45 -mt-1" />
                          </div>
                        </AdvancedMarker>
                      );
                    })}
                </Map>
              </APIProvider>

              {/* Radar Scan Holographic Overlay Sweep Effect */}
              {gameState === 'SCANNING' && (
                <div className="absolute inset-0 bg-cyan-950/40 backdrop-blur-[2px] flex flex-col items-center justify-center pointer-events-none">
                  <div className="w-36 h-36 rounded-full border-4 border-cyan-400/80 border-t-transparent animate-spin mb-4" />
                  <span className="text-sm font-mono font-bold text-cyan-300 tracking-widest uppercase">
                    MICROWAVE SAR SWEEPING JAMUNA BASIN: {radarScanProgress}%
                  </span>
                  <span className="text-xs font-mono text-slate-300 mt-1">
                    Calibrating NISAR L-band & Sentinel-1 C-band backscatter phase
                  </span>
                </div>
              )}

              {/* InSAR Deformation False-Color Overlay (when selected) */}
              {scanFilter === 'INSAR_COHERENCE' && gameState !== 'SCANNING' && (
                <div className="absolute top-4 right-4 p-3 rounded-2xl glass-panel-cyan border border-amber-500/40 text-xs font-mono pointer-events-none max-w-xs shadow-2xl">
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold mb-1">
                    <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <span>INSAR COHERENCE DECAY</span>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-tight">
                    Phase decorrelation detected along west riverbank: γ = {activeRegion.radarCoherence}. Hydraulic bedload collapse imminent within 48-72h.
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Telemetry Ticker */}
            <div className="p-3.5 glass-panel rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">TARGET SECTOR:</span>
                <strong className="text-white">{activeRegion.name}</strong>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">RIVER DISCHARGE:</span>
                <strong className="text-cyan-300">142,850 m³/s (Monsoon Peak)</strong>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">BANK RESISTANCE:</span>
                <strong className={bankStabilityScore > 60 ? 'text-emerald-400' : 'text-rose-400'}>
                  {bankStabilityScore}% STABLE
                </strong>
              </div>
            </div>
          </div>

          {/* RIGHT: TACTICAL COUNTERMEASURES CONTROL DECK (4 COLS) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            
            {/* Defensive Deck Header */}
            <div className="p-4 glass-panel rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display font-bold text-sm text-white">DEFENSIVE COUNTERMEASURES</h3>
                <span className="text-xs font-mono text-cyan-400 font-bold">
                  BUDGET: {budgetCredits} CR
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                Deploy physical, biological, and warning systems to reinforce the riverbank and shield vulnerable char communities.
              </p>
            </div>

            {/* Tactical Cards List */}
            <div className="space-y-2.5">
              {tactics.map((tactic) => {
                const Icon = tactic.icon;
                const canAfford = budgetCredits >= tactic.cost;
                return (
                  <div
                    key={tactic.id}
                    className={`p-3.5 rounded-2xl glass-panel border transition-all ${
                      tactic.deployed
                        ? 'border-emerald-500/50 bg-emerald-950/20'
                        : canAfford
                        ? 'border-slate-800 hover:border-cyan-500/40'
                        : 'border-slate-900 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <div
                          className={`p-1.5 rounded-xl ${
                            tactic.deployed
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">{tactic.name}</span>
                          <span className="text-[9px] font-mono text-cyan-400 uppercase">
                            {tactic.category} · +{tactic.protectionBoost}% STABILITY
                          </span>
                        </div>
                      </div>

                      <span className="text-xs font-mono font-bold text-amber-300 shrink-0">
                        {tactic.cost} CR
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-300 leading-relaxed mb-2.5 font-sans">
                      {tactic.description}
                    </p>

                    <button
                      onClick={() => handleDeployTactic(tactic.id)}
                      disabled={tactic.deployed || !canAfford || gameState === 'SCANNING'}
                      className={`w-full py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all min-h-[34px] ${
                        tactic.deployed
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                          : canAfford
                          ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                          : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                      }`}
                    >
                      {tactic.deployed ? '✓ DEPLOYED ON MAP' : `DEPLOY (-${tactic.cost} CR)`}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Trigger Mission Evaluation CTA */}
            <button
              onClick={handleCompleteMission}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:from-emerald-300 hover:to-teal-200 transition-all active:scale-95 min-h-[42px]"
            >
              FINALIZE TACTICAL DEFENSE & EVALUATE
            </button>
          </div>
        </div>
      )}

      {/* 4. STAGE 4: EVALUATION & MISSION CERTIFICATION SCREEN */}
      {gameState === 'EVALUATION' && (
        <div className="p-6 sm:p-10 glass-panel-cyan rounded-3xl border border-cyan-500/40 text-center max-w-4xl mx-auto shadow-2xl animate-in zoom-in duration-300">
          
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-[0_0_25px_rgba(16,185,129,0.4)]">
            <Award className="w-8 h-8 animate-bounce" />
          </div>

          <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest block mb-1">
            MISSION COMPLETED · VERIFIED REPORT
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-white font-display tracking-tight">
            RIVERBANK SECTOR STABILIZED
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl mx-auto">
            Your rapid SAR radar deployment and engineering/nature-based countermeasures successfully defended the {activeRegion.name} embankment against monsoon hydraulic collapse.
          </p>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto my-8 text-left">
            <div className="p-4 glass-panel rounded-2xl border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase">BANK STABILITY</span>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                {bankStabilityScore}%
              </div>
              <span className="text-[10px] font-mono text-slate-400">Scour resistance achieved</span>
            </div>

            <div className="p-4 glass-panel rounded-2xl border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase">LIVES PROTECTED</span>
              <div className="text-2xl font-bold font-mono text-cyan-300 mt-1">
                {citizensProtected.toLocaleString()}
              </div>
              <span className="text-[10px] font-mono text-slate-400">Char inhabitants safeguarded</span>
            </div>

            <div className="p-4 glass-panel rounded-2xl border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase">EMBANKMENT SHIELDED</span>
              <div className="text-2xl font-bold font-mono text-teal-300 mt-1">
                {(bankProtectedMeters / 1000).toFixed(1)} KM
              </div>
              <span className="text-[10px] font-mono text-slate-400">Continuous revetment line</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleStartMission}
              className="px-6 py-3 rounded-xl glass-panel border border-slate-700 hover:border-cyan-400 text-cyan-300 font-mono text-xs uppercase tracking-wider transition-all hover:bg-slate-800"
            >
              <RefreshCw className="w-4 h-4 inline-block mr-1.5" />
              REPLAY SCENARIO
            </button>

            <button
              onClick={onOpenObservatory}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-300 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:from-cyan-300 hover:to-teal-200 transition-all"
            >
              <span>RETURN TO LIVE OBSERVATORY</span>
              <ArrowRight className="w-4 h-4 inline-block ml-1.5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
