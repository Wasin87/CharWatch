import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  twinkleSpeed: number;
  direction: number;
  color: string;
  layer: number; // 1: distant, 2: mid, 3: bright foreground
}

interface CometDust {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  color: string;
}

interface Comet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  headRadius: number;
  tailWidth: number;
  alpha: number;
  decayRate: number;
  active: boolean;
  colorHead: string;
  colorTail: string;
  type: 'shooting_star' | 'dhomkathu'; // dhomkathu = small comet with dual tail & stardust
  dustParticles?: CometDust[];
}

export const SpaceBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Realistic Starfield with 3 depth layers and stellar spectra colors
    const starCount = Math.min(360, Math.floor((width * height) / 4500));
    const stars: Star[] = Array.from({ length: starCount }, () => {
      const layer = Math.random() < 0.65 ? 1 : Math.random() < 0.9 ? 2 : 3;
      const size = layer === 1 ? Math.random() * 0.9 + 0.3 : layer === 2 ? Math.random() * 1.4 + 0.8 : Math.random() * 1.9 + 1.2;
      const maxAlpha = layer === 1 ? Math.random() * 0.5 + 0.2 : layer === 2 ? Math.random() * 0.7 + 0.3 : Math.random() * 0.4 + 0.6;
      
      // Stellar colors: Blue-white (O/B), pure white (A), cyan tint, amber/warm (G/K)
      const colorRoll = Math.random();
      const color = colorRoll > 0.85 ? '#67e8f9' : colorRoll > 0.65 ? '#93c5fd' : colorRoll > 0.5 ? '#fde68a' : '#f8fafc';

      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size,
        alpha: Math.random() * maxAlpha,
        maxAlpha,
        twinkleSpeed: (Math.random() * 0.012 + 0.004) * (layer === 3 ? 1.5 : 1),
        direction: Math.random() > 0.5 ? 1 : -1,
        color,
        layer,
      };
    });

    // Cosmic Dust & Nebula Clouds (Milky Way Galaxy Lanes)
    const nebulaClouds = [
      { x: 0.2, y: 0.25, rx: 380, ry: 240, color: 'rgba(6, 182, 212, 0.045)' },
      { x: 0.55, y: 0.4, rx: 550, ry: 320, color: 'rgba(37, 99, 235, 0.038)' },
      { x: 0.8, y: 0.7, rx: 420, ry: 260, color: 'rgba(147, 51, 234, 0.032)' },
      { x: 0.35, y: 0.8, rx: 340, ry: 200, color: 'rgba(16, 185, 129, 0.025)' },
    ];

    // Meteors and Dhomkathu (Comets) Array
    const comets: Comet[] = [];
    const cometSparks: CometDust[] = [];

    // Helper: spawn either a swift shooting star or a graceful small comet ("dhomkathu")
    const spawnComet = (forceDhomkathu = false) => {
      const isDhomkathu = forceDhomkathu || Math.random() < 0.45;
      const angle = (Math.random() * 25 + 30) * (Math.PI / 180); // 30-55 degree downward trajectory
      
      const speed = isDhomkathu ? Math.random() * 3.5 + 2.8 : Math.random() * 9 + 7;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;

      const length = isDhomkathu ? Math.random() * 180 + 120 : Math.random() * 110 + 60;
      const startX = Math.random() * width * 1.1 - width * 0.1;
      const startY = Math.random() * height * 0.35 - 50;

      comets.push({
        x: startX,
        y: startY,
        vx,
        vy,
        length,
        headRadius: isDhomkathu ? Math.random() * 1.8 + 1.8 : 1.2,
        tailWidth: isDhomkathu ? Math.random() * 2.2 + 1.6 : 1.2,
        alpha: 1,
        decayRate: isDhomkathu ? 0.0045 : 0.015,
        active: true,
        type: isDhomkathu ? 'dhomkathu' : 'shooting_star',
        colorHead: isDhomkathu ? '#e0f2fe' : '#ffffff',
        colorTail: isDhomkathu ? '#38bdf8' : '#67e8f9',
      });
    };

    let spawnTimer = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep Space Obsidian Canvas
      ctx.fillStyle = '#020408';
      ctx.fillRect(0, 0, width, height);

      // 1. Milky Way Galactic Diagonal Core (Aesthetic space glow)
      const galaxyCore = ctx.createRadialGradient(
        width * 0.45,
        height * 0.35,
        40,
        width * 0.5,
        height * 0.45,
        Math.max(width, height) * 0.8
      );
      galaxyCore.addColorStop(0, 'rgba(10, 18, 34, 0.95)');
      galaxyCore.addColorStop(0.25, 'rgba(6, 15, 30, 0.7)');
      galaxyCore.addColorStop(0.55, 'rgba(4, 9, 18, 0.9)');
      galaxyCore.addColorStop(1, '#020408');
      ctx.fillStyle = galaxyCore;
      ctx.fillRect(0, 0, width, height);

      // 2. Diffuse Cosmic Dust & Nebula Clouds
      nebulaClouds.forEach((cloud) => {
        const cx = width * cloud.x;
        const cy = height * cloud.y;
        const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, cloud.rx);
        grad.addColorStop(0, cloud.color);
        grad.addColorStop(0.5, cloud.color.replace(/[\d\.]+\)$/, '0.015)'));
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(cx, cy, cloud.rx, cloud.ry, Math.PI / 6, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Multi-depth Twinkling Starfield
      stars.forEach((star) => {
        star.alpha += star.twinkleSpeed * star.direction;
        if (star.alpha >= star.maxAlpha) {
          star.alpha = star.maxAlpha;
          star.direction = -1;
        } else if (star.alpha <= 0.1) {
          star.alpha = 0.1;
          star.direction = 1;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.alpha;
        
        // Gentle glow for larger foreground stars
        if (star.layer === 3) {
          ctx.shadowColor = star.color;
          ctx.shadowBlur = 8;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      });

      // 4. Comet / "Dhomkathu" Spawner Logic
      spawnTimer++;
      if (spawnTimer > 120) {
        if (Math.random() < 0.16) {
          spawnComet();
          spawnTimer = 0;
        }
      }

      // 5. Update and Render Trailing Stardust Sparks from Dhomkathu
      for (let s = cometSparks.length - 1; s >= 0; s--) {
        const spark = cometSparks[s];
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.alpha -= 0.014;

        if (spark.alpha <= 0) {
          cometSparks.splice(s, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
        ctx.fillStyle = spark.color;
        ctx.globalAlpha = spark.alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      // 6. Render Comets ("Dhomkathu") & Shooting Stars
      for (let i = comets.length - 1; i >= 0; i--) {
        const c = comets[i];
        if (!c.active) continue;

        // Tail endpoint
        const tailAngle = Math.atan2(c.vy, c.vx);
        const tailX = c.x - Math.cos(tailAngle) * c.length;
        const tailY = c.y - Math.sin(tailAngle) * c.length;

        // Dual Tail: Primary Ion Tail + Secondary Diffuse Dust Tail for Dhomkathu
        if (c.type === 'dhomkathu') {
          // Secondary faint curved dust tail
          const dustTailGrad = ctx.createLinearGradient(c.x, c.y, tailX - 12, tailY + 8);
          dustTailGrad.addColorStop(0, `rgba(254, 240, 138, ${c.alpha * 0.4})`);
          dustTailGrad.addColorStop(0.4, `rgba(56, 189, 248, ${c.alpha * 0.2})`);
          dustTailGrad.addColorStop(1, 'transparent');

          ctx.beginPath();
          ctx.moveTo(c.x, c.y);
          ctx.lineTo(tailX - 15, tailY + 10);
          ctx.strokeStyle = dustTailGrad;
          ctx.lineWidth = c.tailWidth * 1.8;
          ctx.lineCap = 'round';
          ctx.stroke();

          // Emit small stardust sparks along path
          if (Math.random() < 0.45 && cometSparks.length < 90) {
            cometSparks.push({
              x: c.x - Math.cos(tailAngle) * (Math.random() * 40 + 10),
              y: c.y - Math.sin(tailAngle) * (Math.random() * 40 + 10),
              vx: (Math.random() - 0.5) * 0.6,
              vy: (Math.random() - 0.5) * 0.6,
              alpha: c.alpha * 0.8,
              size: Math.random() * 1.2 + 0.4,
              color: Math.random() > 0.5 ? '#67e8f9' : '#fde047',
            });
          }
        }

        // Primary Glowing Plasma Tail
        const tailGrad = ctx.createLinearGradient(c.x, c.y, tailX, tailY);
        tailGrad.addColorStop(0, `rgba(255, 255, 255, ${c.alpha})`);
        tailGrad.addColorStop(0.15, `rgba(103, 232, 249, ${c.alpha * 0.85})`);
        tailGrad.addColorStop(0.65, `rgba(6, 182, 212, ${c.alpha * 0.25})`);
        tailGrad.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = tailGrad;
        ctx.lineWidth = c.tailWidth;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Glowing Comet Coma / Head
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.headRadius * 1.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${c.alpha})`;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = c.type === 'dhomkathu' ? 16 : 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Move comet forward
        c.x += c.vx;
        c.y += c.vy;
        c.alpha -= c.decayRate;

        if (c.alpha <= 0 || c.x > width + 150 || c.y > height + 150) {
          c.active = false;
          comets.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};
