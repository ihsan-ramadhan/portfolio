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

export function revealSections() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.05 });
  document.querySelectorAll('.section-fade').forEach(el => observer.observe(el));
}

export function initHudTargetTracker() {
  const frame = document.getElementById('hud-frame');
  const mainSite = document.getElementById('main-site');
  if (!frame || !mainSite) return;

  const sections = Array.from(mainSite.querySelectorAll('section.window-chrome'));
  if (!sections.length) return;

  let activeSection = null;

  function updateFrame(target) {
    if (!target) {
      frame.classList.add('opacity-0');
      return;
    }
    activeSection = target;
    const parentRect = mainSite.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const top = targetRect.top - parentRect.top;
    const left = targetRect.left - parentRect.left;
    const width = targetRect.width;
    const height = targetRect.height;

    frame.style.top = top + 'px';
    frame.style.left = left + 'px';
    frame.style.width = width + 'px';
    frame.style.height = height + 'px';
    frame.classList.remove('opacity-0');
  }

  sections.forEach(sec => {
    sec.addEventListener('mouseenter', () => updateFrame(sec));
  });

  const onScreen = new Set();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) onScreen.add(entry.target);
      else onScreen.delete(entry.target);
    });
    if (mainSite.matches(':hover')) return;
    const topmost = sections.find(sec => onScreen.has(sec));
    if (topmost) updateFrame(topmost);
  }, { threshold: 0.3 });

  sections.forEach(sec => observer.observe(sec));

  window.addEventListener('resize', () => {
    if (activeSection) updateFrame(activeSection);
  });
}
