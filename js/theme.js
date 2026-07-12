export function initThemeToggle() {
  const btn = document.getElementById('theme-switch');
  const degauss = document.getElementById('crt-degauss');
  if (!btn || !degauss) return;

  const stored = localStorage.getItem('theme');
  if (stored === 'light') {
    document.documentElement.dataset.theme = 'light';
    btn.classList.remove('on');
  }

  function swapTheme(isDark) {
    if (isDark) {
      document.documentElement.dataset.theme = 'light';
      btn.classList.remove('on');
      localStorage.setItem('theme', 'light');
    } else {
      delete document.documentElement.dataset.theme;
      btn.classList.add('on');
      localStorage.setItem('theme', 'dark');
    }
  }

  btn.addEventListener('click', () => {
    const isDark = !document.documentElement.dataset.theme;

    degauss.classList.add('sweep-active');
    document.body.classList.add('theme-glitching');

    if (document.startViewTransition) {
      document.startViewTransition(() => {
        swapTheme(isDark);
      });
    } else {
      swapTheme(isDark);
    }

    setTimeout(() => {
      degauss.classList.remove('sweep-active');
      document.body.classList.remove('theme-glitching');
    }, 420);
  });
}
