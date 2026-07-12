export function renderProjects(portfolioData) {
  if (!portfolioData?.projects) return;

  const projects = portfolioData.projects;
  document.getElementById('project-count-title').textContent = `${projects.length} OBJECTS`;

  const tbody = document.getElementById('repo-table-body');
  tbody.innerHTML = projects.map((p, idx) => `
    <tr class="repo-row border-b border-ph-500/10 transition-colors" data-index="${idx}">
      <td class="py-3 pr-4 font-bold text-ph-300">
        <a href="${p.url}" target="_blank" class="retro-link" aria-label="Visit ${p.name} repository on GitHub">${p.name}</a>
      </td>
      <td class="py-3 pr-4 text-amber-400/80">${(p.stack || []).join(', ')}</td>
      <td class="py-3 text-right text-amber-400">${p.stars !== undefined ? p.stars : '--'}</td>
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
      .map(t => `<span class="border border-ph-500/20 bg-ph-500/5 px-2 py-0.5 text-[10px] text-ph-200">${t}</span>`)
      .join('');

    panel.innerHTML = `
      <div class="text-amber-400/70 mb-3 text-[10px]">$ cat ${project.name}/README.md</div>
      <h4 class="text-ph-100 font-bold text-sm mb-2 flex items-center gap-2">
        <span class="text-ph-500">▸</span> ${project.name}
      </h4>
      <p class="text-ph-300/80 leading-relaxed mb-4">${project.description || 'No description available.'}</p>
      <div class="flex flex-wrap gap-1.5 mb-4">
        ${stackHtml}
      </div>
      <div class="flex items-center justify-between text-[10px] text-ph-600 border-t border-ph-500/10 pt-3 mt-auto">
        <span class="text-amber-400/80">★ ${project.stars !== undefined ? project.stars : '--'} stars</span>
        <a href="${project.url}" target="_blank" class="retro-link" aria-label="Open ${project.name} repository on GitHub">open repo -></a>
      </div>
    `;
    panel.className = "border border-ph-500/20 bg-ph-900/10 rounded-sm p-4 text-xs font-mono h-full min-h-[210px] flex flex-col justify-between transition-colors";
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

  const fetches = portfolioData.projects.map(async (project, idx) => {
    if (!project.githubRepo) return;
    try {
      const res = await fetch(`https://api.github.com/repos/${project.githubRepo}`);
      if (res.ok) {
        const repoInfo = await res.json();
        portfolioData.projects[idx].stars = repoInfo.stargazers_count;
        if (!project.description && repoInfo.description) {
          portfolioData.projects[idx].description = repoInfo.description;
        }
      }
    } catch (err) {
      console.warn(`Failed to fetch stars for ${project.githubRepo}:`, err);
    }
  });

  await Promise.allSettled(fetches);
  if (onUpdate) onUpdate();
}
