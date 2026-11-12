const KEY_Y = 'scrollY';

const marker = 'restoring';
const root = document.documentElement;

const sections = () => Array.from(document.querySelectorAll('main#main-site section.window-chrome'));

function sectionAt(y) {
  const anchor = y + window.innerHeight * 0.3;
  let found = null;
  for (const sec of sections()) {
    const top = sec.getBoundingClientRect().top + window.scrollY;
    if (top <= anchor) found = sec;
  }
  return found || sections()[0];
}

function persist() {
  try {
    sessionStorage.setItem(KEY_Y, String(Math.round(window.scrollY)));
  } catch { /* storage blocked, refresh just starts at the top */ }
}

function apply() {
  const y = Number(sessionStorage.getItem(KEY_Y) || 0);
  if (!y) return true;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const target = Math.max(0, Math.min(y, max));
  window.scrollTo({ top: target, behavior: 'instant' });
  return Math.abs(window.scrollY - target) < 2;
}

function restoreWithRetries() {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  if (window.location.hash) {
    root.classList.remove(marker);
    return;
  }


  let attempts = 0;
  let lastHeight = -1;
  const tick = () => {
    const height = document.documentElement.scrollHeight;
    const settled = apply() && height === lastHeight;
    lastHeight = height;
    attempts += 1;
    if (!settled && attempts < 12) {
      requestAnimationFrame(tick);
      return;
    }
    root.classList.remove(marker);
    document.dispatchEvent(new CustomEvent('scrollrestored'));
  };
  requestAnimationFrame(tick);
}

export function initScrollRestore() {
  restoreWithRetries();

  let raf = 0;
  window.addEventListener('scroll', () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      persist();
    });
  }, { passive: true });
  window.addEventListener('pagehide', persist);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') persist();
  });
}
