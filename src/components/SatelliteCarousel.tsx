import React, { useState, useRef } from 'react';
import { Radio, Orbit, Waves, Clock, ShieldCheck, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

interface CarouselCard {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  specs: { label: string; val: string }[];
  accentColor: string;
}

export const SatelliteCarousel: React.FC = () => {
  const cards: CarouselCard[] = [
    {
      id: 'nisar',
      tag: 'L-BAND RADAR',
      title: 'NISAR SATELLITE',
      subtitle: 'NASA-ISRO Dual-Frequency SAR',
      description: 'L-Band (24 cm wavelength) penetrates dense monsoonal vegetation and soil surface to map moisture saturation and deep riverbank shear lines.',
      icon: <Radio className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />,
      specs: [
        { label: 'WAVELENGTH', val: '24 cm (1.25 GHz)' },
        { label: 'REVISIT', val: '12 Days' },
        { label: 'RESOLUTION', val: '3 - 10 Meters' },
        { label: 'PENETRATION', val: 'High Canopy & Soil' },
      ],
      accentColor: 'from-cyan-500/20 to-blue-600/10 border-cyan-500/40 text-cyan-400',
    },
    {
      id: 'sentinel1',
      tag: 'C-BAND RADAR',
      title: 'SENTINEL-1',
      subtitle: 'Copernicus Constellation',
      description: 'C-Band (5.6 cm wavelength) provides high-frequency backscatter to extract precise land-water boundary contours and monitor short-term erosion.',
      icon: <Orbit className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400" />,
      specs: [
        { label: 'WAVELENGTH', val: '5.6 cm (5.4 GHz)' },
        { label: 'REVISIT', val: '6 Days' },
        { label: 'POLARIZATION', val: 'VV + VH Dual' },
        { label: 'COVERAGE', val: 'Global Basin' },
      ],
      accentColor: 'from-amber-500/20 to-yellow-600/10 border-amber-500/40 text-amber-400',
    },
    {
      id: 'hydrology',
      tag: 'HYDROLOGICAL CONTEXT',
      title: 'RIVER LEVEL & ALTIMETRY',
      subtitle: 'BWDB & SWOT Altimetry Data',
      description: 'Ingests real-time river stage heights, water discharge velocity, and SWOT satellite water surface elevation to contextualize erosion forces.',
      icon: <Waves className="w-6 h-6 sm:w-8 sm:h-8 text-teal-400" />,
      specs: [
        { label: 'SWOT SATELLITE', val: 'Ka-RIn Radar' },
        { label: 'GAUGE NETWORK', val: 'BWDB In-situ' },
        { label: 'PARAMETER', val: 'Water Stage (m)' },
        { label: 'METRIC', val: 'Flow Shear Force' },
      ],
      accentColor: 'from-teal-500/20 to-emerald-600/10 border-teal-500/40 text-teal-400',
    },
    {
      id: 'temporal',
      tag: 'TEMPORAL ANALYSIS',
      title: 'LAND CHANGE DETECTION',
      subtitle: 'Multi-Temporal Interferometry',
      description: 'Compares radar coherence and backscatter intensity across multi-year time series (T0 to T4) to track bank migration vectors.',
      icon: <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />,
      specs: [
        { label: 'TIME SERIES', val: '2015 - 2026' },
        { label: 'METRIC', val: 'Coherence Decay' },
        { label: 'ACCURACY', val: '± 15 Meters' },
        { label: 'INDICATOR', val: 'Bank Migration (m)' },
      ],
      accentColor: 'from-purple-500/20 to-indigo-600/10 border-purple-500/40 text-purple-400',
    },
    {
      id: 'action',
      tag: 'ACTION LAYER',
      title: 'COMMUNITY & ALERTING',
      subtitle: 'From Orbit to Local Action',
      description: 'Translates high-dimensional radar telemetry into simple color-coded early warnings and field preparedness guidelines for local Union Parishads.',
      icon: <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-rose-400" />,
      specs: [
        { label: 'RECIPIENTS', val: 'Local Authorities' },
        { label: 'OUTPUT', val: 'Advisory / Warning' },
        { label: 'FORMAT', val: 'Interactive / SMS' },
        { label: 'IMPACT', val: 'Proactive Evacuation' },
      ],
      accentColor: 'from-rose-500/20 to-pink-600/10 border-rose-500/40 text-rose-400',
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number>(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) {
      handleNext();
    } else if (diff < -40) {
      handlePrev();
    }
  };

  return (
    <section 
      className="w-full max-w-7xl mx-auto py-12 sm:py-16 px-3 sm:px-4 overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-10 gap-3">
        <div>
          <span className="text-[10px] sm:text-xs font-mono tracking-widest text-cyan-400 uppercase font-semibold">
            ORBITAL DATA PIPELINE
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1 font-display">
            SATELLITE & SENSOR SUITE
          </h2>
        </div>

        {/* Carousel Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3 self-end sm:self-auto">
          <button
            onClick={handlePrev}
            className="p-2 sm:p-2.5 rounded-full glass-panel border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-400 transition-all shadow-lg active:scale-95 min-w-[36px] min-h-[36px] flex items-center justify-center"
            aria-label="Previous satellite card"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <span className="text-xs font-mono text-slate-400">
            0{activeIndex + 1} / 0{cards.length}
          </span>

          <button
            onClick={handleNext}
            className="p-2 sm:p-2.5 rounded-full glass-panel border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-400 transition-all shadow-lg active:scale-95 min-w-[36px] min-h-[36px] flex items-center justify-center"
            aria-label="Next satellite card"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* 3D Perspective Orbital Carousel View */}
      {/* On mobile: shows active card large + indicators; on tablet/desktop: 3-column view */}
      <div className="hidden md:grid md:grid-cols-3 gap-6 relative">
        {cards.map((card, idx) => {
          const isActive = idx === activeIndex;

          return (
            <div
              key={card.id}
              onClick={() => setActiveIndex(idx)}
              className={`p-5 sm:p-6 rounded-2xl cursor-pointer transition-all duration-500 bg-gradient-to-br ${card.accentColor} glass-panel border ${
                isActive
                  ? 'scale-105 shadow-[0_0_30px_rgba(6,182,212,0.25)] border-cyan-400/80 ring-1 ring-cyan-400/30'
                  : 'opacity-70 hover:opacity-100 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono tracking-widest px-2.5 py-1 rounded bg-slate-900/80 border border-slate-700 uppercase font-bold text-slate-200">
                  {card.tag}
                </span>
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  {card.icon}
                </div>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white font-display">{card.title}</h3>
              <p className="text-xs font-mono text-slate-300 mt-0.5">{card.subtitle}</p>

              <p className="text-xs text-slate-300 mt-3 leading-relaxed min-h-[55px]">
                {card.description}
              </p>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-800/80 text-[10px] sm:text-[11px] font-mono">
                {card.specs.map((spec, sIdx) => (
                  <div key={sIdx}>
                    <span className="text-slate-400 block text-[9px] uppercase">{spec.label}</span>
                    <span className="text-slate-100 font-semibold">{spec.val}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Focused Carousel View (Touch Swipeable & Super Compact) */}
      <div className="md:hidden relative">
        {(() => {
          const card = cards[activeIndex];
          return (
            <div
              key={card.id}
              className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-br ${card.accentColor} glass-panel border border-cyan-400/80 shadow-[0_0_25px_rgba(6,182,212,0.2)] animate-in fade-in duration-300`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono tracking-widest px-2.5 py-0.5 rounded bg-slate-900/80 border border-slate-700 uppercase font-bold text-slate-200">
                  {card.tag}
                </span>
                <div className="p-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  {card.icon}
                </div>
              </div>

              <h3 className="text-lg font-bold text-white font-display">{card.title}</h3>
              <p className="text-[11px] font-mono text-slate-300">{card.subtitle}</p>

              <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                {card.description}
              </p>

              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-[10px] font-mono">
                {card.specs.map((spec, sIdx) => (
                  <div key={sIdx} className="bg-slate-900/40 p-1.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[9px] uppercase">{spec.label}</span>
                    <span className="text-slate-100 font-semibold truncate block">{spec.val}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center items-center gap-2 mt-6 sm:mt-8">
        {cards.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`h-1.5 rounded-full transition-all min-h-[6px] ${
              idx === activeIndex ? 'w-8 bg-cyan-400' : 'w-2 bg-slate-700 hover:bg-slate-500'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
