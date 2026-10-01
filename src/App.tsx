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
import { ArrowRight, Satellite, Radio, ShieldCheck, Sparkles, Cpu, Compass } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isAnalystOpen, setIsAnalystOpen] = useState(false);
  const [selectedRegionForAI, setSelectedRegionForAI] = useState<RiverRegion | undefined>(undefined);

  const handleOpenAnalystForRegion = (region: RiverRegion) => {
    setSelectedRegionForAI(region);
    setIsAnalystOpen(true);
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
        setActiveTab={setActiveTab}
        onOpenAnalyst={() => setIsAnalystOpen(true)}
      />

      {/* MAIN CONTENT AREA (Offset for fixed top navbar) */}
      <main className="relative z-10 pt-[58px] sm:pt-[66px]">
        
        {/* TAB 1: HOME PAGE */}
        {activeTab === 'home' && (
          <div className="space-y-10 sm:space-y-14">
            
            {/* HERO SECTION (Compact on mobile) */}
            <section className="relative flex flex-col items-center justify-center pt-2 sm:pt-6 text-center overflow-hidden">
              
              <div className="max-w-4xl mx-auto px-3 sm:px-4 flex flex-col items-center">
                {/* Micro Tagline Kicker */}
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full glass-panel border border-cyan-500/30 text-cyan-400 text-[9px] sm:text-xs font-mono tracking-widest uppercase mb-2.5 sm:mb-4 shadow-[0_0_15px_rgba(6,182,212,0.15)] animate-fade-in max-w-[95%]">
                  <Satellite className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">SEE WHAT THE CLOUDS HIDE · NASA SPACE APPS PROJECT</span>
                </div>

                {/* Main Brand Title with Unique Professional High-Tech Typography */}
                <h1 className="text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-brand-hero text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-400 tracking-tight leading-none mb-2 sm:mb-3 filter drop-shadow-[0_10px_35px_rgba(6,182,212,0.45)] select-none">
                  CHARWATCH
                </h1>

                {/* Main Tagline */}
                <div className="text-xs xs:text-sm sm:text-xl md:text-2xl font-extrabold tracking-wide font-display text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-200 max-w-4xl mx-auto mb-1.5 sm:mb-3 px-2">
                  WATCH THE RIVER. DETECT THE CHANGE. PROTECT THE COMMUNITY.
                </div>

                <span className="text-[10px] sm:text-xs font-mono tracking-widest text-slate-400 uppercase font-semibold block mb-2 sm:mb-3">
                  FROM ORBIT TO ACTION.
                </span>

                <p className="text-[11px] sm:text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans mb-4 sm:mb-6 px-3">
                  Satellite-radar intelligence for understanding Bangladesh’s changing river landscape, erosion dynamics, and newly formed chars.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 z-20 mb-3 sm:mb-5 w-full max-w-md px-2">
                  <button
                    onClick={() => setActiveTab('observatory')}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-300 text-slate-950 font-bold font-mono text-[10px] sm:text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:from-cyan-300 hover:to-teal-200 transition-all hover:scale-105 active:scale-95 min-h-[38px] sm:min-h-[42px]"
                  >
                    <span>ENTER OBSERVATORY</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>

                  <button
                    onClick={() => setActiveTab('change')}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-xl glass-panel border border-slate-700 hover:border-cyan-400 text-cyan-300 font-mono text-[10px] sm:text-xs uppercase tracking-wider transition-all hover:bg-slate-800/80 active:scale-95 min-h-[38px] sm:min-h-[42px]"
                  >
                    <Compass className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />
                    <span>EXPLORE BANGLADESH</span>
                  </button>
                </div>
              </div>

              {/* FULL-WIDTH REALISTIC PLANET & GALAXY ANIMATION STAGE */}
              <div className="w-full">
                <EarthGlobe
                  onSelectBangladesh={() => setActiveTab('observatory')}
                />
              </div>
            </section>

            {/* MONSOON BLINDSPOT SECTION */}
            <MonsoonBlindspot />

            {/* SATELLITE CAROUSEL */}
            <SatelliteCarousel />

            {/* CINEMATIC STORY SECTION */}
            <CinematicStory />

            {/* MISSION GAME (HOME PAGE PLAYABLE) */}
            <MissionGame onOpenObservatory={() => setActiveTab('observatory')} />

            {/* EARLY WARNING WORKFLOWS PREVIEW */}
            <EarlyWarning />
          </div>
        )}

        {/* TAB 2: OBSERVATORY */}
        {activeTab === 'observatory' && (
          <RiverMap onSelectRegionForAnalyst={handleOpenAnalystForRegion} />
        )}

        {/* TAB 3: RADAR LAB */}
        {activeTab === 'radar-lab' && <RadarLab />}

        {/* TAB 4: CHANGE DETECTION */}
        {activeTab === 'change' && <ChangeDetection />}

        {/* TAB 5: RISK ENGINE */}
        {activeTab === 'risk' && <RiskEngine />}

        {/* TAB 6: CHAR MONITOR */}
        {activeTab === 'chars' && <CharMonitor />}

        {/* TAB 7: MISSION GAME */}
        {activeTab === 'missions' && (
          <MissionGame onOpenObservatory={() => setActiveTab('observatory')} />
        )}

        {/* TAB 8: DATA PROVENANCE */}
        {activeTab === 'data' && <DataProvenance />}

        {/* TAB 9: ABOUT MISSION */}
        {activeTab === 'about' && <AboutMission />}

      </main>

      {/* AI RIVER ANALYST FLOATING DRAWER */}
      <AIAnalyst
        isOpen={isAnalystOpen}
        onClose={() => setIsAnalystOpen(false)}
        activeRegion={selectedRegionForAI}
      />

      {/* FOOTER */}
      <Footer
        setActiveTab={setActiveTab}
        onOpenAnalyst={() => setIsAnalystOpen(true)}
      />

      {/* UNIQUE CELESTIAL GROHO (PLANET) SCROLL TO TOP */}
      <GrohoScrollTop />
    </div>
  );
}
