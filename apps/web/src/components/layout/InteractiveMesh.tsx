import { useEffect, useRef } from 'react';

const MOUSE_REPEL_DIST = 160;
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

function getSecondaryColor(): [number, number, number] {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--color-secondary-theme')
    .trim();
  return hexToRgb(raw || '#0d9488');
}

export default function InteractiveMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const mouse = { x: -9999, y: -9999 };
    const smooth = { x: -9999, y: -9999 };

    const isMobile = window.innerWidth < 768;

    let cachedColorPrimary: [number, number, number] | null = null;
    let cachedColorSecondary: [number, number, number] | null = null;

    const observer = new MutationObserver(() => {
      cachedColorPrimary = null;
      cachedColorSecondary = null;
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      smooth.x = lerp(smooth.x, mouse.x, LERP_SPEED);
      smooth.y = lerp(smooth.y, mouse.y, LERP_SPEED);

      if (!cachedColorPrimary) cachedColorPrimary = getPrimaryColor();
      if (!cachedColorSecondary) cachedColorSecondary = getSecondaryColor();
      const [r1, g1, b1] = cachedColorPrimary;
      const [r2, g2, b2] = cachedColorSecondary;

      if (!isMobile && mouse.x > -1000) {
        const grad1 = ctx.createRadialGradient(
          smooth.x - 30, smooth.y - 10, 0,
          smooth.x - 30, smooth.y - 10, MOUSE_REPEL_DIST * 1.4
        );
        grad1.addColorStop(0, `rgba(${r1},${g1},${b1},0.08)`);
        grad1.addColorStop(1, `rgba(${r1},${g1},${b1},0)`);
        ctx.fillStyle = grad1;
        ctx.beginPath();
        ctx.arc(smooth.x - 30, smooth.y - 10, MOUSE_REPEL_DIST * 1.4, 0, Math.PI * 2);
        ctx.fill();

        const grad2 = ctx.createRadialGradient(
          smooth.x + 30, smooth.y + 10, 0,
          smooth.x + 30, smooth.y + 10, MOUSE_REPEL_DIST * 1.4
        );
        grad2.addColorStop(0, `rgba(${r2},${g2},${b2},0.07)`);
        grad2.addColorStop(1, `rgba(${r2},${g2},${b2},0)`);
        ctx.fillStyle = grad2;
        ctx.beginPath();
        ctx.arc(smooth.x + 30, smooth.y + 10, MOUSE_REPEL_DIST * 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

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
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ background: 'transparent' }}
    />
  );
}
