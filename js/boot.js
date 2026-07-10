const bootLines = [
  "BIOS DATE 10/05/26",
  "CPU: IHSAN_CPU @ 3.30GHz",
  "CHECKING NVRAM... OK",
  "LOADING KERNEL...",
  "MOUNTING LOCAL FILESYSTEM [ihsan.is-a.dev] ... OK",
  "MOUNTING REMOTE RESOURCES [github.com] ... OK",
  "INIT NETSTACK... CONNECTED",
  "LOADING USER profile: muhammad_ihsan_ramadhan",
  "ROLE: fullstack_developer",
  "AFFILIATION: politeknik_negeri_bandung",
  "RUNNING startup scripts...",
  "> ACCESS GRANTED."
];

export function startBootSequence(onComplete) {
  const bootContent = document.getElementById('boot-content');
  const bootOverlay = document.getElementById('boot-overlay');
  const mainSite = document.getElementById('main-site');
  let lineIdx = 0;

  function typeBootLine() {
    if (lineIdx >= bootLines.length) {
      setTimeout(() => {
        bootOverlay.style.transition = 'opacity 0.4s';
        bootOverlay.style.opacity = '0';
        setTimeout(() => {
          bootOverlay.style.display = 'none';
          mainSite.classList.remove('hidden');
          const nav = document.querySelector('.navbar-scroll');
          if (nav) nav.style.display = 'flex';
          if (onComplete) onComplete();
        }, 400);
      }, 300);
      return;
    }
    const div = document.createElement('div');
    div.className = 'boot-line mb-1';
    div.style.animationDelay = '0s';
    div.textContent = bootLines[lineIdx];
    bootContent.appendChild(div);
    lineIdx++;
    setTimeout(typeBootLine, 80);
  }

  setTimeout(typeBootLine, 200);
}
