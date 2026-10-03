import React, { useState } from 'react';
import { Menu, X, ArrowRight, ShieldAlert, Cpu } from 'lucide-react';
import { CharwatchLogo } from './CharwatchLogo';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAnalyst: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab, onOpenAnalyst }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'HOME' },
    { id: 'observatory', label: 'OBSERVATORY' },
    { id: 'radar-lab', label: 'RADAR LAB' },
    { id: 'change', label: 'CHANGE' },
    { id: 'risk', label: 'RISK' },
    { id: 'chars', label: 'CHARS' },
    { id: 'missions', label: 'MISSIONS' },
    { id: 'data', label: 'DATA' },
    { id: 'about', label: 'ABOUT' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full glass-panel border-b border-cyan-500/20 px-3 sm:px-6 md:px-8 py-2 sm:py-2.5 transition-all duration-300 backdrop-blur-xl bg-[#020408]/90 shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Zone 1: Unique Aesthetic Logo & Futuristic Brand Name */}
        <div 
          onClick={() => handleNavClick('home')} 
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
        >
          {/* Aesthetic Vector Logo Emblem */}
          <div className="p-0.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all">
            <CharwatchLogo size="sm" animated={true} />
          </div>

          {/* Aesthetic Brand Name with Futuristic Gradient & Crisp Geometric Typography */}
          <div className="flex flex-col">
            <span className="font-brand-title text-lg sm:text-xl tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-white group-hover:from-cyan-100 group-hover:to-cyan-300 transition-all filter drop-shadow-[0_0_12px_rgba(6,182,212,0.45)]">
              RiverGuard
            </span>
            <span className="text-[8px] sm:text-[9px] font-brand-kicker tracking-wider text-slate-400 uppercase -mt-0.5 hidden xs:inline-block flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block" />
              <span>SATELLITE RADAR OBSERVATORY</span>
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-1.5 text-xs font-mono tracking-wider transition-all rounded-md whitespace-nowrap ${
                  isActive
                    ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 font-semibold shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions (AI Analyst & Observatory CTA) */}
        <div className="hidden sm:flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenAnalyst}
            className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 text-xs font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 hover:border-cyan-400 transition-all min-h-[36px]"
            title="Open AI River Analyst"
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">AI ANALYST</span>
          </button>

          <button
            onClick={() => handleNavClick('observatory')}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-1.5 text-xs font-semibold tracking-wide text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 rounded-lg hover:from-cyan-300 hover:to-teal-200 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all whitespace-nowrap min-h-[36px]"
          >
            <span>OBSERVATORY</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Header Quick Actions */}
        <div className="flex lg:hidden items-center gap-1.5">
          <button
            onClick={onOpenAnalyst}
            className="p-2 text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 rounded-lg sm:hidden min-w-[40px] min-h-[40px] flex items-center justify-center active:scale-95 transition-transform"
            aria-label="AI Analyst"
          >
            <Cpu className="w-4 h-4" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white bg-slate-800/80 rounded-lg border border-slate-700 min-w-[40px] min-h-[40px] flex items-center justify-center active:scale-95 transition-transform"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Glass Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-slate-800 flex flex-col gap-2 pb-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-2.5 text-left text-xs font-mono tracking-wider rounded-xl min-h-[42px] flex items-center ${
                  activeTab === item.id
                    ? 'text-cyan-300 bg-cyan-500/20 border border-cyan-500/40 font-bold'
                    : 'text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800/80">
            <button
              onClick={() => handleNavClick('observatory')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold font-mono tracking-wider text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 rounded-xl shadow-lg min-h-[44px]"
            >
              <span>ENTER OBSERVATORY</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
