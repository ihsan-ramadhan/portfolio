import { initDataRain } from './matrix.js';
import { startBootSequence } from './boot.js';
import { initNavbarStatus } from './navbar.js';
import { renderProjects, syncGitHubStars } from './projects.js';
import { setupSubtitleGlitch, revealSections, initHudTargetTracker } from './ui.js';
import { initThemeToggle } from './theme.js';

let portfolioData = null;

const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const BLANK_REL = 'noopener noreferrer';

function setupHero(hero) {
  if (!hero) return;
  if (hero.name) {
    const parts = hero.name.split(' ');
    const nameContainer = document.getElementById('hero-name-container');
    if (parts.length >= 2) {
      nameContainer.innerHTML = `<span class="glitch-pass">${parts.slice(0, -1).join(' ')}</span><br class="hidden md:block"><span class="md:hidden"> </span><span class="glitch-pass">${parts[parts.length - 1]}</span>`;
    } else {
      nameContainer.innerHTML = `<span class="glitch-pass">${hero.name}</span>`;
    }
    document.getElementById('footer-name').textContent = hero.name;
  }
  if (hero.subtitle) {
    document.getElementById('hero-subtitle').textContent = hero.subtitle;
    setupSubtitleGlitch(hero.subtitle);
  }
  const descEl = document.getElementById('hero-description');
  if (descEl) {
    if (hero.description) {
      descEl.textContent = hero.description;
      descEl.classList.remove('hidden');
    } else {
      descEl.remove();
    }
  }
  if (hero.socials) {
    const socialsContainer = document.getElementById('hero-socials');
    socialsContainer.innerHTML = Object.entries(hero.socials)
      .map(([key, url]) => `<a href="${esc(url)}" target="_blank" rel="${BLANK_REL}" class="retro-btn px-4 py-2 rounded-sm text-ph-300 font-bold" aria-label="${esc(key.charAt(0).toUpperCase() + key.slice(1))} Profile">[${esc(key.toUpperCase())}]</a>`)
      .join('');
  }
}

function setupAbout(about) {
  if (!about) return;
  if (about.whoami) {
    const whoamiContainer = document.getElementById('about-whoami');
    whoamiContainer.innerHTML = about.whoami.map(para => `<p>${esc(para)}</p>`).join('');
  }
  if (about.info) {
    const infoContainer = document.getElementById('about-info-grid');
    infoContainer.innerHTML = Object.entries(about.info)
      .map(([key, val]) => `
        <div class="flex justify-between border-b border-ph-500/10 pb-1">
          <span class="text-ph-400 font-bold">${esc(key.toUpperCase())}</span>
          <span class="text-ph-300">${esc(val)}</span>
        </div>
      `).join('');
  }
}

function setupStack(stack) {
  if (!stack) return;
  const stackGrid = document.getElementById('stack-grid');
  stackGrid.innerHTML = stack.map(item => `
    <div class="border border-ph-500/20 bg-ph-500/5 px-3 py-2 text-ph-200 flex items-center gap-2 rounded-sm hover:bg-ph-500/10 transition-colors">
      <span class="text-ph-600">⬡</span> ${esc(item)}
    </div>
  `).join('');
}

function populateDOM() {
  if (!portfolioData) return;

  document.getElementById('year').textContent = new Date().getFullYear();

  setupHero(portfolioData.hero);
  setupAbout(portfolioData.about);
  setupStack(portfolioData.stack);

  renderProjects(portfolioData);

  const contact = portfolioData.contact;
  if (contact?.email) {
    const emailBtn = document.getElementById('contact-email-btn');
    emailBtn.href = `mailto:${esc(contact.email)}`;
    emailBtn.innerHTML = `<span>✉</span> ${esc(contact.email)}`;
  }
}

async function loadData() {
  try {
    const localResponse = await fetch('data.json');
    if (!localResponse.ok) throw new Error('Failed to load local data.json');
    let data = await localResponse.json();

    if (data?.config?.gistId) {
      try {
        const gistRes = await fetch(`https://api.github.com/gists/${data.config.gistId}`);
        if (gistRes.ok) {
          const gistData = await gistRes.json();
          const firstJsonFile = Object.values(gistData.files).find(f => f.filename.endsWith('.json'));
          if (firstJsonFile?.content) {
            const remoteData = JSON.parse(firstJsonFile.content);
            data = { ...data, ...remoteData };
          }
        }
      } catch (gistErr) {
        console.warn('Gist fetch failed, using local data:', gistErr);
      }
    }

    portfolioData = data;
    populateDOM();

    await syncGitHubStars(portfolioData, () => renderProjects(portfolioData));
  } catch (err) {
    console.error('Error loading portfolio data:', err);
    document.getElementById('hero-subtitle').textContent = 'OFFLINE_MODE';
  }
}

window.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initDataRain();
  initNavbarStatus();
  loadData();
  startBootSequence(() => {
    revealSections();
    initHudTargetTracker();
  });
});
