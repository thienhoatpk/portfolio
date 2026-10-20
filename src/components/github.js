/**
 * Component 9 — GitHub Activity & Repository Explorer
 * Real-time public GitHub API integration with client-side caching (sessionStorage),
 * rate-limit fallback handling, and an interactive username switcher.
 */

import { CONFIG } from '../data/portfolioData.js';

export function initGitHub() {
  const container = document.getElementById('githubContainer');
  if (!container) return;

  let currentUsername = CONFIG.githubUser;

  // Language color map
  const langColors = {
    'Go': '#00ADD8',
    'TypeScript': '#3178C6',
    'JavaScript': '#F7DF1E',
    'Python': '#3572A5',
    'HTML': '#E34F26',
    'CSS': '#563D7C',
    'Rust': '#DEA584',
    'Shell': '#89E051',
    'C++': '#F34B7D'
  };

  // Safe fallback repositories in case GitHub API rate limits (60 req/hr) or offline
  const fallbackData = {
    user: {
      login: CONFIG.githubUser,
      name: CONFIG.name,
      avatar_url: 'https://avatars.githubusercontent.com/u/9919?v=4',
      bio: 'Systems & backend engineering enthusiast focusing on Go, microservices, and distributed pipelines.',
      public_repos: 12,
      followers: 8,
      following: 14,
      html_url: CONFIG.social.github
    },
    repos: [
      {
        name: 'event-stream-engine',
        description: 'High-throughput stream processing pipeline in Go with Kafka partition management.',
        language: 'Go',
        stargazers_count: 24,
        forks_count: 5,
        html_url: `${CONFIG.social.github}/event-stream-engine`,
        updated_at: '2024-09-12T14:20:00Z'
      },
      {
        name: 'distributed-cache-proxy',
        description: 'Consistent-hashing Redis caching gateway with circuit breaking and virtual node balancing.',
        language: 'Go',
        stargazers_count: 18,
        forks_count: 3,
        html_url: `${CONFIG.social.github}/distributed-cache-proxy`,
        updated_at: '2024-08-05T09:15:00Z'
      },
      {
        name: 'cloud-rag-orchestrator',
        description: 'Scalable RAG backend with hybrid Qdrant vector search and lexical ranking.',
        language: 'Python',
        stargazers_count: 32,
        forks_count: 7,
        html_url: `${CONFIG.social.github}/cloud-rag-orchestrator`,
        updated_at: '2024-07-21T16:45:00Z'
      },
      {
        name: 'aegis-telemetry-daemon',
        description: 'Resource-efficient host metrics exporter utilizing eBPF and Prometheus endpoints.',
        language: 'Go',
        stargazers_count: 15,
        forks_count: 2,
        html_url: `${CONFIG.social.github}/aegis-telemetry-daemon`,
        updated_at: '2024-06-18T11:00:00Z'
      }
    ]
  };

  async function fetchGitHubData(username) {
    const cacheKey = `gh_cache_${username}`;
    const cached = sessionStorage.getItem(cacheKey);

    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        // Cache valid for 30 minutes
        if (Date.now() - parsed.timestamp < 30 * 60 * 1000) {
          return { data: parsed.data, isCached: true, isFallback: false };
        }
      } catch (e) {
        // invalid cache, ignore
      }
    }

    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${encodeURIComponent(username)}`),
        fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=6`)
      ]);

      if (userRes.status === 403 || reposRes.status === 403) {
        // Rate limited
        return { data: fallbackData, isCached: false, isFallback: true, error: 'Rate limit reached on GitHub unauthenticated API.' };
      }

      if (!userRes.ok || !reposRes.ok) {
        throw new Error(`GitHub API returned status ${userRes.status}`);
      }

      const userData = await userRes.json();
      const reposData = await reposRes.json();

      const combined = { user: userData, repos: reposData };
      sessionStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: combined }));

      return { data: combined, isCached: false, isFallback: false };
    } catch (err) {
      return { data: fallbackData, isCached: false, isFallback: true, error: err.message };
    }
  }

  async function render() {
    container.innerHTML = `
      <div style="padding: 40px; text-align: center; color: var(--accent-cyan); font-family: var(--font-mono);">
        <span class="status-indicator" style="display:inline-block; width:8px; height:8px; border-radius:50%; background:var(--accent-cyan); animation:pulse-glow 1s infinite;"></span>
        Establishing secure handshake with api.github.com for @${currentUsername}...
      </div>
    `;

    const { data, isCached, isFallback, error } = await fetchGitHubData(currentUsername);
    const { user, repos } = data;

    container.innerHTML = `
      <div class="github-wrap">
        <!-- Profile Banner -->
        <div class="github-user-card spotlight-card">
          <div class="gh-profile-left">
            <img src="${user.avatar_url || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'}" 
                 alt="${user.login} GitHub Avatar" 
                 class="gh-avatar" 
                 loading="lazy" 
                 width="60" 
                 height="60" />
            <div class="gh-user-info">
              <span class="gh-user-name">${user.name || user.login}</span>
              <span class="gh-user-handle">@${user.login}</span>
              <p style="font-size:0.875rem; color:var(--text-secondary); margin-top:4px;">${user.bio || 'Backend & Cloud Systems Engineer'}</p>
            </div>
          </div>

          <div class="gh-stats-row">
            <div class="gh-stat">
              <span class="gh-stat-val">${user.public_repos ?? 0}</span>
              <span class="gh-stat-lbl">Repositories</span>
            </div>
            <div class="gh-stat">
              <span class="gh-stat-val">${user.followers ?? 0}</span>
              <span class="gh-stat-lbl">Followers</span>
            </div>
            <div class="gh-stat">
              <span class="gh-stat-val">${user.following ?? 0}</span>
              <span class="gh-stat-lbl">Following</span>
            </div>
          </div>

          <div>
            <a href="${user.html_url}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
              View on GitHub ↗
            </a>
          </div>
        </div>

        <!-- Controls: Username inspect & status pill -->
        <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; font-family: var(--font-mono); font-size: 0.8125rem;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <label for="ghUserSwitch" style="color: var(--text-muted);">Inspect User:</label>
            <input type="text" id="ghUserSwitch" value="${currentUsername}" 
                   style="background: var(--bg-secondary); border: 1px solid var(--border-default); border-radius: var(--radius-sm); padding: 4px 10px; color: var(--text-primary); font-size: 0.8125rem; width: 140px;" />
            <button class="btn btn-secondary btn-sm" id="ghSwitchBtn" style="padding: 4px 10px;">Fetch</button>
          </div>

          <div style="color: var(--text-muted); font-size: 0.75rem;">
            ${isFallback 
              ? `<span style="color:var(--accent-amber);">● Cached/Fallback Mode (${error || 'Public rate limit'})</span>` 
              : `<span style="color:#10B981;">● Live Sync Active ${isCached ? '(Local Cache)' : ''}</span>`
            }
          </div>
        </div>

        <!-- Repositories Grid -->
        <div class="gh-repos-grid">
          ${repos && repos.length > 0 ? repos.map(repo => {
            const langColor = langColors[repo.language] || '#00E5FF';
            return `
              <div class="spotlight-card gh-repo-card">
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="gh-repo-name">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                  <span>${repo.name}</span>
                </a>
                <p class="gh-repo-desc">${repo.description || 'Public software engineering repository.'}</p>
                <div class="gh-repo-meta">
                  ${repo.language ? `
                    <span class="gh-lang-pill">
                      <span class="gh-lang-dot" style="background:${langColor};"></span>
                      <span>${repo.language}</span>
                    </span>
                  ` : '<span>General</span>'}
                  <div style="display:flex; gap:12px;">
                    <span>★ ${repo.stargazers_count}</span>
                    <span>⑂ ${repo.forks_count}</span>
                  </div>
                </div>
              </div>
            `;
          }).join('') : `
            <div style="grid-column: 1 / -1; padding: 32px; text-align: center; color: var(--text-muted); background: var(--bg-secondary); border-radius: var(--radius-md);">
              No public repositories found for this account.
            </div>
          `}
        </div>
      </div>
    `;

    // Bind username switcher
    const switchBtn = container.querySelector('#ghSwitchBtn');
    const switchInput = container.querySelector('#ghUserSwitch');
    if (switchBtn && switchInput) {
      const handleSwitch = () => {
        const val = switchInput.value.trim();
        if (val && val !== currentUsername) {
          currentUsername = val;
          render();
        }
      };
      switchBtn.addEventListener('click', handleSwitch);
      switchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleSwitch();
      });
    }
  }

  render();
}
