const STEP = 16;
const SCALE = 1 / 280;
const KEYFRAME_MS = 480;
const NOISE_SPEED = 0.04;
const PEAK_RADIUS = 170;
const PEAK_RADIUS2 = PEAK_RADIUS * PEAK_RADIUS;
const PEAK_CUTOFF = PEAK_RADIUS * 2;
const PEAK_HEIGHT = 0.26;

const LEVELS = [
  { at: 0.30, alpha: 0.18, width: 1 },
  { at: 0.38, alpha: 0.36, width: 1.35 },
  { at: 0.45, alpha: 0.20, width: 1 },
  { at: 0.52, alpha: 0.40, width: 1.35 },
  { at: 0.59, alpha: 0.20, width: 1 },
  { at: 0.66, alpha: 0.36, width: 1.35 },
  { at: 0.74, alpha: 0.55, width: 1.35, accent: true }
];

const smooth = (t) => t * t * (3 - 2 * t);

function hash3(x, y, z) {
  let h = Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(z, 1440662683);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

function noise3(x, y, z) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const xf = smooth(x - xi);
  const yf = smooth(y - yi);
  const zf = smooth(z - zi);
  const x1 = xi + 1;
  const y1 = yi + 1;
  const z1 = zi + 1;

  const nx00 = hash3(xi, yi, zi) + (hash3(x1, yi, zi) - hash3(xi, yi, zi)) * xf;
  const nx10 = hash3(xi, y1, zi) + (hash3(x1, y1, zi) - hash3(xi, y1, zi)) * xf;
  const nx01 = hash3(xi, yi, z1) + (hash3(x1, yi, z1) - hash3(xi, yi, z1)) * xf;
  const nx11 = hash3(xi, y1, z1) + (hash3(x1, y1, z1) - hash3(xi, y1, z1)) * xf;

  const nxy0 = nx00 + (nx10 - nx00) * yf;
  const nxy1 = nx01 + (nx11 - nx01) * yf;
  return nxy0 + (nxy1 - nxy0) * zf;
}

function fbm(x, y, time) {
  let sum = 0;
  let norm = 0;
  let amp = 1;
  let freq = 1;
  for (let octave = 0; octave < 3; octave++) {
    sum += amp * noise3(x * SCALE * freq, y * SCALE * freq, time + octave * 19.7);
    norm += amp;
    amp *= 0.5;
    freq *= 2.05;
  }
  return sum / norm;
}

export function initTerrainField() {
  const canvas = document.getElementById('terrain-field');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let cols = 0;
  let rows = 0;
  let fieldA = null;
  let fieldB = null;
  let fieldNext = null;
  let field = null;
  let nextRow = 0;
  let keyframeStart = 0;
  let sliceIndex = 0;
  let raf = null;
  let lastFrame = 0;
  let resizeTimer = 0;
  const cross = new Float32Array(8);
  const seedX = Math.random() * 100000;
  const seedY = Math.random() * 100000;
  const seedZ = Math.random() * 1000;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const pointer = { tx: 0, ty: 0, x: 0, y: 0, target: 0, amp: 0, ready: false };

  function setPointer(clientX, clientY, active) {
    pointer.tx = clientX;
    pointer.ty = clientY;
    if (!pointer.ready) {
      pointer.x = clientX;
      pointer.y = clientY;
      pointer.ready = true;
    }
    pointer.target = active ? 1 : 0;
  }

  function fillSlice(buf, time) {
    const z = seedZ + time;
    for (let j = 0; j < rows; j++) {
      const y = j * STEP + seedY;
      const row = j * cols;
      for (let i = 0; i < cols; i++) {
        buf[row + i] = fbm(i * STEP + seedX, y, z);
      }
    }
  }

  function stepNextSlice(rowsBudget) {
    const z = seedZ + (sliceIndex + 2) * (KEYFRAME_MS / 1000) * NOISE_SPEED;
    const end = Math.min(rows, nextRow + rowsBudget);
    for (let j = nextRow; j < end; j++) {
      const y = j * STEP + seedY;
      const row = j * cols;
      for (let i = 0; i < cols; i++) {
        fieldNext[row + i] = fbm(i * STEP + seedX, y, z);
      }
    }
    nextRow = end;
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(w / STEP) + 1;
    rows = Math.ceil(h / STEP) + 1;
    const total = cols * rows;
    fieldA = new Float32Array(total);
    fieldB = new Float32Array(total);
    fieldNext = new Float32Array(total);
    field = new Float32Array(total);

    const stepSec = (KEYFRAME_MS / 1000) * NOISE_SPEED;
    fillSlice(fieldA, sliceIndex * stepSec);
    if (!reduced) {
      fillSlice(fieldB, (sliceIndex + 1) * stepSec);
    } else {
      fieldB.set(fieldA);
    }
    nextRow = 0;
    keyframeStart = performance.now();
    lastFrame = keyframeStart;
    paint(keyframeStart);
  }

  function sample(timestamp) {
    if (reduced) {
      field.set(fieldA);
      return;
    }

    const dt = Math.min(0.064, Math.max(0.001, (timestamp - lastFrame) / 1000));
    lastFrame = timestamp;

    let elapsed = timestamp - keyframeStart;
    if (elapsed >= KEYFRAME_MS) {
      if (nextRow < rows) stepNextSlice(rows - nextRow);
      const tmp = fieldA;
      fieldA = fieldB;
      fieldB = fieldNext;
      fieldNext = tmp;
      nextRow = 0;
      sliceIndex++;
      keyframeStart = timestamp - (elapsed % KEYFRAME_MS);
      elapsed = timestamp - keyframeStart;
    } else if (nextRow < rows) {
      stepNextSlice(Math.max(2, Math.ceil(rows / 18)));
    }

    const u = elapsed / KEYFRAME_MS;
    const total = cols * rows;
    for (let k = 0; k < total; k++) {
      field[k] = fieldA[k] + (fieldB[k] - fieldA[k]) * u;
    }

    const posRate = 1 - Math.exp(-dt * 18);
    const ampRate = 1 - Math.exp(-dt * 10);
    pointer.x += (pointer.tx - pointer.x) * posRate;
    pointer.y += (pointer.ty - pointer.y) * posRate;
    pointer.amp += (pointer.target - pointer.amp) * ampRate;

    const peak = pointer.amp * PEAK_HEIGHT;
    if (peak <= 0.002) return;

    const px = pointer.x;
    const py = pointer.y;
    const iMin = Math.max(0, Math.floor((px - PEAK_CUTOFF) / STEP));
    const iMax = Math.min(cols - 1, Math.ceil((px + PEAK_CUTOFF) / STEP));
    const jMin = Math.max(0, Math.floor((py - PEAK_CUTOFF) / STEP));
    const jMax = Math.min(rows - 1, Math.ceil((py + PEAK_CUTOFF) / STEP));
    const cutoff2 = PEAK_CUTOFF * PEAK_CUTOFF;

    for (let j = jMin; j <= jMax; j++) {
      const dy = j * STEP - py;
      const dy2 = dy * dy;
      const row = j * cols;
      for (let i = iMin; i <= iMax; i++) {
        const dx = i * STEP - px;
        const d2 = dx * dx + dy2;
        if (d2 < cutoff2) {
          field[row + i] += peak * Math.exp(-d2 / PEAK_RADIUS2);
        }
      }
    }
  }

  function paint(timestamp) {
    sample(timestamp);

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.lineCap = 'round';

    const light = document.documentElement.dataset.theme === 'light';
    const ink = light ? '95, 90, 80' : '159, 184, 232';
    const amber = light ? '148, 82, 0' : '255, 184, 108';
    const dim = light ? 0.85 : 1;
    const w = cols - 1;
    const h = rows - 1;

    for (let level = 0; level < LEVELS.length; level++) {
      const { at, alpha, width, accent } = LEVELS[level];
      ctx.lineWidth = width;
      ctx.strokeStyle = `rgba(${accent ? amber : ink}, ${alpha * dim})`;
      ctx.beginPath();

      for (let j = 0; j < h; j++) {
        const row = j * cols;
        const next = row + cols;
        const y0 = j * STEP;
        const y1 = y0 + STEP;

        for (let i = 0; i < w; i++) {
          const av = field[row + i];
          const bv = field[row + i + 1];
          const cv = field[next + i + 1];
          const dv = field[next + i];

          const a = av >= at;
          const b = bv >= at;
          const c = cv >= at;
          const d = dv >= at;
          if (a === b && b === c && c === d) continue;

          const x0 = i * STEP;
          const x1 = x0 + STEP;
          let n = 0;

          if (a !== b) { cross[n++] = x0 + STEP * (at - av) / (bv - av); cross[n++] = y0; }
          if (b !== c) { cross[n++] = x1; cross[n++] = y0 + STEP * (at - bv) / (cv - bv); }
          if (c !== d) { cross[n++] = x0 + STEP * (at - dv) / (cv - dv); cross[n++] = y1; }
          if (d !== a) { cross[n++] = x0; cross[n++] = y0 + STEP * (at - av) / (dv - av); }

          if (n === 4) {
            ctx.moveTo(cross[0], cross[1]);
            ctx.lineTo(cross[2], cross[3]);
          } else if (n === 8) {
            if (!a && !c) {
              ctx.moveTo(cross[0], cross[1]);
              ctx.lineTo(cross[6], cross[7]);
              ctx.moveTo(cross[2], cross[3]);
              ctx.lineTo(cross[4], cross[5]);
            } else {
              ctx.moveTo(cross[0], cross[1]);
              ctx.lineTo(cross[2], cross[3]);
              ctx.moveTo(cross[4], cross[5]);
              ctx.lineTo(cross[6], cross[7]);
            }
          }
        }
      }

      ctx.stroke();
    }
  }

  function frame(timestamp) {
    raf = requestAnimationFrame(frame);
    if (document.hidden) return;
    paint(timestamp);
  }

  resize();
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 100);
  });
  document.addEventListener('themechange', () => paint(performance.now()));

  if (!reduced) {
    window.addEventListener('pointermove', (e) => {
      setPointer(e.clientX, e.clientY, true);
    }, { passive: true });

    window.addEventListener('pointerdown', (e) => {
      setPointer(e.clientX, e.clientY, true);
    }, { passive: true });

    window.addEventListener('pointerup', (e) => {
      if (e.pointerType !== 'mouse') pointer.target = 0;
    }, { passive: true });

    window.addEventListener('pointercancel', () => {
      pointer.target = 0;
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      pointer.target = 0;
    });

    const startLoop = () => {
      if (!raf && !document.hidden) {
        keyframeStart = performance.now();
        lastFrame = keyframeStart;
        raf = requestAnimationFrame(frame);
      }
    };
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(startLoop, { timeout: 600 });
    } else {
      setTimeout(startLoop, 200);
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && raf) {
        cancelAnimationFrame(raf);
        raf = null;
      } else if (!document.hidden && !raf) {
        keyframeStart = performance.now();
        lastFrame = keyframeStart;
        raf = requestAnimationFrame(frame);
      }
    });
  }
}
