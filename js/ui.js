const getRandom = () => window.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296;

let glitchTimer = null;

export function setupSubtitleGlitch(originalText) {
  const subtitle = document.getElementById('hero-subtitle');
  if (!subtitle) return;
  const chars = "!@#$%^&*()_+-=[]{}|;':\",./<>?";
  clearInterval(glitchTimer);
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  glitchTimer = setInterval(() => {
    if (getRandom() > 0.92) {
      const pos = Math.floor(getRandom() * originalText.length);
      const char = chars[Math.floor(getRandom() * chars.length)];
      subtitle.textContent = originalText.substring(0, pos) + char + originalText.substring(pos + 1);
      setTimeout(() => {
        subtitle.textContent = originalText;
      }, 100);
    }
  }, 2000);
}

export function initHudTargetTracker() {
  const frame = document.getElementById('hud-frame');
  const mainSite = document.getElementById('main-site');
  if (!frame || !mainSite) return;

  const sections = Array.from(mainSite.querySelectorAll('section.window-chrome'));
  if (!sections.length) return;

  let activeSection = null;
  let lastScrollY = window.scrollY;
  let scrollRaf = 0;

  function updateFrame(target) {
    if (!target) {
      frame.classList.add('opacity-0');
      return;
    }
    activeSection = target;
    const parentRect = mainSite.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    frame.style.top = (targetRect.top - parentRect.top) + 'px';
    frame.style.left = (targetRect.left - parentRect.left) + 'px';
    frame.style.width = targetRect.width + 'px';
    frame.style.height = targetRect.height + 'px';
    frame.classList.remove('opacity-0');
  }

  function pickVisibleSection() {
    if (window.scrollY <= 24) return sections[0];
    const viewH = window.innerHeight;
    if (viewH + window.scrollY >= document.documentElement.scrollHeight - 24) {
      return sections[sections.length - 1];
    }
    const anchorY = viewH * 0.3;
    let best = null;
    let bestDist = Infinity;

    for (let i = 0; i < sections.length; i++) {
      const sec = sections[i];
      const rect = sec.getBoundingClientRect();
      if (rect.bottom <= 0 || rect.top >= viewH) continue;
      if (rect.top <= anchorY && rect.bottom >= anchorY) {
        return sec;
      }
      const center = (Math.max(0, rect.top) + Math.min(viewH, rect.bottom)) * 0.5;
      const dist = Math.abs(center - anchorY);
      if (dist < bestDist) {
        bestDist = dist;
        best = sec;
      }
    }
    return best || activeSection || sections[0];
  }

  sections.forEach(sec => {
    sec.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'mouse') updateFrame(sec);
    });
    sec.addEventListener('pointerdown', () => {
      lastScrollY = window.scrollY;
      updateFrame(sec);
    }, { passive: true });
  });

  window.addEventListener('scroll', () => {
    if (Math.abs(window.scrollY - lastScrollY) < 4) return;
    lastScrollY = window.scrollY;
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(() => {
      scrollRaf = 0;
      const visible = pickVisibleSection();
      if (visible) updateFrame(visible);
    });
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (activeSection) updateFrame(activeSection);
  });

  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(() => {
      if (activeSection) updateFrame(activeSection);
    });
    sections.forEach(sec => ro.observe(sec));
  }

  updateFrame(pickVisibleSection());
}
