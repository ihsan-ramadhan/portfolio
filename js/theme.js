export function initThemeToggle() {
  const btn = document.getElementById('theme-switch');
  const degauss = document.getElementById('crt-degauss');
  if (!btn || !degauss) return;

  const stored = localStorage.getItem('theme');
  if (stored === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    btn.classList.remove('on');
  }

  btn.addEventListener('click', () => {
    const isDark = !document.documentElement.getAttribute('data-theme');
    degauss.classList.add('flash');
    setTimeout(() => degauss.classList.remove('flash'), 400);

    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'light');
      btn.classList.remove('on');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
      btn.classList.add('on');
      localStorage.setItem('theme', 'dark');
    }
  });
}
