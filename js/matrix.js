export function initDataRain() {
  const canvas = document.getElementById('data-rain');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: false });
  const glyphs = '01アイウエオカキクケコサシスセソ0123456789ABCDEF#$%&<>/\\';
  const fontSize = 15;
  let cols = 0;
  let drops = [];
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let animationFrameId = null;
  let lastTime = 0;
  let lastWidth = 0;
  const fpsInterval = 66;

  const getRandom = () => window.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296;

  function resize() {
    if (window.innerWidth === lastWidth && drops.length > 0) return;
    lastWidth = window.innerWidth;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(window.innerWidth / fontSize);
    drops = new Array(cols).fill(0).map(() => Math.floor(getRandom() * -40));
  }

  function frame(timestamp) {
    animationFrameId = requestAnimationFrame(frame);

    const elapsed = timestamp - lastTime;
    if (elapsed < fpsInterval) return;
    lastTime = timestamp - (elapsed % fpsInterval);

    if (document.hidden || document.getElementById('main-site').classList.contains('hidden')) {
      return;
    }

    ctx.fillStyle = document.documentElement.dataset.theme === 'light'
      ? 'rgba(232, 228, 216, 0.18)'
      : 'rgba(5, 6, 13, 0.18)';
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.font = fontSize + 'px "Share Tech Mono", monospace';

    ctx.fillStyle = document.documentElement.dataset.theme === 'light'
      ? 'rgba(58, 58, 74, 0.28)'
      : 'rgba(100, 128, 192, 0.35)';
    for (let i = 0; i < cols; i++) {
      const x = i * fontSize;
      const y = drops[i] * fontSize;
      ctx.fillText(glyphs[Math.floor(getRandom() * glyphs.length)], x, y - fontSize);
    }

    ctx.fillStyle = document.documentElement.dataset.theme === 'light'
      ? 'rgba(42, 42, 58, 0.75)'
      : 'rgba(219, 230, 255, 0.85)';
    for (let i = 0; i < cols; i++) {
      const char = glyphs[Math.floor(getRandom() * glyphs.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;
      ctx.fillText(char, x, y);

      if (y > window.innerHeight && getRandom() > 0.975) {
        drops[i] = Math.floor(getRandom() * -20);
      }
      drops[i]++;
    }
  }

  resize();
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 100);
  });

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced) {
    animationFrameId = requestAnimationFrame(frame);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      } else if (!document.hidden && !animationFrameId) {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(frame);
      }
    });
  } else {
    ctx.fillStyle = document.documentElement.dataset.theme === 'light'
      ? 'rgb(232, 228, 216)'
      : 'rgb(5, 6, 13)';
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  }
}
