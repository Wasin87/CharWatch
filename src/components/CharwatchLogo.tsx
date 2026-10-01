import React from 'react';

interface CharwatchLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
}

export const CharwatchLogo: React.FC<CharwatchLogoProps> = ({ 
  size = 'md', 
  animated = true,
  className = '' 
}) => {
  const sizeMap = {
    sm: { box: 32, icon: 'w-8 h-8' },
    md: { box: 40, icon: 'w-10 h-10' },
    lg: { box: 54, icon: 'w-14 h-14' },
    xl: { box: 72, icon: 'w-18 h-18' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${currentSize.icon} ${className}`}>
      {/* Ambient Pulsing Aura Glow */}
      <div className={`absolute inset-0 rounded-2xl bg-cyan-500/20 blur-md ${animated ? 'animate-pulse' : ''}`} />

      {/* SVG Emblem */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 filter drop-shadow-[0_0_12px_rgba(6,182,212,0.65)]"
      >
        <defs>
          {/* Futuristic Holographic Gradients */}
          <linearGradient id="logoOrbGrad" x1="10%" y1="10%" x2="90%" y2="90%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#082f49" />
          </linearGradient>

          <linearGradient id="logoRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>

          <linearGradient id="logoRiverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="50%" stopColor="#a5f3fc" />
            <stop offset="100%" stopColor="#2dd4bf" />
          </linearGradient>

          <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Outer Cosmic Radar Grid / Calibration Marks */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="rgba(6, 182, 212, 0.25)"
          strokeWidth="1.2"
          strokeDasharray="4 4"
        />
        <circle
          cx="50"
          cy="50"
          r="38"
          stroke="rgba(56, 189, 248, 0.15)"
          strokeWidth="1"
        />

        {/* 2. Tilted Elliptical SAR Orbital Trajectory Ring */}
        <ellipse
          cx="50"
          cy="50"
          rx="42"
          ry="17"
          transform="rotate(-28 50 50)"
          stroke="url(#logoRingGrad)"
          strokeWidth="2.4"
          strokeLinecap="round"
          filter="url(#glowEffect)"
          className={animated ? 'origin-center animate-[spin_12s_linear_infinite]' : ''}
        />

        {/* 3. Central Celestial Planetary Globe */}
        <circle
          cx="50"
          cy="50"
          r="24"
          fill="url(#logoOrbGrad)"
          stroke="rgba(56, 189, 248, 0.5)"
          strokeWidth="1.5"
        />

        {/* 4. River Meander Flow Cutting Across the Planet (Bengal River Geometry) */}
        <path
          d="M 32 36 Q 44 48, 50 44 T 68 62"
          fill="none"
          stroke="url(#logoRiverGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
          filter="url(#glowEffect)"
        />

        {/* Secondary River Tributary & Sandbar Formation */}
        <path
          d="M 46 47 Q 56 54, 62 44"
          fill="none"
          stroke="#fed7aa"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Newly Formed "Char" Island Inside River */}
        <ellipse
          cx="52"
          cy="48"
          rx="4"
          ry="2"
          transform="rotate(-15 52 48)"
          fill="#fef08a"
          stroke="#f59e0b"
          strokeWidth="0.8"
        />

        {/* 5. Orbiting Radar Satellite Beacons */}
        <circle
          cx="78"
          cy="34"
          r="3.2"
          fill="#ffffff"
          filter="url(#glowEffect)"
        />
        <circle
          cx="78"
          cy="34"
          r="6"
          stroke="#22d3ee"
          strokeWidth="1.2"
          className={animated ? 'animate-ping' : ''}
        />

        <circle
          cx="22"
          cy="66"
          r="2.5"
          fill="#f59e0b"
        />

        {/* 6. Targeting Reticle Corner Accents */}
        <path d="M 50 4 L 50 12" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
        <path d="M 50 88 L 50 96" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
        <path d="M 4 50 L 12 50" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
        <path d="M 88 50 L 96 50" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
};
