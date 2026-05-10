import { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  size: number;
  opacity: number;
}

const CONNECT_DIST = 130;
const MOUSE_REPEL_DIST = 160;
const MOUSE_FORCE = 1.2;
const MAX_SPEED = 3.5;
const LERP_SPEED = 0.07;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function hexToRgb(hex: string): [number, number, number] {
  const cleaned = hex.trim().replace('#', '');
  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);
  return isNaN(r) ? [59, 130, 246] : [r, g, b];
}

function getPrimaryColor(): [number, number, number] {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--color-primary-theme')
    .trim();
  return hexToRgb(raw || '#3b82f6');
}

export default function InteractiveMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let points: Point[] = [];
    let animationFrameId: number;

    const mouse = { x: -9999, y: -9999 };
    const smooth = { x: -9999, y: -9999 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initPoints();
    };

    const initPoints = () => {
      points = [];
      const count = Math.min(
        200,
        Math.floor((canvas.width * canvas.height) / 10000)
      );
      for (let i = 0; i < count; i++) {
        const speed = 0.15 + Math.random() * 0.35;
        const angle = Math.random() * Math.PI * 2;
        const bvx = Math.cos(angle) * speed;
        const bvy = Math.sin(angle) * speed;
        points.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: bvx,
          vy: bvy,
          baseVx: bvx,
          baseVy: bvy,
          size: 0.8 + Math.random() * 1.6,
          opacity: 0.4 + Math.random() * 0.4,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      smooth.x = lerp(smooth.x, mouse.x, LERP_SPEED);
      smooth.y = lerp(smooth.y, mouse.y, LERP_SPEED);

      const [r, g, b] = getPrimaryColor();

      if (mouse.x > -1000) {
        const grad = ctx.createRadialGradient(
          smooth.x, smooth.y, 0,
          smooth.x, smooth.y, MOUSE_REPEL_DIST * 1.2
        );
        grad.addColorStop(0, `rgba(${r},${g},${b},0.06)`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(smooth.x, smooth.y, MOUSE_REPEL_DIST * 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      points.forEach((p, i) => {
        const dx = p.x - smooth.x;
        const dy = p.y - smooth.y;
        const dist = Math.hypot(dx, dy);

        if (dist < MOUSE_REPEL_DIST && dist > 0) {
          const force = (1 - dist / MOUSE_REPEL_DIST) * MOUSE_FORCE;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        p.vx += (p.baseVx - p.vx) * 0.04;
        p.vy += (p.baseVy - p.vy) * 0.04;

        const spd = Math.hypot(p.vx, p.vy);
        if (spd > MAX_SPEED) {
          p.vx = (p.vx / spd) * MAX_SPEED;
          p.vy = (p.vy / spd) * MAX_SPEED;
        }

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < points.length; j++) {
          const q = points[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < CONNECT_DIST) {
            const alpha = (1 - d / CONNECT_DIST) * 0.25;
            ctx.globalAlpha = alpha;
            ctx.strokeStyle = `rgb(${r},${g},${b})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }

        if (dist < MOUSE_REPEL_DIST && mouse.x > -1000) {
          const alpha = (1 - dist / MOUSE_REPEL_DIST) * 0.5;
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = `rgb(${r},${g},${b})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(smooth.x, smooth.y);
          ctx.stroke();
        }
      });

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(draw);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);

    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-[5] pointer-events-none"
      style={{ background: 'transparent' }}
    />
  );
}
