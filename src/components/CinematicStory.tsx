import React from 'react';
import { Satellite, Radio, Clock, ShieldCheck, Heart } from 'lucide-react';

export const CinematicStory: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'FROM ORBIT WE WATCH.',
      desc: '747 kilometers above Earth, dual-frequency SAR radar sensors orbit continuously.',
      icon: <Satellite className="w-8 h-8 text-cyan-400" />,
    },
    {
      num: '02',
      title: 'FROM RADAR WE DETECT.',
      desc: 'Microwave pulses pass through monsoon clouds to map sub-surface moisture and soil shear lines.',
      icon: <Radio className="w-8 h-8 text-teal-400" />,
    },
    {
      num: '03',
      title: 'FROM CHANGE WE UNDERSTAND.',
      desc: 'Multi-year coherence tracking reveals subtle bank shifting before catastrophic collapse.',
      icon: <Clock className="w-8 h-8 text-amber-400" />,
    },
    {
      num: '04',
      title: 'FROM INFORMATION WE PREPARE.',
      desc: 'Clear, color-coded early warnings empower local Union Parishads to pre-position shelters.',
      icon: <ShieldCheck className="w-8 h-8 text-rose-400" />,
    },
  ];

  return (
    <section className="w-full max-w-6xl mx-auto py-20 px-4">
      
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-semibold">
          THE RIVERGUARD MISSION STORY
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1 font-display">
          FROM SPACE TO COMMUNITY
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step) => (
          <div
            key={step.num}
            className="p-6 rounded-2xl glass-panel border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-extrabold font-mono text-cyan-400">{step.num}</span>
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                  {step.icon}
                </div>
              </div>

              <h3 className="text-lg font-bold text-white font-display leading-snug">{step.title}</h3>
              <p className="text-xs text-slate-300 mt-3 leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Final Callout Banner */}
      <div className="mt-12 p-8 text-center glass-panel-cyan rounded-3xl border border-cyan-500/40 max-w-3xl mx-auto">
        <h3 className="text-2xl font-extrabold text-white font-display">
          FROM SPACE TO COMMUNITY.
        </h3>
        <p className="text-xs font-mono text-cyan-300 mt-2">
          Protecting Bangladesh riverine lives through open Earth observation intelligence.
        </p>
      </div>
    </section>
  );
};
