import { initDataRain } from './matrix.js';
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
      <span class="text-ph-500" aria-hidden="true">⬡</span> ${esc(item)}
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

const statusEl = () => document.getElementById('data-status');

function showStatus(html) {
  const el = statusEl();
  if (!el) return;
  el.innerHTML = html;
  el.classList.remove('hidden');
}

function hideStatus() {
  const el = statusEl();
  if (el) el.classList.add('hidden');
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

// The star counts refresh from the API on every load, so the repo count should
// too: a hand-maintained number goes stale silently while looking just as sure.
async function syncRepoCount() {
  const profileUrl = portfolioData.hero?.socials?.github;
  if (!profileUrl || !portfolioData.about?.info?.REPOS) return;
  const login = profileUrl.split('/').filter(Boolean).pop();
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
  // Only announce loading once it is slow enough to notice, so a local fetch
  // does not flash a banner on every visit.
  const slowLoad = setTimeout(
    () => showStatus('<span class="text-ph-amber">&gt; $ fetch data.json</span><br><span class="text-ph-300">Still waiting on the profile data...</span>'),
    400
  );

  try {
    const localResponse = await fetch('data.json');
    if (!localResponse.ok) throw new Error(`data.json responded ${localResponse.status}`);
    portfolioData = await localResponse.json();
  } catch (err) {
    console.error('Error loading portfolio data:', err);
    document.getElementById('hero-subtitle').textContent = 'OFFLINE_MODE';
    showStatus(
      '<span class="text-ph-amber">&gt; $ cat data.json</span><br>' +
      `<span class="text-ph-100">ERROR: could not read the profile data (${esc(err.message)}).</span><br>` +
      '<span class="text-ph-300">Nothing below this line could be filled in. ' +
      'Reload to retry, or reach me at <a class="retro-link" href="mailto:m.ihsan.r30@gmail.com">m.ihsan.r30@gmail.com</a>.</span>'
    );
    return;
  } finally {
    clearTimeout(slowLoad);
  }

  hideStatus();

  // Paint what we already have on disk; the GitHub round-trips below can be
  // slow or rate-limited, and nothing on screen should wait on them.
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
  initThemeToggle();
  initDataRain();
  initNavbarStatus();
  revealSections();
  loadData();
});
