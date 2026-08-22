export function initThemeToggle() {
  const btn = document.getElementById('theme-switch');
  const sweep = document.querySelector('.theme-sweep');
  if (!btn) return;

  const stored = localStorage.getItem('theme');
  if (stored === 'light') {
    document.documentElement.dataset.theme = 'light';
    btn.classList.remove('on');
  }

  function playSweep(targetTheme) {
    if (!sweep || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    sweep.classList.remove('sweep-down', 'sweep-up');
    void sweep.offsetWidth;
    sweep.classList.add(targetTheme === 'light' ? 'sweep-down' : 'sweep-up');
  }

  function swapTheme(toLight) {
    const target = toLight ? 'light' : 'dark';
    if (toLight) {
      document.documentElement.dataset.theme = 'light';
      btn.classList.remove('on');
      localStorage.setItem('theme', 'light');
    } else {
      delete document.documentElement.dataset.theme;
      btn.classList.add('on');
      localStorage.setItem('theme', 'dark');
    }
    playSweep(target);
    document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: target } }));
  }

  btn.addEventListener('click', () => {
    swapTheme(document.documentElement.dataset.theme !== 'light');
  });
}
