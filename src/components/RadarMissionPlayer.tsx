import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Maximize2, Minimize2, VolumeX, Volume2, Radio, Sparkles, ShieldCheck, Activity } from 'lucide-react';

export const RadarMissionPlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const timeDisplayRef = useRef<HTMLSpanElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [duration, setDuration] = useState(14.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // 5 Photorealistic Scenes matching the user's video exactly
  const scenes = [
    {
      id: 'scene1',
      time: 0,
      endTime: 2.7,
      label: '01 ORBIT',
      title: 'ORBITAL EARTH RECONNAISSANCE',
      subtitle: "Space tracks Bangladesh's shifting rivers.",
      frame: '/videos/frames/scene1.jpg',
      tag: 'NISAR · 747 KM ORBIT',
      coords: '24°00\'N 89°50\'E',
    },
    {
      id: 'scene2',
      time: 2.7,
      endTime: 5.4,
      label: '02 RADAR',
      title: 'SAR CLOUD PENETRATION',
      subtitle: 'Radar penetrates clouds to map erosion.',
      frame: '/videos/frames/scene2.jpg',
      tag: 'L+C BAND MICROWAVE',
      coords: '24°15\'N 89°45\'E',
    },
    {
      id: 'scene3',
      time: 5.4,
      endTime: 8.1,
      label: '03 CHARS',
      title: 'BRAIDED CHAR DYNAMICS',
      subtitle: 'New chars emerge as vegetation takes root.',
      frame: '/videos/frames/scene3.jpg',
      tag: 'DIFFUSE BACKSCATTER + VEGETATION',
      coords: '24°28\'N 89°42\'E',
    },
    {
      id: 'scene4',
      time: 8.1,
      endTime: 10.8,
      label: '04 COMMUNITY',
      title: 'EMBANKMENT RISK ENGINE',
      subtitle: 'This empowers communities to prepare.',
      frame: '/videos/frames/scene4.jpg',
      tag: 'ADVISORY · WARNING · CRITICAL',
      coords: '24°34\'N 89°40\'E',
    },
    {
      id: 'scene5',
      time: 10.8,
      endTime: 14.0,
      label: '05 PANORAMA',
      title: 'JAMUNA BASIN RECONNAISSANCE',
      subtitle: 'CharWatch Satellite Radar Observatory · Bangladesh',
      frame: '/videos/frames/scene5.jpg',
      tag: 'BENGAL DELTA SENTINEL-1',
      coords: '24°40\'N 89°38\'E',
    },
  ];

  // High performance time updater that doesn't cause laggy React re-renders every 50ms
  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 14.0;

    // Direct DOM progress update for 60fps buttery-smooth timeline
    if (progressFillRef.current) {
      const pct = (cur / dur) * 100;
      progressFillRef.current.style.width = `${pct}%`;
    }
    if (timeDisplayRef.current) {
      timeDisplayRef.current.textContent = `${cur.toFixed(1)}s / ${dur.toFixed(1)}s`;
    }

    // Only trigger React state change when scene boundary is crossed
    for (let i = 0; i < scenes.length; i++) {
      if (cur >= scenes[i].time && cur < scenes[i].endTime) {
        setActiveSceneIndex((prev) => (prev !== i ? i : prev));
        break;
      }
    }
  }, [scenes]);

  const handleLoadedMetadata = () => {
    if (videoRef.current && videoRef.current.duration) {
      setDuration(videoRef.current.duration);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const jumpToScene = (index: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = scenes[index].time;
    videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    setActiveSceneIndex(index);
  };

  const restartVideo = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    setActiveSceneIndex(0);
  };

  const toggleAudio = () => {
    if (!isAudioEnabled) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!audioCtxRef.current) {
          const ctx = new AudioCtx();
          audioCtxRef.current = ctx;

          // Atmospheric low orbital hum with subtle harmonic filter
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gainNode = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(55, ctx.currentTime);
          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(110, ctx.currentTime);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(220, ctx.currentTime);

          gainNode.gain.setValueAtTime(0.06, ctx.currentTime);

          osc1.connect(filter);
          osc2.connect(filter);
          filter.connect(gainNode);
          gainNode.connect(ctx.destination);

          osc1.start();
          osc2.start();
          gainNodeRef.current = gainNode;
        } else if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }
        if (gainNodeRef.current && audioCtxRef.current) {
          gainNodeRef.current.gain.setTargetAtTime(0.06, audioCtxRef.current.currentTime, 0.05);
        }
        setIsAudioEnabled(true);
      } catch (_) {}
    } else {
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.05);
      }
      setIsAudioEnabled(false);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Ensure autoplay on mount with low latency
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {
        setIsPlaying(false);
      });
    }
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const activeScene = scenes[activeSceneIndex] || scenes[0];

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-2xl sm:rounded-3xl overflow-hidden glass-panel border border-cyan-500/50 shadow-[0_0_60px_rgba(6,182,212,0.25)] bg-[#010308] select-none ${
        isFullscreen ? 'fixed inset-0 z-[100] rounded-none border-none' : ''
      }`}
    >
      {/* 1. TOP TELEMETRY HUD BAR */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-b from-[#010308]/95 via-[#010308]/80 to-transparent pointer-events-none">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
          </span>
          <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider text-cyan-300 uppercase">
            CHARWATCH MISSION RECONNAISSANCE
          </span>
          <span className="hidden md:inline px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
            {activeScene.tag}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-mono text-slate-300 pointer-events-auto">
          <span className="hidden xs:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
            <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
            30 FPS FLUID MOTION · 1080P
          </span>

          <button
            onClick={toggleAudio}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono transition-all ${
              isAudioEnabled
                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-white bg-slate-900/60 border border-slate-700/60'
            }`}
            title={isAudioEnabled ? 'Mute Orbital Audio' : 'Enable Orbital Telemetry Sound'}
          >
            {isAudioEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span className="font-bold">AUDIO ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">MUTED</span>
              </>
            )}
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 text-slate-400 hover:text-white transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. MAIN RESPONSIVE VIDEO STAGE */}
      <div 
        className="relative aspect-video w-full overflow-hidden flex items-center justify-center bg-black cursor-pointer group"
        onClick={togglePlay}
      >
        {/* Real Fluid H.264 Video with Faststart, Autoplay & Loop */}
        <video
          ref={videoRef}
          src="/videos/radar_mission.mp4"
          poster="/videos/frames/scene1.jpg"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover filter contrast-[1.04] brightness-100"
        />

        {/* Fallback frame if browser blocks video */}
        {hasError && (
          <img
            src={activeScene.frame}
            alt={activeScene.title}
            className="absolute inset-0 w-full h-full object-cover filter contrast-[1.04]"
          />
        )}

        {/* Animated Radar Scanning Line Sweep */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
          <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan-sweep" />
        </div>

        {/* Tactical Corner Reticle Lines */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-cyan-400/50 pointer-events-none" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-cyan-400/50 pointer-events-none" />
        <div className="absolute bottom-16 left-4 w-6 h-6 border-b-2 border-l-2 border-cyan-400/50 pointer-events-none" />
        <div className="absolute bottom-16 right-4 w-6 h-6 border-b-2 border-r-2 border-cyan-400/50 pointer-events-none" />

        {/* Live Coordinates Watermark */}
        <div className="absolute bottom-3 left-4 pointer-events-none hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-black/60 backdrop-blur-sm border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
          <Radio className="w-3 h-3 text-cyan-400 animate-spin" />
          <span>GEO: {activeScene.coords} · JAMUNA REACH</span>
        </div>

        {/* Play/Pause Splash Overlay when Paused */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_35px_rgba(6,182,212,0.7)] animate-pulse">
              <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1 fill-cyan-300" />
            </div>
          </div>
        )}
      </div>

      {/* 3. TIMELINE SCRUBBER & SCENE JUMP CONTROLS */}
      <div className="relative z-30 px-3 sm:px-6 py-2.5 sm:py-3.5 glass-panel border-t border-slate-800/90 bg-[#02050c]/95">
        
        {/* Progress Scrubber Bar */}
        <div 
          className="w-full h-1.5 sm:h-2 bg-slate-900 rounded-full overflow-hidden cursor-pointer mb-3 relative group/scrub"
          onClick={(e) => {
            if (!videoRef.current) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPos = (e.clientX - rect.left) / rect.width;
            const targetTime = clickPos * duration;
            videoRef.current.currentTime = targetTime;
          }}
        >
          <div 
            ref={progressFillRef}
            className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-amber-400 shadow-[0_0_12px_#06b6d4] will-change-transform"
            style={{ width: '0%' }}
          />
        </div>

        {/* Buttons Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
          {/* Left: Play/Pause/Restart & Timestamp */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={togglePlay}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[11px] font-mono font-bold transition-all active:scale-95 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-cyan-300" />}
              <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
            </button>

            <button
              onClick={restartVideo}
              className="p-1.5 rounded-lg glass-panel hover:bg-slate-800 text-slate-300 hover:text-white text-[11px] font-mono transition-colors"
              title="Replay from Beginning"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <span 
              ref={timeDisplayRef}
              className="text-[10px] sm:text-xs font-mono text-cyan-300/80 min-w-[75px]"
            >
              0.0s / {duration.toFixed(1)}s
            </span>
          </div>

          {/* Right: Scene Chapter Buttons */}
          <div className="grid grid-cols-5 sm:flex items-center gap-1 sm:gap-1.5 w-full sm:w-auto">
            {scenes.map((scene, idx) => {
              const isActive = activeSceneIndex === idx;
              return (
                <button
                  key={scene.id}
                  onClick={() => jumpToScene(idx)}
                  className={`px-2 sm:px-2.5 py-1 rounded text-[9px] sm:text-[10px] font-mono tracking-wider transition-all truncate text-center ${
                    isActive
                      ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/70 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <span>{scene.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

