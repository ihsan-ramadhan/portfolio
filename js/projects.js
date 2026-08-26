const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const BLANK_REL = 'noopener noreferrer';

const CACHE_KEY = 'gh_stars_cache';
const CACHE_TTL = 1000 * 60 * 60; // 1 jam
const CACHE_VERSION = 1;

function loadStarsCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed.v !== CACHE_VERSION || Date.now() - parsed.t > CACHE_TTL) return {};
    return parsed.data || {};
  } catch {
    return {};
  }
}

function saveStarsCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ v: CACHE_VERSION, t: Date.now(), data }));
  } catch { /* storage unavailable */ }
}

export function renderProjects(portfolioData) {
  if (!portfolioData?.projects) return;

  const projects = portfolioData.projects;
  document.getElementById('project-count-title').textContent = `${projects.length} OBJECTS`;

  const tbody = document.getElementById('repo-table-body');
  tbody.innerHTML = projects.map((p, idx) => `
    <tr class="repo-row border-b border-ph-500/10 transition-colors" data-index="${idx}">
      <td class="py-3 pr-4 font-bold text-ph-300">
        <a href="${esc(p.url)}" target="_blank" rel="${BLANK_REL}" class="retro-link" aria-label="Visit ${esc(p.name)} repository on GitHub">${esc(p.name)}</a>
      </td>
      <td class="py-3 pr-4 text-ph-amber">${(p.stack || []).map(esc).join(', ')}</td>
      <td class="py-3 text-right text-ph-amber">${p.stars !== undefined ? esc(p.stars) : '--'}</td>
    </tr>
  `).join('');

  setupProjectInteractivity(portfolioData);
}

export function setupProjectInteractivity(portfolioData) {
  const rows = document.querySelectorAll('.repo-row');
  const panel = document.getElementById('repo-detail');
  if (!rows.length || !panel) return;

  function renderDetail(idx) {
    const project = portfolioData.projects[idx];
    if (!project) return;

    const stackHtml = (project.stack || [])
      .map(t => `<span class="bg-ph-500/10 px-2 py-0.5 text-[10px] text-ph-200 rounded-sm">${esc(t)}</span>`)
      .join('');

    panel.innerHTML = `
      <div class="text-ph-amber mb-3 text-[10px]">$ cat ${esc(project.name)}/README.md</div>
      <h4 class="text-ph-100 font-bold text-sm mb-2 flex items-center gap-2">
        <span class="text-ph-500">▸</span> ${esc(project.name)}
      </h4>
      <p class="text-ph-300/80 leading-relaxed mb-4">${esc(project.description || 'No description available.')}</p>
      <div class="flex flex-wrap gap-1.5 mb-4">
        ${stackHtml}
      </div>
      <div class="flex items-center justify-between text-[10px] text-ph-600 border-t border-ph-500/10 pt-3 mt-auto">
        <span class="text-ph-amber">★ ${project.stars !== undefined ? esc(project.stars) : '--'} stars</span>
        <a href="${esc(project.url)}" target="_blank" rel="${BLANK_REL}" class="retro-link" aria-label="Open ${esc(project.name)} repository on GitHub">open repo -></a>
      </div>
    `;
    panel.className = "border-l-2 border-ph-amber/40 p-4 text-xs font-mono h-full min-h-[210px] flex flex-col justify-between transition-colors";
  }

  rows.forEach(row => {
    const idx = row.dataset.index;
    row.addEventListener('mouseenter', () => renderDetail(idx));
    row.addEventListener('click', (e) => {
      if (!e.target.closest('a')) {
        renderDetail(idx);
      }
    });
  });
}

export async function syncGitHubStars(portfolioData, onUpdate) {
  if (!portfolioData?.projects) return;

  const cache = loadStarsCache();
  let changed = false;

  const fetches = portfolioData.projects.map(async (project, idx) => {
    if (!project.githubRepo) return;
    const cached = cache[project.githubRepo];
    if (cached) {
      portfolioData.projects[idx].stars = cached.stars;
      if (!project.description && cached.description) {
        portfolioData.projects[idx].description = cached.description;
      }
      changed = true;
      return;
    }
    try {
      const res = await fetch(`https://api.github.com/repos/${project.githubRepo}`);
      if (res.ok) {
        const repoInfo = await res.json();
        cache[project.githubRepo] = {
          stars: repoInfo.stargazers_count,
          description: repoInfo.description || null
        };
        portfolioData.projects[idx].stars = repoInfo.stargazers_count;
        if (!project.description && repoInfo.description) {
          portfolioData.projects[idx].description = repoInfo.description;
        }
        changed = true;
      } else if (res.status === 404) {
        console.warn(`Repo not found for ${project.githubRepo} (404) — check data.json githubRepo`);
      }
    } catch (err) {
      console.warn(`Failed to fetch stars for ${project.githubRepo}:`, err);
    }
  });

  await Promise.allSettled(fetches);
  if (changed) saveStarsCache(cache);
  if (onUpdate) onUpdate();
}
