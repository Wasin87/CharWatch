import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp, Sparkles, Orbit } from 'lucide-react';

export const GrohoScrollTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const isHoveredRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Synchronize hover ref for 60fps canvas animation loop
  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  // Monitor scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;

      if (totalScroll > 0) {
        setScrollProgress(Math.min(100, Math.round((currentScroll / totalScroll) * 100)));
      }

      if (currentScroll > 180) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Realistic Miniature Planet ("Groho") Canvas Animation - Runs continuously
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let rotationAngle = 0;
    const size = 52;
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const planetRadius = 13.5;

    const render = () => {
      ctx.clearRect(0, 0, size, size);

      // Speed up rotation when hovered
      const currentHover = isHoveredRef.current;
      rotationAngle += currentHover ? 0.042 : 0.016;

      // 1. Outer Planetary Atmosphere Glow
      const glowGrad = ctx.createRadialGradient(cx, cy, planetRadius * 0.7, cx, cy, planetRadius * 1.85);
      glowGrad.addColorStop(0, currentHover ? 'rgba(6, 182, 212, 0.45)' : 'rgba(6, 182, 212, 0.28)');
      glowGrad.addColorStop(0.6, 'rgba(14, 165, 233, 0.12)');
      glowGrad.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(cx, cy, planetRadius * 1.85, 0, Math.PI * 2);
      ctx.fillStyle = glowGrad;
      ctx.fill();

      // 2. Back Half of Planetary Ring System (Behind the Planet)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-0.4); // Tilted orbital ring
      ctx.scale(1, 0.38);

      ctx.beginPath();
      ctx.arc(0, 0, planetRadius * 1.9, Math.PI, Math.PI * 2);
      ctx.strokeStyle = currentHover ? 'rgba(56, 189, 248, 0.75)' : 'rgba(56, 189, 248, 0.45)';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      ctx.restore();

      // 3. Planet Sphere Body with 3D Spherical Shading
      const planetGrad = ctx.createRadialGradient(
        cx - planetRadius * 0.35,
        cy - planetRadius * 0.35,
        planetRadius * 0.1,
        cx,
        cy,
        planetRadius
      );
      planetGrad.addColorStop(0, '#38bdf8');     // Sunlight reflection
      planetGrad.addColorStop(0.3, '#0284c7');   // Ocean / surface
      planetGrad.addColorStop(0.75, '#071e3d');  // Twilight zone
      planetGrad.addColorStop(1, '#020612');     // Shadow side

      ctx.beginPath();
      ctx.arc(cx, cy, planetRadius, 0, Math.PI * 2);
      ctx.fillStyle = planetGrad;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = currentHover ? 12 : 7;
      ctx.fill();
      ctx.shadowBlur = 0;

      // 4. Planet Surface Features (Banded Clouds & Terrain)
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, planetRadius, 0, Math.PI * 2);
      ctx.clip();

      // Drifting atmospheric cloud bands
      ctx.fillStyle = 'rgba(255, 255, 255, 0.24)';
      for (let b = -2; b <= 2; b++) {
        const bandY = cy + b * 5 + Math.sin(rotationAngle + b) * 1.5;
        ctx.fillRect(cx - planetRadius, bandY - 1, planetRadius * 2, 2.2);
      }

      // Day-Night Terminator Shadow
      const termGrad = ctx.createLinearGradient(
        cx - planetRadius * 0.5,
        cy - planetRadius * 0.5,
        cx + planetRadius * 0.9,
        cy + planetRadius * 0.9
      );
      termGrad.addColorStop(0, 'transparent');
      termGrad.addColorStop(0.5, 'rgba(2, 6, 23, 0.35)');
      termGrad.addColorStop(1, 'rgba(2, 6, 23, 0.88)');
      ctx.fillStyle = termGrad;
      ctx.fillRect(cx - planetRadius, cy - planetRadius, planetRadius * 2, planetRadius * 2);

      ctx.restore();

      // 5. Front Half of Planetary Ring System (In front of Planet)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-0.4);
      ctx.scale(1, 0.38);

      ctx.beginPath();
      ctx.arc(0, 0, planetRadius * 1.9, 0, Math.PI);
      ctx.strokeStyle = currentHover ? 'rgba(56, 189, 248, 0.95)' : 'rgba(56, 189, 248, 0.65)';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Second thin inner ring
      ctx.beginPath();
      ctx.arc(0, 0, planetRadius * 1.52, 0, Math.PI);
      ctx.strokeStyle = currentHover ? 'rgba(245, 158, 11, 0.8)' : 'rgba(245, 158, 11, 0.45)';
      ctx.lineWidth = 1.0;
      ctx.stroke();

      // Orbiting micro satellite / moon beacon
      const moonAngle = rotationAngle * 1.6;
      const moonX = Math.cos(moonAngle) * planetRadius * 1.9;
      const moonY = Math.sin(moonAngle) * planetRadius * 1.9;
      ctx.beginPath();
      ctx.arc(moonX, moonY, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = '#f8fafc';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const circumference = 2 * Math.PI * 27; // radius 27 for SVG progress ring
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div 
      className={`fixed bottom-5 sm:bottom-6 right-4 sm:right-7 z-50 flex items-center gap-2.5 sm:gap-3 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-6 pointer-events-none'
      }`}
    >
      {/* Floating Astrodynamics HUD Callout (Visible on Desktop / Hover) */}
      <div 
        className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl glass-panel-cyan border border-cyan-500/40 text-[10px] font-mono text-cyan-300 shadow-2xl transition-all duration-300 pointer-events-none ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-3'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        <span className="font-bold tracking-wider uppercase">ZENITH ORBIT</span>
        <span className="text-slate-400 font-normal">| {scrollProgress}% DEPTH</span>
      </div>

      {/* Groho (Planet) Core Interactive Button */}
      <button
        onClick={scrollToTop}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative group p-1 rounded-full focus:outline-none transition-transform duration-300 active:scale-90"
        aria-label="Scroll to top of satellite observatory"
        title="Ascend to Orbit (Top)"
      >
        {/* Outer Circular Progress Meter Ring */}
        <svg className="w-13 h-13 sm:w-16 sm:h-16 -rotate-90 filter drop-shadow-[0_0_12px_rgba(6,182,212,0.45)]">
          {/* Background Track */}
          <circle
            cx="32"
            cy="32"
            r="27"
            className="stroke-slate-800/80 fill-transparent"
            strokeWidth="2.5"
          />
          {/* Active Gradient Progress Stroke */}
          <circle
            cx="32"
            cy="32"
            r="27"
            fill="transparent"
            stroke="url(#grohoGradient)"
            strokeWidth="2.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-150 ease-out"
          />
          <defs>
            <linearGradient id="grohoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
        </svg>

        {/* Planet Center Container with Glass Backing */}
        <div className="absolute inset-1 sm:inset-2 rounded-full glass-panel border border-cyan-500/40 flex items-center justify-center overflow-hidden bg-[#02050c]/90 shadow-[0_0_20px_rgba(6,182,212,0.3)] group-hover:border-cyan-400 group-hover:scale-105 transition-all">
          
          {/* Animated 3D Planet "Groho" Canvas - Always Active */}
          <canvas
            ref={canvasRef}
            className="w-10 h-10 sm:w-12 sm:h-12 pointer-events-none block"
          />

          {/* Upward Arrow Overlay: subtle on idle, bright on hover */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <ArrowUp className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-300 drop-shadow-[0_0_6px_#06b6d4] transition-all duration-200 ${
              isHovered ? 'scale-125 text-white animate-bounce' : 'opacity-70 scale-90'
            }`} />
          </div>
        </div>

        {/* Pulsing Target Indicator Dot */}
        <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-cyan-400 border border-slate-950 animate-pulse shadow-[0_0_8px_#06b6d4]" />
      </button>
    </div>
  );
};
