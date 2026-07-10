const getRandom = () => window.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296;

export function setupSubtitleGlitch(originalText) {
  const subtitle = document.getElementById('hero-subtitle');
  if (!subtitle) return;
  const chars = "!@#$%^&*()_+-=[]{}|;':\",./<>?";
  setInterval(() => {
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
