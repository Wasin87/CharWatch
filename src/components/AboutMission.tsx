import React from 'react';
import {
  Satellite,
  ShieldCheck,
  Award,
} from 'lucide-react';

export const AboutMission: React.FC = () => {
  return (
    <section className="w-full max-w-5xl mx-auto py-8 sm:py-12 px-3 sm:px-6 space-y-8 sm:space-y-12">
      
      {/* 1. BRAND HERO */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
          <Award className="w-3.5 h-3.5" />
          <span>NASA SPACE APPS CHALLENGE PROJECT</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-brand-title text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-teal-300 tracking-tight drop-shadow-[0_0_25px_rgba(6,182,212,0.4)]">
          CHARWATCH
        </h1>

        <p className="text-cyan-300 font-mono text-xs sm:text-sm tracking-widest mt-2 uppercase font-semibold">
          WATCH THE RIVER. DETECT THE CHANGE. PROTECT THE COMMUNITY.
        </p>

        <p className="text-slate-300 text-xs sm:text-sm md:text-base mt-4 sm:mt-6 leading-relaxed font-sans">
          CharWatch is a Bangladesh-focused Earth observation system designed to monitor riverbank change, erosion-related indicators, and newly formed chars using Synthetic Aperture Radar (SAR) and hydrological telemetry.
        </p>
      </div>

      {/* 2. CORE SCIENTIFIC PRINCIPLES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="p-5 sm:p-6 glass-panel rounded-2xl border border-slate-800">
          <Satellite className="w-8 h-8 text-cyan-400 mb-3" />
          <h3 className="text-base sm:text-lg font-bold text-white font-display">SPACE TO GROUND</h3>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Unifying NASA-ISRO NISAR L-band and Copernicus Sentinel-1 C-band SAR radar imagery to pierce monsoon cloud cover and track dielectric soil changes.
          </p>
        </div>

        <div className="p-5 sm:p-6 glass-panel rounded-2xl border border-slate-800">
          <ShieldCheck className="w-8 h-8 text-teal-400 mb-3" />
          <h3 className="text-base sm:text-lg font-bold text-white font-display">HUMAN CENTERED</h3>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Translating complex radar interferometry into simple, actionable 72-hour early warning advisories for Union Parishads and riverside char dwellers.
          </p>
        </div>

        <div className="p-5 sm:p-6 glass-panel rounded-2xl border border-slate-800">
          <Award className="w-8 h-8 text-amber-400 mb-3" />
          <h3 className="text-base sm:text-lg font-bold text-white font-display">OPEN SCIENCE</h3>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Built on open-source space data pipelines, reproducible methodologies, and transparent data provenance adhering to NASA Open Science guidelines.
          </p>
        </div>
      </div>

      {/* 3. NARRATIVE SECTION */}
      <div className="p-6 sm:p-8 glass-panel-cyan rounded-3xl border border-cyan-500/30 font-sans space-y-4 shadow-xl">
        <h3 className="text-lg sm:text-xl font-bold text-white font-display">THE BANGLADESH RIVER PROBLEM</h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Bangladesh’s major river systems — the Jamuna, Padma, Meghna, and Brahmaputra — are among the most dynamic braided rivers in the world. Every monsoon season, severe hydraulic current shear carves away thousands of hectares of riverbank land, displacing over 100,000 people annually and submerging entire char settlements.
        </p>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          CharWatch introduces all-weather satellite radar intelligence, allowing disaster response teams and local communities to "see through the clouds" and prepare before erosion strikes.
        </p>
      </div>

    </section>
  );
};
