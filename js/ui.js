export function setupSubtitleGlitch(originalText) {
  const subtitle = document.getElementById('hero-subtitle');
  if (!subtitle) return;
  const chars = "!@#$%^&*()_+-=[]{}|;':\",./<>?";
  setInterval(() => {
    if (Math.random() > 0.92) {
      const pos = Math.floor(Math.random() * originalText.length);
      const char = chars[Math.floor(Math.random() * chars.length)];
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
