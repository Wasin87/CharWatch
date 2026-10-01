import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { SpaceBackground } from './components/SpaceBackground';
import { CosmicPreloader } from './components/CosmicPreloader';
import { EarthGlobe } from './components/EarthGlobe';
import { GrohoScrollTop } from './components/GrohoScrollTop';
import { MonsoonBlindspot } from './components/MonsoonBlindspot';
import { SatelliteCarousel } from './components/SatelliteCarousel';
import { RiverMap } from './components/RiverMap';
import { RadarLab } from './components/RadarLab';
import { ChangeDetection } from './components/ChangeDetection';
import { RiskEngine } from './components/RiskEngine';
import { EarlyWarning } from './components/EarlyWarning';
import { CharMonitor } from './components/CharMonitor';
import { MissionGame } from './components/MissionGame';
import { AIAnalyst } from './components/AIAnalyst';
import { DataProvenance } from './components/DataProvenance';
import { AboutMission } from './components/AboutMission';
import { CinematicStory } from './components/CinematicStory';
import { Footer } from './components/Footer';
import { RiverRegion } from './types/charwatch';
import {
  ArrowRight,
  Satellite,
  Radio,
  ShieldCheck,
  Sparkles,
  Cpu,
  Compass,
  MapPin,
  Waves,
  Activity,
  Layers,
  Clock,
  ShieldAlert,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isAnalystOpen, setIsAnalystOpen] = useState(false);
  const [selectedRegionForAI, setSelectedRegionForAI] = useState<RiverRegion | undefined>(undefined);

  const handleOpenAnalystForRegion = (region: RiverRegion) => {
    setSelectedRegionForAI(region);
    setIsAnalystOpen(true);
  };

  const handleTabSwitch = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen text-slate-100 bg-[#020408] selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      
      {/* INITIAL OPENING COSMIC PRELOADER */}
      <CosmicPreloader />

      {/* Animated Deep Space Canvas Starfield */}
      <SpaceBackground />

      {/* Floating Glass Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={handleTabSwitch}
        onOpenAnalyst={() => setIsAnalystOpen(true)}
      />

      {/* MAIN CONTENT AREA (Offset for fixed top navbar) */}
      <main className="relative z-10 pt-[52px] sm:pt-[64px]">
        
        {/* TAB 1: HOME PAGE */}
        {activeTab === 'home' && (
          <div className="space-y-6 sm:space-y-12">
            
            {/* HERO SECTION (Fully Compact & Responsive for Mobile) */}
            <section className="relative flex flex-col items-center justify-center pt-2 sm:pt-4 text-center overflow-hidden px-2 sm:px-4">
              
              <div className="max-w-4xl mx-auto flex flex-col items-center">
                {/* Micro Tagline Kicker */}
                <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full glass-panel border border-cyan-500/30 text-cyan-400 text-[8px] xs:text-[9px] sm:text-xs font-mono tracking-widest uppercase mb-1.5 sm:mb-3 shadow-[0_0_15px_rgba(6,182,212,0.15)] animate-fade-in max-w-[98%]">
                  <Satellite className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">SEE WHAT THE CLOUDS HIDE · NASA SPACE APPS PROJECT</span>
                </div>

                {/* Main Brand Title with Unique Professional High-Tech Typography */}
                <h1 className="text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-brand-hero text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-400 tracking-tight leading-none mb-1.5 sm:mb-2.5 filter drop-shadow-[0_8px_30px_rgba(6,182,212,0.4)] select-none">
                  CHARWATCH
                </h1>

                {/* Main Tagline */}
                <div className="text-[11px] xs:text-xs sm:text-lg md:text-xl font-extrabold tracking-wide font-display text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-200 max-w-3xl mx-auto mb-1 sm:mb-2 px-1">
                  WATCH THE RIVER. DETECT THE CHANGE. PROTECT THE COMMUNITY.
                </div>

                <span className="text-[9px] sm:text-xs font-mono tracking-wider text-slate-400 uppercase font-semibold block mb-1.5 sm:mb-2.5">
                  FROM ORBIT TO ACTION.
                </span>

                <p className="text-[10px] xs:text-[11px] sm:text-xs md:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed font-sans mb-3 sm:mb-5 px-2">
                  Satellite-radar intelligence for understanding Bangladesh’s changing river landscape, erosion dynamics, and newly formed chars.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 z-20 mb-2 sm:mb-4 w-full max-w-md px-1">
                  <button
                    onClick={() => handleTabSwitch('observatory')}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-300 text-slate-950 font-bold font-mono text-[9px] xs:text-[10px] sm:text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:from-cyan-300 hover:to-teal-200 transition-all active:scale-95 min-h-[36px] sm:min-h-[40px]"
                  >
                    <span>ENTER OBSERVATORY</span>
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>

                  <button
                    onClick={() => handleTabSwitch('change')}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl glass-panel border border-slate-700 hover:border-cyan-400 text-cyan-300 font-mono text-[9px] xs:text-[10px] sm:text-xs uppercase tracking-wider transition-all hover:bg-slate-800/80 active:scale-95 min-h-[36px] sm:min-h-[40px]"
                  >
                    <Compass className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400" />
                    <span>EXPLORE DELTA</span>
                  </button>
                </div>
              </div>

              {/* FULL-WIDTH REALISTIC PLANET & GALAXY ANIMATION STAGE (Compact for mobile) */}
              <div className="w-full">
                <EarthGlobe
                  onSelectBangladesh={() => handleTabSwitch('observatory')}
                />
              </div>

              {/* QUICK MOBILE MODULE TILES HUB */}
              <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 mt-2 sm:mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-left">
                {[
                  {
                    id: 'observatory',
                    title: 'RIVER OBSERVATORY',
                    subtitle: 'Live BWDB & GIS Map',
                    icon: MapPin,
                    color: 'text-cyan-400',
                    border: 'border-cyan-500/30',
                  },
                  {
                    id: 'radar-lab',
                    title: 'RADAR LAB',
                    subtitle: 'Dual-Band SAR Physics',
                    icon: Radio,
                    color: 'text-amber-400',
                    border: 'border-amber-500/30',
                  },
                  {
                    id: 'change',
                    title: 'CHANGE DETECTION',
                    subtitle: 'Multi-Year Retreat GIS',
                    icon: Clock,
                    color: 'text-rose-400',
                    border: 'border-rose-500/30',
                  },
                  {
                    id: 'risk',
                    title: 'RISK ENGINE',
                    subtitle: 'Hydrometric Alert Index',
                    icon: ShieldAlert,
                    color: 'text-emerald-400',
                    border: 'border-emerald-500/30',
                  },
                ].map((tile) => {
                  const Icon = tile.icon;
                  return (
                    <button
                      key={tile.id}
                      onClick={() => handleTabSwitch(tile.id)}
                      className={`p-2.5 sm:p-3.5 rounded-2xl glass-panel ${tile.border} hover:border-cyan-400 transition-all flex flex-col justify-between text-left group active:scale-95`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Icon className={`w-4 h-4 ${tile.color}`} />
                        <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-300 transition-colors" />
                      </div>
                      <div>
                        <span className="font-mono text-[10px] sm:text-xs font-bold text-white block">
                          {tile.title}
                        </span>
                        <span className="font-sans text-[9px] sm:text-[10px] text-slate-400">
                          {tile.subtitle}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* MONSOON BLINDSPOT SECTION */}
            <MonsoonBlindspot />

            {/* SATELLITE CAROUSEL */}
            <SatelliteCarousel />

            {/* CINEMATIC STORY SECTION */}
            <CinematicStory />
          </div>
        )}

        {/* TAB 2: OBSERVATORY */}
        {activeTab === 'observatory' && (
          <div className="space-y-6 sm:space-y-10">
            <RiverMap onSelectRegionForAnalyst={handleOpenAnalystForRegion} />
          </div>
        )}

        {/* TAB 3: RADAR LAB */}
        {activeTab === 'radar-lab' && (
          <div className="space-y-6 sm:space-y-10">
            <RadarLab />
          </div>
        )}

        {/* TAB 4: CHANGE DETECTION */}
        {activeTab === 'change' && (
          <div className="space-y-6 sm:space-y-10">
            <ChangeDetection />
          </div>
        )}

        {/* TAB 5: RISK ENGINE & EARLY WARNING */}
        {activeTab === 'risk' && (
          <div className="space-y-6 sm:space-y-10">
            <RiskEngine />
            <EarlyWarning />
          </div>
        )}

        {/* TAB 6: CHAR MONITOR */}
        {activeTab === 'chars' && (
          <div className="space-y-6 sm:space-y-10">
            <CharMonitor />
          </div>
        )}

        {/* TAB 7: MISSIONS & ORBITAL GAME */}
        {activeTab === 'missions' && (
          <div className="space-y-6 sm:space-y-10">
            <MissionGame onOpenObservatory={() => handleTabSwitch('observatory')} />
          </div>
        )}

        {/* TAB 8: DATA PROVENANCE */}
        {activeTab === 'data' && (
          <div className="space-y-6 sm:space-y-10">
            <DataProvenance />
          </div>
        )}

        {/* TAB 9: ABOUT MISSION */}
        {activeTab === 'about' && (
          <div className="space-y-6 sm:space-y-10">
            <AboutMission />
          </div>
        )}
      </main>

      {/* AI RIVER ANALYST SLIDE-OVER DRAWER */}
      <AIAnalyst
        isOpen={isAnalystOpen}
        onClose={() => setIsAnalystOpen(false)}
        activeRegion={selectedRegionForAI}
      />

      {/* BACK TO TOP BUTTON */}
      <GrohoScrollTop />

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
