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

    let cachedColor: [number, number, number] | null = null;

    const observer = new MutationObserver(() => {
      cachedColor = null;
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

      if (!cachedColor) cachedColor = getPrimaryColor();
      const [r, g, b] = cachedColor;

      if (!isMobile && mouse.x > -1000) {
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
      className="fixed inset-0 -z-[5] pointer-events-none"
      style={{ background: 'transparent' }}
    />
  );
}
