import React, { useState } from 'react';
import { SIMULATED_EARLY_WARNING_ACTIONS } from '../data/simulatedData';
import { ShieldCheck, AlertTriangle, AlertOctagon, ChevronDown, ChevronUp, CheckCircle, ArrowRight } from 'lucide-react';

export const EarlyWarning: React.FC = () => {
  const [expandedCard, setExpandedCard] = useState<string | null>('act-warning');

  return (
    <section className="w-full max-w-7xl mx-auto py-12 px-4">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-semibold">
          COMMUNITY PREPAREDNESS & ACTION
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1 font-display">
          EARLY WARNING WORKFLOWS
        </h2>
        <p className="text-slate-300 text-sm mt-3 leading-relaxed">
          Operational response matrices translating orbital SAR change detections into actionable local disaster preparedness protocols.
        </p>
      </div>

      {/* Three Large Interactive Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* GREEN CARD: ADVISORY */}
        <div className="p-6 rounded-2xl glass-panel border border-emerald-500/40 hover:border-emerald-400 transition-all shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold tracking-widest px-3 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
                ADVISORY (MONITOR)
              </span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-white font-display">ROUTINE MONITORING</h3>
            <p className="text-xs font-mono text-emerald-300/80 mt-1">12-Day Swath Satellite Track</p>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              Standard satellite surveillance. Automated NISAR & Sentinel-1 swath processing checks baseline dielectric moisture levels and riverbank contours.
            </p>

            <div className="mt-4 pt-4 border-t border-slate-800 text-xs font-mono">
              <span className="text-slate-400 block text-[10px] uppercase">TARGET STAKEHOLDERS</span>
              <span className="text-white font-semibold">Local Disaster Committees (UDMC)</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => setExpandedCard(expandedCard === 'act-advisory' ? null : 'act-advisory')}
              className="w-full flex items-center justify-between py-2 px-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-mono text-xs transition-colors"
            >
              <span>{expandedCard === 'act-advisory' ? 'HIDE PROTOCOL' : 'VIEW ACTION PROTOCOL'}</span>
              {expandedCard === 'act-advisory' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expandedCard === 'act-advisory' && (
              <div className="mt-3 p-3 bg-slate-950/80 rounded-xl border border-emerald-500/30 text-xs font-mono space-y-2 animate-in fade-in duration-200">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300">Continuous 12-day NISAR L-band soil moisture cross-checks.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300">Maintain baseline river gauge readings with BWDB.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300">Inform agricultural union parishads of minor channel shifts.</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ORANGE CARD: WARNING */}
        <div className="p-6 rounded-2xl glass-panel-cyan border border-amber-500/50 hover:border-amber-400 transition-all shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold tracking-widest px-3 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                WARNING (PREPARE)
              </span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-white font-display">PRE-EROSION READINESS</h3>
            <p className="text-xs font-mono text-amber-300/80 mt-1">Elevated Risk & Coherence Decay</p>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              Accelerated radar phase drift detected. Pre-position emergency shelters, deploy geotextile bag drop crews, and notify vulnerable char dwellers.
            </p>

            <div className="mt-4 pt-4 border-t border-slate-800 text-xs font-mono">
              <span className="text-slate-400 block text-[10px] uppercase">TARGET STAKEHOLDERS</span>
              <span className="text-white font-semibold">District Relief Officers & Red Crescent</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => setExpandedCard(expandedCard === 'act-warning' ? null : 'act-warning')}
              className="w-full flex items-center justify-between py-2 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-mono text-xs transition-colors"
            >
              <span>{expandedCard === 'act-warning' ? 'HIDE PROTOCOL' : 'VIEW ACTION PROTOCOL'}</span>
              {expandedCard === 'act-warning' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expandedCard === 'act-warning' && (
              <div className="mt-3 p-3 bg-slate-950/80 rounded-xl border border-amber-500/30 text-xs font-mono space-y-2 animate-in fade-in duration-200">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300">Trigger high-frequency Sentinel-1 coherence checks.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300">Dispatch SMS advisories to registered union parishad leaders.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300">Establish safe transit corridors for char island livestock.</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RED CARD: CRITICAL */}
        <div className="p-6 rounded-2xl glass-panel border border-rose-500/50 hover:border-rose-400 transition-all shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold tracking-widest px-3 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase">
                CRITICAL (EVACUATE)
              </span>
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
                <AlertOctagon className="w-6 h-6 animate-pulse" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-white font-display">EMERGENCY RESPONSE</h3>
            <p className="text-xs font-mono text-rose-300/80 mt-1">Active Bank Shift Imminent</p>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              Active bank carving under way. Immediate evacuation of households along shifting embankment sector. Mobilize emergency boat fleet.
            </p>

            <div className="mt-4 pt-4 border-t border-slate-800 text-xs font-mono">
              <span className="text-slate-400 block text-[10px] uppercase">TARGET STAKEHOLDERS</span>
              <span className="text-white font-semibold">Ministry of Disaster Management & BWDB</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => setExpandedCard(expandedCard === 'act-critical' ? null : 'act-critical')}
              className="w-full flex items-center justify-between py-2 px-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-mono text-xs transition-colors"
            >
              <span>{expandedCard === 'act-critical' ? 'HIDE PROTOCOL' : 'VIEW ACTION PROTOCOL'}</span>
              {expandedCard === 'act-critical' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expandedCard === 'act-critical' && (
              <div className="mt-3 p-3 bg-slate-950/80 rounded-xl border border-rose-500/30 text-xs font-mono space-y-2 animate-in fade-in duration-200">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300">Deploy emergency geotextile bag drop barges along breached bank.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300">Mobilize local riverine boat fleet for island population evacuation.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300">Transmit real-time SAR boundary maps directly to national rescue command.</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
