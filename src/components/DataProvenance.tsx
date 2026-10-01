import React from 'react';
import { SIMULATED_DATA_SOURCES } from '../data/simulatedData';
import { Database, ExternalLink, ShieldCheck, Info } from 'lucide-react';

export const DataProvenance: React.FC = () => {
  return (
    <section className="w-full max-w-7xl mx-auto py-12 px-4">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-semibold">
          OPEN SCIENCE & DATA PROVENANCE
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1 font-display">
          DATA & OPEN SCIENCE INTEGRATION
        </h2>
        <p className="text-slate-300 text-sm mt-3 leading-relaxed">
          Grounding satellite observations in open datasets from NASA, ESA Copernicus, and Bangladesh hydrological monitoring agencies.
        </p>
      </div>

      {/* Provenance Matrix Table */}
      <div className="glass-panel rounded-2xl border border-slate-700/80 overflow-hidden shadow-2xl mb-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/90 text-[11px] font-mono text-cyan-400 uppercase border-b border-slate-800">
                <th className="p-4">DATASET / SENSOR</th>
                <th className="p-4">ORGANIZATION</th>
                <th className="p-4">DATA TYPE</th>
                <th className="p-4">RESOLUTION</th>
                <th className="p-4">LAST UPDATED</th>
                <th className="p-4">PROVENANCE STATUS</th>
              </tr>
            </thead>
            <tbody className="text-xs font-mono text-slate-300 divide-y divide-slate-800/60">
              {SIMULATED_DATA_SOURCES.map((source, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-4 font-bold text-white flex items-center gap-2">
                    <span>{source.name}</span>
                    <a
                      href={source.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-500 hover:text-cyan-400"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </td>
                  <td className="p-4 text-slate-400">{source.organization}</td>
                  <td className="p-4">{source.type}</td>
                  <td className="p-4 text-cyan-300">{source.resolution}</td>
                  <td className="p-4">{source.lastUpdated}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                      {source.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scientific Safety Notice */}
      <div className="p-6 glass-panel-cyan rounded-2xl border border-cyan-500/30 text-xs font-mono text-slate-300 space-y-2">
        <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase">
          <ShieldCheck className="w-4 h-4" />
          <span>SCIENTIFIC INTEGRITY & NASA SPACE APPS DISCLAIMER</span>
        </div>
        <p className="leading-relaxed">
          CharWatch is an open-science prototype developed for the NASA Space Apps Challenge. All satellite telemetry parameters (including backscatter intensity, interferometric coherence, and riverbank shift vectors) are simulated in this prototype version for demonstration. Operational early warnings require direct connection to calibrated real-time satellite data feeds and validation by the Bangladesh Water Development Board.
        </p>
      </div>
    </section>
  );
};
