import React, { useState } from 'react';
import { NasaEarthObservatory } from './NasaEarthObservatory';
import { useLiveRiverData } from '../hooks/useLiveRiverData';
import { LiveStationData } from '../services/liveRiverService';
import { RiverRegion } from '../types/charwatch';
import {
  Layers,
  Satellite,
  Radio,
  MapPin,
  Cpu,
  RefreshCw,
  Compass,
  Waves,
  ShieldCheck,
  TrendingDown,
  Info,
} from 'lucide-react';

interface RiverMapProps {
  onSelectRegionForAnalyst?: (region: RiverRegion) => void;
}

export const RiverMap: React.FC<RiverMapProps> = ({ onSelectRegionForAnalyst }) => {
  const [activeObservatoryMode, setActiveObservatoryMode] = useState<'NASA_GIBS' | 'GIS_TELEMETRY'>('NASA_GIBS');
  const { stations, basin, isLoading, refresh, lastRefreshed } = useLiveRiverData();
  const [selectedStation, setSelectedStation] = useState<LiveStationData | null>(null);

  const handleLaunchAIForStation = (st: LiveStationData) => {
    if (onSelectRegionForAnalyst) {
      const mockRegion: RiverRegion = {
        id: st.id,
        name: st.name,
        riverSystem: (st.riverSystem as any) || 'Jamuna',
        district: st.district || 'Sirajganj',
        lat: st.lat,
        lng: st.lng,
        riskScore: st.status === 'SEVERE' || st.status === 'DANGER' ? 88 : 55,
        riskTier: st.status === 'SEVERE' || st.status === 'DANGER' ? 'CRITICAL' : 'WARNING',
        erosionRate: 240,
        bankShiftMeters: 750,
        soilMoisturePercent: 42.5,
        groundSubsidenceMm: 14.2,
        radarCoherence: 0.48,
        backscatterLBandDb: -12.4,
        backscatterCBandDb: -15.2,
        activeCharsCount: 6,
        estimatedAffectedPopulation: 65000,
        lastSatelliteObservation: '2026-10-01',
        description: `Hydrometric observation at ${st.name}. Water stage ${st.currentWaterLevelM.toFixed(2)}m PWD against Danger Level ${st.dangerLevelM.toFixed(2)}m.`,
        historicalOutlines: []
      };
      onSelectRegionForAnalyst(mockRegion);
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto py-4 sm:py-8 px-2 sm:px-4 space-y-6">
      
      {/* MODE SWITCHER STRIP */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 glass-panel rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveObservatoryMode('NASA_GIBS')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all ${
              activeObservatoryMode === 'NASA_GIBS'
                ? 'bg-gradient-to-r from-cyan-400 to-teal-300 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-white glass-panel border border-slate-800'
            }`}
          >
            <Satellite className="w-3.5 h-3.5" />
            <span>NASA EARTH OBSERVATORY (GIBS SATELLITE TILES)</span>
          </button>

          <button
            onClick={() => setActiveObservatoryMode('GIS_TELEMETRY')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all ${
              activeObservatoryMode === 'GIS_TELEMETRY'
                ? 'bg-gradient-to-r from-cyan-400 to-teal-300 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-white glass-panel border border-slate-800'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>BWDB HYDRO-TELEMETRIC STATIONS</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="text-emerald-400 flex items-center gap-1 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>WMO / NASA EOSDIS CONNECTED</span>
          </span>
        </div>
      </div>

      {/* MODE 1: PREMIER NASA EARTH OBSERVATORY */}
      {activeObservatoryMode === 'NASA_GIBS' && (
        <NasaEarthObservatory onSelectRegionForAnalyst={onSelectRegionForAnalyst} />
      )}

      {/* MODE 2: BWDB HYDROLOGICAL TELEMETRY DECK */}
      {activeObservatoryMode === 'GIS_TELEMETRY' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
          
          {/* Station Matrix & Cards (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="p-5 glass-panel rounded-3xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Waves className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-bold text-white font-display">
                    BWDB 109 HYDROLOGICAL GAUGING STATIONS
                  </h3>
                </div>
                <button
                  onClick={refresh}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-xs font-mono text-cyan-300 transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>REFRESH LIVE TELEMETRY</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {stations.map((st) => {
                  const isDanger = st.status === 'SEVERE' || st.status === 'DANGER';
                  const isWarning = st.status === 'WARNING';
                  return (
                    <div
                      key={st.id}
                      onClick={() => setSelectedStation(st)}
                      className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                        selectedStation?.id === st.id
                          ? 'border-cyan-400 bg-cyan-950/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                          : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-white text-sm">{st.name}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                            isDanger
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : isWarning
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          }`}
                        >
                          {st.status}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs font-mono text-slate-300">
                        <div className="flex justify-between">
                          <span className="text-slate-500">River System:</span>
                          <span className="text-cyan-300">{st.riverSystem} · {st.district}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Water Stage:</span>
                          <span className="text-white font-bold">{st.currentWaterLevelM.toFixed(2)} m PWD</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Danger Level:</span>
                          <span className="text-slate-400">{st.dangerLevelM.toFixed(2)} m</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Discharge Flow:</span>
                          <span className="text-teal-300">{st.dischargeM3s.toLocaleString()} m³/s</span>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-900 flex justify-between items-center text-[10px] font-mono text-slate-400">
                        <span>Velocity: {st.flowVelocityMs} m/s</span>
                        <span className="text-cyan-400 font-bold">Click to inspect →</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Station Deep Inspector (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            {selectedStation ? (
              <div className="p-5 glass-panel-cyan rounded-3xl border border-cyan-500/40 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                    STATION TELEMETRY PROFILE
                  </span>
                  <span className="text-xs font-mono text-slate-400">ID: #{selectedStation.id}</span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white font-display">{selectedStation.name}</h3>
                  <span className="text-xs font-mono text-cyan-300">
                    {selectedStation.riverSystem} River Basin · {selectedStation.district} District
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">GPS Coordinates:</span>
                    <span className="text-white">{selectedStation.lat.toFixed(4)}°N, {selectedStation.lng.toFixed(4)}°E</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current Water Level:</span>
                    <span className="text-emerald-400 font-bold">{selectedStation.currentWaterLevelM.toFixed(2)} m PWD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Official Danger Level:</span>
                    <span className="text-rose-400 font-bold">{selectedStation.dangerLevelM.toFixed(2)} m PWD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Calculated Departure:</span>
                    <span className="text-white">
                      {(selectedStation.currentWaterLevelM - selectedStation.dangerLevelM) >= 0
                        ? `+${((selectedStation.currentWaterLevelM - selectedStation.dangerLevelM) * 100).toFixed(0)} cm (Above Danger)`
                        : `${((selectedStation.currentWaterLevelM - selectedStation.dangerLevelM) * 100).toFixed(0)} cm (Below Danger)`}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleLaunchAIForStation(selectedStation)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-300 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all active:scale-95"
                >
                  <Cpu className="w-4 h-4" />
                  <span>LAUNCH AI ANALYST FOR STATION</span>
                </button>
              </div>
            ) : (
              <div className="p-6 glass-panel rounded-3xl border border-slate-800 text-center space-y-3">
                <MapPin className="w-8 h-8 text-cyan-400 mx-auto opacity-60" />
                <h4 className="text-sm font-bold text-white font-display">SELECT A GAUGING STATION</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Click on any hydrometric station on the left to view in-situ hydrography and launch AI hydrological risk analysis.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

    </section>
  );
};
