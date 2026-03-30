function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const parts = dateStr.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return months[parseInt(parts[1], 10) - 1] + ' ' + parseInt(parts[2], 10) + ', ' + parts[0];
}

// Calculate decay multiplier for an entity based on days since last seen.
// Uses half-life decay: multiplier = 0.5^(daysSince / halfLife)
function _calcDecay(lastSeen, halfLifeDays) {
  if (!lastSeen) return 1.0;
  const msPerDay = 86400000;
  const daysSince = Math.max(0, (Date.now() - new Date(lastSeen).getTime()) / msPerDay);
  return Math.pow(0.5, daysSince / halfLifeDays);
}

// Calculate Jaccard similarity between two arrays treated as sets.
function _jaccard(setA, setB) {
  const a = new Set(setA);
  const b = new Set(setB);
  const intersection = [...a].filter(x => b.has(x)).length;
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : intersection / union;
}

function renderRelatedPosts(currentSlug) {
  Promise.all([
    fetch((window.location.pathname.includes('/posts/') ? '../' : '') + 'assets/data/knowledge-graph.json').then(r => r.json()),
    fetch((window.location.pathname.includes('/posts/') ? '../' : '') + 'assets/data/posts.json').then(r => r.json())
  ]).then(([graph, posts]) => {
    const basePath = window.location.pathname.includes('/posts/') ? '../' : '';
    const halfLife = (graph.config && graph.config.decayHalfLifeDays) || 30;

    // Find all entities that mention the current post
    const currentEntities = Object.entries(graph.entities).filter(([, entity]) =>
      entity.mentions && entity.mentions.includes(currentSlug)
    );
    if (!currentEntities.length) return;

    // Build edge lookup: source+target -> edge for quick access
    const edgeMap = {};
    (graph.edges || []).forEach(edge => {
      const key = [edge.source, edge.target].sort().join('||');
      edgeMap[key] = edge;
    });

    // Score other posts using edge strength, fitness, and decay
    const scoreboard = {};
    currentEntities.forEach(([entityName, entity]) => {
      const decay = _calcDecay(entity.lastSeen, halfLife);
      const entityFitness = (entity.fitness || 0.5) * decay;

      (entity.mentions || []).forEach(slug => {
        if (slug === currentSlug) return;
        if (!scoreboard[slug]) scoreboard[slug] = { score: 0, entities: [], edgeLabels: [] };

        // Base contribution weighted by fitness * decay
        scoreboard[slug].score += entityFitness;
        scoreboard[slug].entities.push(entityName);

        // Boost score using edge strength where an edge connects this entity to
        // any entity also in the target post
        currentEntities.forEach(([otherName]) => {
          if (otherName === entityName) return;
          const edgeKey = [entityName, otherName].sort().join('||');
          const edge = edgeMap[edgeKey];
          if (edge) {
            scoreboard[slug].score += edge.strength * entityFitness;
            const label = `${entityName} + ${otherName}`;
            if (!scoreboard[slug].edgeLabels.includes(label)) {
              scoreboard[slug].edgeLabels.push(label);
            }
          }
        });
      });
    });

    // Additionally incorporate Jaccard similarity via edges that share the current post
    currentEntities.forEach(([entityName, entity]) => {
      const decay = _calcDecay(entity.lastSeen, halfLife);
      const entityFitness = (entity.fitness || 0.5) * decay;
      const currentMentions = entity.mentions || [];

      Object.entries(graph.entities).forEach(([otherName, otherEntity]) => {
        if (otherName === entityName) return;
        const otherMentions = otherEntity.mentions || [];
        const similarity = _jaccard(currentMentions, otherMentions);
        if (similarity > 0) {
          otherMentions.forEach(slug => {
            if (slug === currentSlug) return;
            if (!scoreboard[slug]) return; // only boost already-connected posts
            scoreboard[slug].score += similarity * entityFitness * 0.5;
          });
        }
      });
    });

    const relatedSlugs = Object.entries(scoreboard)
      .sort((a, b) => b[1].score - a[1].score)
      .slice(0, 3)
      .map(([slug]) => slug);

    if (!relatedSlugs.length) return;

    const relatedPosts = relatedSlugs
      .map(slug => posts.find(p => p.slug === slug))
      .filter(Boolean);

    if (!relatedPosts.length) return;

    const cardsHtml = relatedPosts.map(post => {
      const entry = scoreboard[post.slug];
      const topEntities = entry.entities.slice(0, 3);
      const connectionLabel = entry.edgeLabels.length > 0
        ? `Connected via: ${entry.edgeLabels[0]}`
        : `Shared: ${topEntities.join(', ')}`;
      return (
        `<a href="${basePath}posts/${post.slug}.html" class="block bg-card border border-gray-200 rounded-xl p-4 hover:border-primary transition-colors">` +
          `<p class="text-xs text-muted mb-1">${formatDate(post.date)}</p>` +
          `<p class="text-sm font-semibold text-ink leading-snug mb-2">${escapeHtml(post.title)}</p>` +
          `<p class="text-xs text-muted line-clamp-2 mb-3">${escapeHtml(post.excerpt)}</p>` +
          `<div class="flex flex-wrap gap-1 mb-2">` +
            topEntities.map(e => `<span class="text-[10px] font-medium bg-primary/10 text-primary rounded-full px-2 py-0.5">${escapeHtml(e)}</span>`).join('') +
          `</div>` +
          `<p class="text-[10px] text-muted italic">${escapeHtml(connectionLabel)}</p>` +
        `</a>`
      );
    }).join('');

    const section = document.createElement('section');
    section.className = 'max-w-3xl mx-auto px-6 py-10 border-t border-gray-200';
    section.innerHTML =
      `<div class="flex items-center gap-4 mb-6">` +
        `<p class="text-xs font-semibold uppercase tracking-widest text-muted">Related Posts</p>` +
        `<div class="h-px flex-1 bg-gray-200"></div>` +
      `</div>` +
      `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">${cardsHtml}</div>`;

    const footer = document.querySelector('footer');
    if (footer) footer.insertAdjacentElement('beforebegin', section);
  }).catch(err => console.error('Error loading related posts:', err));
}

function renderNav(activePage, basePath = '') {
  const pages = [
    { key: 'radar',     href: `${basePath}radar.html`,     label: 'RADAR' },
    { key: 'learn',      href: `${basePath}learn.html`,      label: 'LEARN' },
    { key: 'community',  href: `${basePath}community.html`,  label: 'COMMUNITY' },
    { key: 'jobs',       href: `${basePath}jobs.html`,       label: 'JOBS' },
    { key: 'readiness',  href: `${basePath}readiness.html`,  label: 'READINESS' }
  ];

  const linksHtml = pages.map(p => {
    const isActive = p.key === activePage;
    const activeClasses = isActive
      ? 'text-ink font-bold'
      : 'text-gray-400 font-medium hover:text-ink';
    return `<a href="${p.href}" class="text-[11px] tracking-widest uppercase transition-colors ${activeClasses}${isActive ? ' active' : ''}">${p.label}</a>`;
  }).join('');

  const currentTheme = localStorage.getItem('theme') || 'light';
  if (currentTheme === 'dark') {
    document.documentElement.classList.add('dark');
  }
  const themeIcon = (document.documentElement.classList.contains('dark')) ? 'light_mode' : 'dark_mode';
  const toggleBtn = `<button id="theme-toggle" aria-label="Toggle dark mode" class="flex items-center justify-center text-ink hover:text-primary transition-colors ml-2"><span class="material-symbols-outlined" style="font-size:20px">${themeIcon}</span></button>`;

  const navHtml = `
    <div class="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
      <a href="${basePath}index.html" class="text-sm font-black tracking-tight text-ink hover:text-primary transition-colors" aria-label="Home">IMPACT</a>
      <div class="nav-links hidden sm:flex items-center gap-8">${linksHtml}${toggleBtn}</div>
      <div class="flex items-center gap-2 sm:hidden">
        ${toggleBtn.replace('id="theme-toggle"', 'id="theme-toggle-mobile"')}
        <button class="nav-toggle flex items-center justify-center text-ink" aria-label="Menu">
          <span class="material-symbols-outlined" style="font-size:22px">menu</span>
        </button>
      </div>
    </div>
    <div class="nav-links-mobile hidden sm:hidden border-t border-gray-200 bg-white/95">
      <div class="max-w-5xl mx-auto px-6 py-4 flex flex-col gap-4">
        ${pages.map(p => {
          const isActive = p.key === activePage;
          const activeClasses = isActive ? 'text-ink font-bold' : 'text-gray-400 font-medium';
          return `<a href="${p.href}" class="text-[11px] tracking-widest uppercase ${activeClasses}">${p.label}</a>`;
        }).join('')}
      </div>
    </div>
  `;

  const navEl = document.getElementById('main-nav');
  if (navEl) {
    navEl.className = 'fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200';
    navEl.innerHTML = navHtml;

    const toggle = navEl.querySelector('.nav-toggle');
    const mobileMenu = navEl.querySelector('.nav-links-mobile');
    if (toggle && mobileMenu) {
      toggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
      mobileMenu.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          mobileMenu.classList.add('hidden');
        });
      });
    }

    function applyThemeToggle(btn) {
      if (!btn) return;
      btn.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        const icon = isDark ? 'light_mode' : 'dark_mode';
        navEl.querySelectorAll('#theme-toggle .material-symbols-outlined, #theme-toggle-mobile .material-symbols-outlined').forEach(el => {
          el.textContent = icon;
        });
      });
    }
    applyThemeToggle(navEl.querySelector('#theme-toggle'));
    applyThemeToggle(navEl.querySelector('#theme-toggle-mobile'));
  }
}
