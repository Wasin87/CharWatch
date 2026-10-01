import React from 'react';
import {
  Satellite,
  ShieldCheck,
  Heart,
  Sparkles,
  Award,
  Code,
  Terminal,
  Cpu,
  Mail,
  CheckCircle2,
  ExternalLink,
  Layers,
  Compass,
  Radio,
} from 'lucide-react';

export const AboutMission: React.FC = () => {
  return (
    <section className="w-full max-w-5xl mx-auto py-8 sm:py-12 px-3 sm:px-6 space-y-10 sm:space-y-14">
      
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

      {/* 4. PROFESSIONAL DEVELOPER & LEAD ARCHITECT PROFILE SECTION */}
      <div className="relative p-6 sm:p-10 rounded-3xl glass-panel-cyan border-2 border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.2)] overflow-hidden">
        
        {/* Background Decorative Grid */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          
          {/* Section Kicker */}
          <div className="flex items-center gap-2 mb-6">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest">
              LEAD SYSTEM ARCHITECT & DEVELOPER
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            
            {/* Left: Avatar & Identity Badge (4 Cols) */}
            <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left">
              
              {/* Holographic Avatar Emblem */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-cyan-400 via-teal-500 to-slate-900 p-0.5 shadow-[0_0_30px_rgba(6,182,212,0.4)] mb-4">
                <div className="w-full h-full bg-[#020611] rounded-[14px] flex flex-col items-center justify-center p-3 relative overflow-hidden">
                  <Cpu className="w-10 h-10 text-cyan-300 animate-pulse mb-1" />
                  <span className="text-[10px] font-mono font-extrabold text-white tracking-widest">MWA</span>
                  <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 via-transparent to-transparent" />
                </div>

                {/* Verified Green Shield */}
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-2 border-[#020611] text-slate-950 flex items-center justify-center shadow-lg" title="Verified NASA Space Apps Lead Contributor">
                  <CheckCircle2 className="w-4 h-4 text-slate-950 stroke-[3]" />
                </div>
              </div>

              {/* Developer Name */}
              <h2 className="text-2xl sm:text-3xl font-brand-hero text-white tracking-tight leading-tight">
                Md Wasin Ahmed
              </h2>
              
              <span className="text-xs font-mono text-cyan-300 font-bold tracking-wider uppercase mt-1">
                Lead System Architect & Full-Stack Engineer
              </span>

              {/* Contact Pill */}
              <a
                href="mailto:wasinahmed807@gmail.com"
                className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-xs font-mono text-slate-300 hover:text-white hover:border-cyan-400 transition-all shadow-md"
              >
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>wasinahmed807@gmail.com</span>
              </a>
            </div>

            {/* Right: Architectural Biography & Competencies (8 Cols) */}
            <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
              
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                <strong>Md Wasin Ahmed</strong> architected and engineered the end-to-end <strong>CHARWATCH</strong> Earth observation and river dynamics intelligence platform. Combining microwave Synthetic Aperture Radar (SAR) physics, real-time hydrometric telemetry, and modern geospatial visualization, this platform empowers disaster response teams with predictive foresight along Bangladesh’s most dynamic river systems.
              </p>

              {/* Core Engineering Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-2.5">
                  <Radio className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-mono font-bold text-white block">SAR Radar Pipeline</span>
                    <span className="text-[10px] text-slate-400">NISAR L-band & Sentinel-1 C-band telemetry processing</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-2.5">
                  <Compass className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-mono font-bold text-white block">Geospatial GIS Engine</span>
                    <span className="text-[10px] text-slate-400">Google Maps Platform & InSAR multi-temporal tracking</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-2.5">
                  <Cpu className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-mono font-bold text-white block">AI River Analyst</span>
                    <span className="text-[10px] text-slate-400">Gemini 2.5 Flash autonomous hydrological advisory system</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-2.5">
                  <Layers className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-mono font-bold text-white block">Full-Stack Architecture</span>
                    <span className="text-[10px] text-slate-400">React 19, TypeScript, Vercel Serverless, Tailwind CSS</span>
                  </div>
                </div>
              </div>

              {/* Verified Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-2 text-[10px] font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  ● NASA SPACE APPS CHALLENGE
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  ● BANGLADESH DELTA RESEARCH
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  ● OPEN SCIENCE ARCHITECT
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
