/**
 * Component 8 — Technical Blog
 * Technical engineering case analyses and architectural articles with search,
 * category filtering, code block syntax highlighting, and an accessible article reader.
 */

import { BLOG_ARTICLES } from '../data/portfolioData.js';

export function initBlog() {
  const container = document.getElementById('blogContainer');
  const searchInput = document.getElementById('blogSearchInput');
  const modal = document.getElementById('blogReaderModal');
  const modalTitle = document.getElementById('blogReaderTitle');
  const modalDate = document.getElementById('blogReaderDate');
  const modalBody = document.getElementById('blogReaderContent');
  const modalClose = document.getElementById('blogReaderClose');

  if (!container) return;

  let activeCategory = 'All';
  let searchQuery = '';
  let lastActiveElement = null;

  function getFilteredArticles() {
    return BLOG_ARTICLES.filter(a => {
      const matchCat = (activeCategory === 'All' || a.category === activeCategory);
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || (
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q))
      );
      return matchCat && matchSearch;
    });
  }

  function renderGrid() {
    const list = getFilteredArticles();

    if (list.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 48px 24px; text-align: center; color: var(--text-muted); background: var(--bg-secondary); border: 1px dashed var(--border-default); border-radius: var(--radius-md);">
          <p style="font-family: var(--font-mono);">No technical articles match query: "${searchQuery}"</p>
        </div>
      `;
      return;
    }

    container.innerHTML = list.map(article => `
      <article class="spotlight-card blog-card" data-slug="${article.slug}">
        <div class="blog-meta-top">
          <span>${article.date}</span>
          <span style="color:var(--accent-cyan);">${article.readTime}</span>
        </div>

        <h3 class="blog-title">${article.title}</h3>
        <p class="blog-excerpt">${article.excerpt}</p>

        <div class="blog-tags">
          ${article.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}
        </div>

        <button class="blog-read-btn open-article-btn" data-slug="${article.slug}">
          Read Deep Dive ↗
        </button>
      </article>
    `).join('');

    // Bind Read buttons
    container.querySelectorAll('.open-article-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const slug = btn.getAttribute('data-slug');
        openArticle(slug, btn);
      });
    });
  }

  function openArticle(slug, triggerBtn) {
    const article = BLOG_ARTICLES.find(a => a.slug === slug);
    if (!article) return;

    lastActiveElement = triggerBtn;
    modalTitle.textContent = article.title;
    modalDate.textContent = `Published on ${article.date} • ${article.readTime} • Category: ${article.category}`;

    // Simple markdown-to-HTML parser for code blocks & headers
    modalBody.innerHTML = formatMarkdown(article.content);

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (modalClose) modalClose.focus();
  }

  function closeArticle() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastActiveElement) {
      lastActiveElement.focus();
      lastActiveElement = null;
    }
  }

  if (modalClose) modalClose.addEventListener('click', closeArticle);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeArticle();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeArticle();
    }
  });

  // Filter pills
  document.querySelectorAll('.blog-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategory = btn.getAttribute('data-cat');
      document.querySelectorAll('.blog-cat-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-cat') === activeCategory);
      });
      renderGrid();
    });
  });

  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderGrid();
    });
  }

  renderGrid();
}

function formatMarkdown(content) {
  let html = content.trim();

  // Convert fenced code blocks
  html = html.replace(/```([a-z]*)\n([\s\S]*?)```/g, (match, lang, code) => {
    return `
      <div style="position:relative; margin:16px 0;">
        <span style="position:absolute; right:12px; top:8px; font-family:var(--font-mono); font-size:0.6875rem; color:var(--text-muted); text-transform:uppercase;">${lang || 'code'}</span>
        <pre><code>${escapeHtml(code.trim())}</code></pre>
      </div>
    `;
  });

  // Convert H3
  html = html.replace(/### (.*?)\n/g, '<h3 style="color:var(--text-primary); margin-top:20px; font-size:1.1875rem;">$1</h3>');

  // Convert inline backticks
  html = html.replace(/`([^`]+)`/g, '<code style="background:rgba(0,229,255,0.08); padding:2px 6px; border-radius:4px; font-family:var(--font-mono); font-size:0.875rem; color:var(--accent-cyan);">$1</code>');

  // Paragraphs
  html = html.split('\n\n').map(p => {
    if (p.startsWith('<h3') || p.startsWith('<div style="position:relative;')) return p;
    return `<p style="line-height:1.7; color:var(--text-secondary); margin-bottom:12px;">${p}</p>`;
  }).join('');

  return html;
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
