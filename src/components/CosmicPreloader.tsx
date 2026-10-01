import React, { useEffect, useRef, useState } from 'react';
import { CharwatchLogo } from './CharwatchLogo';
import { Satellite, Radio, Sparkles, Orbit, CheckCircle2 } from 'lucide-react';

interface CosmicPreloaderProps {
  onComplete?: () => void;
}

export const CosmicPreloader: React.FC<CosmicPreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('INITIALIZING ORBITAL SAR TELEMETRY...');
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Progressive telemetry status messages
  useEffect(() => {
    const startTime = Date.now();
    const duration = 2200; // 2.2 seconds smooth load

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(currentProgress);

      if (currentProgress < 25) {
        setStatusText('CONNECTING TO NASA/ISRO NISAR & ESA SENTINEL-1...');
      } else if (currentProgress < 50) {
        setStatusText('SYNCHRONIZING DUAL-FREQUENCY L+C BAND SAR DATA...');
      } else if (currentProgress < 75) {
        setStatusText('CALIBRATING BRAHMAPUTRA-JAMUNA BASIN MESH MATRIX...');
      } else if (currentProgress < 95) {
        setStatusText('INITIALIZING HYDRO-EROSION AI CHANGE ENGINE...');
      } else {
        setStatusText('OBSERVATORY ONLINE · STANDBY FOR ORBIT');
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            setIsRemoved(true);
            if (onComplete) onComplete();
          }, 650);
        }, 350);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  // Cosmic Galaxy & Planet Spinning Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 360;
    let height = 360;
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);

    const cx = width / 2;
    const cy = height / 2;

    // Generate orbiting galaxy particles
    const particles: {
      r: number;
      angle: number;
      speed: number;
      size: number;
      color: string;
      alpha: number;
    }[] = [];

    for (let i = 0; i < 90; i++) {
      const r = Math.pow(Math.random(), 0.8) * 140 + 20;
      particles.push({
        r,
        angle: Math.random() * Math.PI * 2,
        speed: (0.012 + Math.random() * 0.02) * (r < 70 ? 1.5 : 0.8),
        size: Math.random() * 1.8 + 0.6,
        color: Math.random() > 0.6 ? '#38bdf8' : Math.random() > 0.3 ? '#2dd4bf' : '#f59e0b',
        alpha: Math.random() * 0.7 + 0.3,
      });
    }

    let globalRotation = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      globalRotation += 0.015;

      // 1. Nebula Gas Core Behind Logo
      const nebGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 150);
      nebGrad.addColorStop(0, 'rgba(6, 182, 212, 0.28)');
      nebGrad.addColorStop(0.35, 'rgba(14, 116, 144, 0.14)');
      nebGrad.addColorStop(0.7, 'rgba(30, 58, 138, 0.06)');
      nebGrad.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(cx, cy, 150, 0, Math.PI * 2);
      ctx.fillStyle = nebGrad;
      ctx.fill();

      // 2. Spinning Galaxy Spiral Arms & Orbital Rings
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(globalRotation * 0.5);

      // Ring 1 (Tilted Outer Orbital)
      ctx.beginPath();
      ctx.ellipse(0, 0, 130, 48, -0.3, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 1.4;
      ctx.setLineDash([8, 8]);
      ctx.stroke();

      // Ring 2 (Golden Counter-Orbit)
      ctx.beginPath();
      ctx.ellipse(0, 0, 105, 36, 0.45, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([5, 12]);
      ctx.stroke();

      ctx.restore();

      // 3. Orbiting Galaxy Particles with Logarithmic Depth
      particles.forEach((p) => {
        p.angle += p.speed;

        // Tilted perspective projection
        const cosAngle = Math.cos(p.angle);
        const sinAngle = Math.sin(p.angle);

        const x = cx + p.r * cosAngle;
        const y = cy + (p.r * sinAngle) * 0.42;

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;
      });

      // 4. Scanning Radar Pulse Wave
      const pulseRadius = ((Date.now() / 25) % 130) + 20;
      ctx.beginPath();
      ctx.arc(cx, cy, pulseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(6, 182, 212, ${Math.max(0, 0.6 - pulseRadius / 150)})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, []);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsRemoved(true);
      if (onComplete) onComplete();
    }, 300);
  };

  if (isRemoved) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020408] transition-all duration-700 select-none ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Starfield Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,transparent_70%)] pointer-events-none" />

      {/* Main Spinning Planet / Galaxy Centerpiece */}
      <div className="relative flex items-center justify-center w-[300px] h-[300px] sm:w-[360px] sm:h-[360px]">
        {/* Animated 3D Galaxy Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
        />

        {/* Central Glowing Aesthetic Logo */}
        <div className="relative z-10 p-3 rounded-full bg-[#020408]/80 border border-cyan-500/40 shadow-[0_0_35px_rgba(6,182,212,0.5)] animate-pulse">
          <CharwatchLogo size="lg" animated={true} />
        </div>
      </div>

      {/* Brand Identity & Unique Aesthetic Name */}
      <div className="flex flex-col items-center text-center mt-3 z-10 px-4 max-w-md">
        
        {/* Aesthetic Website Title with Cosmic Holographic Gradient */}
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-200 filter drop-shadow-[0_0_20px_rgba(6,182,212,0.45)]">
          CHARWATCH
        </h1>

        {/* Kicker Subtitle */}
        <div className="flex items-center gap-2 mt-1.5 text-[10px] sm:text-xs font-mono tracking-widest text-slate-400 uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>SATELLITE RADAR EARTH OBSERVATORY</span>
        </div>

        {/* Progress Bar Container */}
        <div className="w-64 sm:w-80 mt-6 p-0.5 rounded-full bg-slate-900 border border-slate-800 shadow-inner overflow-hidden">
          <div 
            className="h-1.5 rounded-full bg-gradient-to-r from-cyan-500 via-teal-400 to-amber-400 transition-all duration-100 ease-out shadow-[0_0_12px_#06b6d4]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status Line & Percentage */}
        <div className="flex items-center justify-between w-64 sm:w-80 mt-2.5 text-[10px] sm:text-[11px] font-mono">
          <span className="text-slate-400 truncate max-w-[210px] sm:max-w-[230px] text-left">
            {statusText}
          </span>
          <span className="text-cyan-300 font-bold ml-2">
            {progress}%
          </span>
        </div>
      </div>

      {/* Skip Button (Bottom Right) */}
      <button
        onClick={handleSkip}
        className="absolute bottom-6 right-6 text-[10px] font-mono tracking-widest text-slate-500 hover:text-cyan-400 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-cyan-500/40 transition-colors uppercase"
      >
        ENTER DIRECTLY →
      </button>
    </div>
  );
};
