import { initTerrainField } from './terrain.js';
import { initNavbarStatus } from './navbar.js';
import { renderProjects, syncGitHubStars } from './projects.js';
import { setupSubtitleGlitch, initHudTargetTracker } from './ui.js';
import { initThemeToggle } from './theme.js';
import { initAsciiPortrait } from './portrait.js';
import { initScrollRestore } from './scroll-restore.js';

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

function setupExperience(experience) {
  if (!Array.isArray(experience)) return;
  const container = document.getElementById('experience-list');
  if (!container) return;
  container.innerHTML = experience.map((item, idx) => {
    const isActive = /present/i.test(item.period || '');
    return `
    <div class="exp-item ${idx < experience.length - 1 ? 'border-b border-ph-500/10 pb-6' : ''}">
      <span class="exp-node${isActive ? ' is-active' : ''}" aria-hidden="true"></span>
      <div class="flex flex-col sm:flex-row justify-between gap-1">
        <div>
          <span class="text-ph-200 font-bold text-base">${esc(item.role || '')}</span>
          <span class="text-ph-400 text-sm"> · ${esc(item.company || '')}${item.type ? ` · ${esc(item.type)}` : ''}</span>
        </div>
        <span class="text-ph-amber text-xs uppercase tracking-wider">${esc(item.period || '')}</span>
      </div>
      ${item.location ? `<div class="text-ph-400 text-xs mt-1">${esc(item.location)}</div>` : ''}
      ${item.description ? `<p class="text-ph-100/80 text-sm leading-relaxed mt-2">${esc(item.description)}</p>` : ''}
    </div>
  `;
  }).join('');
}

function setupStack(stack) {
  if (!stack) return;
  const stackGrid = document.getElementById('stack-grid');
  stackGrid.innerHTML = stack.map(item => `
    <div class="border border-ph-500/20 bg-ph-500/5 px-3 py-2 text-ph-200 flex items-center gap-2 rounded-sm hover:bg-ph-500/10 transition-colors">
      <span class="text-ph-500" aria-hidden="true">⬡</span> ${esc(item)}
    </div>
  `).join('');
}

function populateDOM() {
  if (!portfolioData) return;

  setupHero(portfolioData.hero);
  setupAbout(portfolioData.about);
  setupExperience(portfolioData.experience);
  setupStack(portfolioData.stack);

  renderProjects(portfolioData);

  const contact = portfolioData.contact;
  if (contact?.email) {
    const emailBtn = document.getElementById('contact-email-btn');
    emailBtn.href = `mailto:${esc(contact.email)}`;
    emailBtn.innerHTML = `<span>✉</span> ${esc(contact.email)}`;
  }
}

async function fetchGistOverrides(gistId) {
  try {
    const res = await fetch(`https://api.github.com/gists/${gistId}`);
    if (!res.ok) return null;
    const gist = await res.json();
    const jsonFile = Object.values(gist.files).find(f => f.filename.endsWith('.json'));
    return jsonFile?.content ? JSON.parse(jsonFile.content) : null;
  } catch (err) {
    console.warn('Gist fetch failed, using local data:', err);
    return null;
  }
}

async function syncRepoCount() {
  const profileUrl = portfolioData.hero?.socials?.github;
  if (!profileUrl || !portfolioData.about?.info?.REPOS) return;
  const login = profileUrl.split('/').findLast(Boolean);
  try {
    const res = await fetch(`https://api.github.com/users/${login}`);
    if (!res.ok) return;
    const { public_repos } = await res.json();
    if (typeof public_repos === 'number') {
      portfolioData.about.info.REPOS = String(public_repos);
      setupAbout(portfolioData.about);
    }
  } catch (err) {
    console.warn('Repo count sync failed, keeping the data.json value:', err);
  }
}

async function loadData() {
  try {
    const localResponse = await fetch('data.json');
    if (!localResponse.ok) throw new Error(`data.json responded ${localResponse.status}`);
    portfolioData = await localResponse.json();
  } catch (err) {
    console.error('Error loading portfolio data:', err);
    const subtitle = document.getElementById('hero-subtitle');
    if (subtitle) subtitle.textContent = 'OFFLINE_MODE';
    const hero = document.getElementById('hero');
    if (hero) {
      const note = document.createElement('p');
      note.className = 'text-ph-amber text-sm mt-6';
      note.textContent = 'profile data unavailable. Reload to retry, or reach me at m.ihsan.r30@gmail.com.';
      hero.appendChild(note);
    }
    return;
  }

  populateDOM();
  initHudTargetTracker();

  const gistId = portfolioData.config?.gistId;
  if (gistId) {
    const overrides = await fetchGistOverrides(gistId);
    if (overrides) {
      portfolioData = { ...portfolioData, ...overrides };
      populateDOM();
    }
  }

  await Promise.allSettled([
    syncGitHubStars(portfolioData, () => renderProjects(portfolioData)),
    syncRepoCount()
  ]);
}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();
  initScrollRestore();
  initThemeToggle();
  initAsciiPortrait();
  initTerrainField();
  initNavbarStatus();
  loadData();
});
