import React, { useState, useEffect } from 'react';
import { useLiveRiverData } from '../hooks/useLiveRiverData';
import {
  Satellite,
  Radio,
  ShieldCheck,
  Compass,
  ArrowUp,
  Activity,
  Layers,
  PhoneCall,
  ExternalLink,
  CheckCircle2,
  Mail,
  Send,
  Sparkles,
  Cpu,
  MapPin,
  Clock,
  Waves,
  Eye,
  FileText,
  Droplets
} from 'lucide-react';
import { CharwatchLogo } from './CharwatchLogo';

interface FooterProps {
  setActiveTab?: (tab: string) => void;
  onOpenAnalyst?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenAnalyst }) => {
  const { stations, basin } = useLiveRiverData();
  // Live Bangladesh Standard Time (BST, UTC+6)
  const [dhakaTime, setDhakaTime] = useState<string>('');
  const [emailInput, setEmailInput] = useState('');
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);
  const [activeStationHover, setActiveStationHover] = useState<string | null>(null);

  // Update live clock every second
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

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setSubscriptionSuccess(true);
    setTimeout(() => {
      setEmailInput('');
    }, 4000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Jamuna-Brahmaputra Monitoring Stations Transect Data
  const riverStations = [
    { id: 'chilmari', name: 'Chilmari', lat: '25.55°N', lon: '89.67°E', risk: 'HIGH', river: 'Upper Jamuna', erosion: '-4.2m/day' },
    { id: 'sariakandi', name: 'Sariakandi', lat: '24.88°N', lon: '89.63°E', risk: 'CRITICAL', river: 'Mid Jamuna', erosion: '-6.8m/day' },
    { id: 'sirajganj', name: 'Sirajganj', lat: '24.45°N', lon: '89.72°E', risk: 'ALERT', river: 'Hardpoint Choke', erosion: '-2.1m/day' },
    { id: 'aricha', name: 'Aricha', lat: '23.83°N', lon: '89.78°E', risk: 'MODERATE', river: 'Padma Confluence', erosion: '+3.4m/day accretion' },
    { id: 'chandpur', name: 'Chandpur', lat: '23.23°N', lon: '90.64°E', risk: 'STABLE', river: 'Meghna Estuary', erosion: 'Tidal Delta Outflow' },
  ];

  return (
    <footer className="relative w-full border-t border-cyan-500/20 bg-[#01040a] text-slate-300 font-sans mt-24 overflow-hidden selection:bg-cyan-500/30">
      
      {/* Subtle Background Glow & Radar Pulse Contour */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/[0.04] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 translate-x-1/2 w-[500px] h-[250px] bg-teal-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

      {/* Artistic Bathymetry / River Horizon Divider Line */}
      <div className="relative w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent">
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded-full bg-[#01040a] border border-cyan-500/30 text-[9px] font-mono tracking-widest text-cyan-400 uppercase">
          ORBITAL SENSING · JAMUNA RIVER BASIN TRANSECT
        </div>
      </div>

      {/* TOP COMPONENT: Jamuna River Geographic Transect Status Bar */}
      <div className="w-full border-b border-slate-900/80 bg-slate-950/60 backdrop-blur-md px-4 py-5">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2.5 text-xs font-mono">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-white font-bold tracking-wider">ACTIVE TRANSECT NETWORK</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">5 Continuous Radar Hydrographic Stations</span>
          </div>

          {/* Interactive Transect Nodes */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {(stations.length > 0 ? stations.slice(0, 5) : riverStations).map((st: any) => {
              const isCrit = st.status === 'SEVERE' || st.status === 'DANGER' || st.risk === 'CRITICAL';
              const isWarn = st.status === 'WARNING' || st.risk === 'HIGH';
              return (
                <button
                  key={st.id}
                  onClick={() => handleTabClick('observatory')}
                  onMouseEnter={() => setActiveStationHover(st.id)}
                  onMouseLeave={() => setActiveStationHover(null)}
                  className={`relative px-3 py-1.5 rounded-lg border font-mono text-[11px] transition-all flex items-center gap-2 ${
                    isCrit
                      ? 'border-rose-500/40 bg-rose-950/20 text-rose-300 hover:border-rose-400'
                      : isWarn
                      ? 'border-amber-500/40 bg-amber-950/20 text-amber-300 hover:border-amber-400'
                      : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-200'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    isCrit ? 'bg-rose-400 animate-pulse' : isWarn ? 'bg-amber-400' : 'bg-cyan-400'
                  }`} />
                  <span className="font-bold">{st.name.split(' ')[0]}</span>
                  <span className="text-[10px] text-slate-400">{st.currentWaterLevelM ? `${st.currentWaterLevelM}m` : st.lat}</span>

                  {/* Floating Tooltip On Hover */}
                  {activeStationHover === st.id && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2.5 bg-slate-950 border border-cyan-400/80 rounded-xl shadow-2xl text-[10px] whitespace-nowrap z-50 pointer-events-none text-left">
                      <div className="font-bold text-cyan-300">{st.name}</div>
                      <div className="text-slate-400">System: {st.riverSystem || st.river} · {st.district || ''}</div>
                      {st.dischargeM3s && (
                        <div className="text-cyan-300 font-semibold mt-0.5">Discharge: {st.dischargeM3s.toLocaleString()} m³/s</div>
                      )}
                      <div className="text-rose-400 font-semibold mt-0.5">
                        {st.dangerLevelM ? `Danger Level: ${st.dangerLevelM}m (Current: ${st.currentWaterLevelM}m)` : `Retreat: ${st.erosion}`}
                      </div>
                      <div className="text-[9px] text-emerald-400 mt-0.5">Click to inspect in Observatory →</div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Live Bangladesh Standard Time Clock */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">DHAKA (BST):</span>
            <span className="text-cyan-300 font-bold tracking-widest">{dhakaTime || '14:45:00 UTC+6'}</span>
          </div>
        </div>
      </div>

      {/* MAIN FOOTER GRID SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* COLUMN 1: Brand & Scientific Mission (Span 4) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              {/* Brand Title with Logo */}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-1.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
                  <CharwatchLogo size="md" animated={false} />
                </div>
                <div>
                  <h3 className="font-brand-title text-base sm:text-lg tracking-tight text-white flex items-center gap-2">
                    CHARWATCH
                    <span className="px-2 py-0.5 rounded text-[8px] font-brand-kicker tracking-wider uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                      OPEN SCIENCE
                    </span>
                  </h3>
                  <p className="text-[9px] font-mono text-slate-400 tracking-wider uppercase">
                    Satellite-Radar Observatory for Bangladesh Chars
                  </p>
                </div>
              </div>

              {/* Mission Narrative */}
              <p className="text-xs text-slate-300 leading-relaxed mb-5 font-sans">
                CharWatch monitors the dynamic morphodynamics of the Jamuna-Brahmaputra river system using dual-polarization synthetic aperture radar (SAR). By penetrating dense monsoon storm clouds, we detect rapid embankment scouring and new char formations to safeguard vulnerable riverine communities.
              </p>

              {/* Scientific Affiliation & Open Badges */}
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-slate-400 mb-6">
                <span className="text-cyan-400">NASA Space Apps Challenge</span>
                <span>·</span>
                <span>Copernicus Sentinel-1</span>
                <span>·</span>
                <span>NISAR L-band SAR</span>
                <span>·</span>
                <span className="text-emerald-400">Open Access</span>
              </div>
            </div>

            {/* Emergency Hotline Banner */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-500/30 shadow-lg">
              <div className="flex items-center gap-2 text-cyan-300 font-mono text-xs font-bold mb-1">
                <PhoneCall className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>BANGLADESH FLOOD & EROSION HOTLINE</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-sans text-slate-300">
                <span>FFWC Emergency Toll-Free IVR:</span>
                <span className="font-mono font-bold text-amber-300 text-sm">DIAL 1090</span>
              </div>
            </div>
          </div>

          {/* COLUMN 2: Radar Observatory & Analysis (Span 2) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-cyan-400 mb-4 flex items-center gap-1.5">
              <Satellite className="w-3.5 h-3.5" />
              <span>OBSERVATORY</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => handleTabClick('observatory')}
                  className="text-slate-300 hover:text-cyan-300 transition-colors text-left flex items-center gap-1.5"
                >
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>Interactive Basin Map</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabClick('radar-lab')}
                  className="text-slate-300 hover:text-cyan-300 transition-colors text-left flex items-center gap-1.5"
                >
                  <Radio className="w-3 h-3 text-slate-400" />
                  <span>SAR Cloud Penetration Lab</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabClick('change')}
                  className="text-slate-300 hover:text-cyan-300 transition-colors text-left flex items-center gap-1.5"
                >
                  <Waves className="w-3 h-3 text-slate-400" />
                  <span>Morphological Change</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabClick('risk')}
                  className="text-slate-300 hover:text-cyan-300 transition-colors text-left flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3 h-3 text-slate-400" />
                  <span>Predictive Risk Engine</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabClick('chars')}
                  className="text-slate-300 hover:text-cyan-300 transition-colors text-left flex items-center gap-1.5"
                >
                  <Layers className="w-3 h-3 text-slate-400" />
                  <span>Char Community Monitor</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabClick('missions')}
                  className="text-slate-300 hover:text-cyan-300 transition-colors text-left flex items-center gap-1.5"
                >
                  <Compass className="w-3 h-3 text-slate-400" />
                  <span>Radar Flight Simulator</span>
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: Scientific Payloads & Tech (Span 3) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-cyan-400 mb-4 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5" />
              <span>SATELLITE SENSORS</span>
            </h4>
            <div className="space-y-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800">
                <div className="font-mono text-[11px] font-bold text-white flex items-center justify-between">
                  <span>NISAR (NASA-ISRO)</span>
                  <span className="text-cyan-400 text-[10px]">L-BAND · 24 cm</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  High-penetration microwave pulse detects soil moisture gradients and submerged scarp shelves.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800">
                <div className="font-mono text-[11px] font-bold text-white flex items-center justify-between">
                  <span>Sentinel-1 (ESA)</span>
                  <span className="text-teal-400 text-[10px]">C-BAND · 5.6 cm</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  12-day repeat orbit for repeat-pass InSAR surface deformation and water boundary delineation.
                </p>
              </div>

              {onOpenAnalyst && (
                <button
                  onClick={onOpenAnalyst}
                  className="w-full mt-2 py-2 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono text-[11px] font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Launch AI River Analyst</span>
                </button>
              )}
            </div>
          </div>

          {/* COLUMN 4: Orbital Dispatch Dispatch Newsletter (Span 3) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-cyan-400 mb-4 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>ORBITAL DISPATCH BULLETINS</span>
            </h4>
            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              Subscribe to 12-day repeat pass displacement bulletins and high-risk bank collapse alerts along the Jamuna River corridor.
            </p>

            {subscriptionSuccess ? (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Subscribed! Orbital bulletins will dispatch to your terminal.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="analyst@earthdata.nasa.gov"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-300 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-1.5 hover:opacity-90 active:scale-98 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>RECEIVE RADAR DISPATCHES</span>
                </button>
              </form>
            )}

            <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>LATENCY: ZERO-COST OPEN DATA</span>
              <span className="text-emerald-400">WMO COMPLIANT</span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM LEGAL & COPYRIGHT STRIP */}
      <div className="w-full border-t border-slate-900 bg-black/60 px-4 sm:px-6 py-6 text-xs font-mono text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Copyright & Tagline */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span className="text-white font-bold tracking-wider">
              © {new Date().getFullYear()} CHARWATCH PROJECT
            </span>
            <span className="hidden sm:inline text-slate-600">·</span>
            <span className="text-slate-400">
              WATCH THE RIVER. DETECT THE CHANGE. PROTECT THE COMMUNITY.
            </span>
          </div>

          {/* Quick Actions & Scroll to top */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleTabClick('data')}
              className="hover:text-cyan-300 transition-colors text-[11px]"
            >
              DATA PROVENANCE
            </button>
            <span className="text-slate-700">·</span>
            <button
              onClick={() => handleTabClick('about')}
              className="hover:text-cyan-300 transition-colors text-[11px]"
            >
              MISSION & TEAM
            </button>
            <span className="text-slate-700">·</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-500/20 text-cyan-400 border border-slate-800 hover:border-cyan-500/40 transition-all text-[11px]"
              title="Return to top of page"
            >
              <span>TOP</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
