import React, { useState, useEffect } from 'react';
import {
  Satellite,
  Radio,
  ShieldCheck,
  Compass,
  ArrowUp,
  Clock,
  PhoneCall,
  Sparkles,
  Layers,
  Database,
  Info,
} from 'lucide-react';
import { CharwatchLogo } from './CharwatchLogo';

interface FooterProps {
  setActiveTab?: (tab: string) => void;
  onOpenAnalyst?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenAnalyst }) => {
  // Live Bangladesh Standard Time (BST, UTC+6)
  const [dhakaTime, setDhakaTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Dhaka',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      setDhakaTime(new Intl.DateTimeFormat('en-GB', options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTabClick = (tab: string) => {
    if (setActiveTab) {
      setActiveTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative w-full border-t border-cyan-500/20 bg-[#01040a] text-slate-300 font-sans mt-12 overflow-hidden">
      
      {/* Subtle Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[100px] bg-cyan-500/[0.04] rounded-full blur-[90px] pointer-events-none" />

      {/* Main Compact Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* Brand & Mission */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left">
            <div className="p-2 rounded-xl bg-cyan-950/40 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)] shrink-0">
              <CharwatchLogo size="sm" animated={false} />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h3 className="font-brand-title text-base sm:text-lg text-white tracking-tight">
                  CHARWATCH
                </h3>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono tracking-wider uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold">
                  NASA SPACE APPS
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-md font-sans leading-snug">
                Satellite-radar early warning & char dynamics observatory for Bangladesh river systems.
              </p>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-mono text-slate-400">
            <button
              onClick={() => handleTabClick('observatory')}
              className="hover:text-cyan-300 transition-colors"
            >
              OBSERVATORY
            </button>
            <button
              onClick={() => handleTabClick('radar-lab')}
              className="hover:text-cyan-300 transition-colors"
            >
              RADAR LAB
            </button>
            <button
              onClick={() => handleTabClick('change')}
              className="hover:text-cyan-300 transition-colors"
            >
              CHANGE DETECTION
            </button>
            <button
              onClick={() => handleTabClick('risk')}
              className="hover:text-cyan-300 transition-colors"
            >
              RISK ENGINE
            </button>
            <button
              onClick={() => handleTabClick('chars')}
              className="hover:text-cyan-300 transition-colors"
            >
              CHAR MONITOR
            </button>
            <button
              onClick={() => handleTabClick('data')}
              className="hover:text-cyan-300 transition-colors"
            >
              OPEN DATA
            </button>
            <button
              onClick={() => handleTabClick('about')}
              className="hover:text-cyan-300 transition-colors"
            >
              ABOUT
            </button>
          </div>

          {/* Right Utility: Time, Hotline & AI Launch */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono">
            {/* Live Clock */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[11px] text-slate-400">BST:</span>
              <span className="text-[11px] text-cyan-300 font-bold">{dhakaTime || '14:45 UTC+6'}</span>
            </div>

            {/* Emergency Hotline */}
            <a
              href="tel:1090"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-950/30 border border-rose-500/30 text-rose-300 hover:border-rose-400 transition-all text-[11px]"
              title="FFWC Flood & Disaster Emergency Hotline"
            >
              <PhoneCall className="w-3 h-3 text-rose-400 animate-pulse" />
              <span>IVR 1090</span>
            </a>

            {/* AI Analyst Trigger */}
            {onOpenAnalyst && (
              <button
                onClick={onOpenAnalyst}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[11px] font-bold transition-all shadow-[0_0_10px_rgba(6,182,212,0.2)]"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>AI ANALYST</span>
              </button>
            )}

            {/* Scroll to Top */}
            <button
              onClick={scrollToTop}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 border border-slate-800 transition-all"
              title="Scroll to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Compact Bottom Legal / Attribution Strip */}
      <div className="w-full border-t border-slate-900 bg-black/70 px-4 py-3 text-[11px] font-mono text-slate-500 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © {new Date().getFullYear()} CHARWATCH · OPEN SCIENCE EARTH OBSERVATION FOR BANGLADESH
          </span>
          <span className="text-slate-400">
            NISAR L-BAND · SENTINEL-1 C-BAND · BWDB TELEMETRY
          </span>
        </div>
      </div>

    </footer>
  );
};
