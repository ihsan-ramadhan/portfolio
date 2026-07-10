export function initNavbarStatus() {
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const statusLink = document.getElementById('nav-system-status');

  function handleScrollClick(e) {
    const href = e.currentTarget.getAttribute('href');
    if (!href?.startsWith('#')) return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const navbarHeight = document.querySelector('.navbar-scroll')?.offsetHeight || 80;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 16;
      window.scrollTo({
        top: targetPos,
        behavior: 'smooth'
      });
    }
  }

  if (statusLink) {
    statusLink.addEventListener('click', handleScrollClick);
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('hidden');
      navToggle.textContent = navLinks.classList.contains('hidden') ? '[MENU]' : '[CLOSE]';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        handleScrollClick(e);
        if (window.innerWidth < 640) {
          navLinks.classList.add('hidden');
          navToggle.textContent = '[MENU]';
        }
      });
    });
  }
}
