// Pure helpers (testable outside DOMContentLoaded)
function normaliseResource(r) {
  return {
    ...r,
    type: r.type || 'article',
    author: r.author || '',
    description: r.description || ''
  };
}

function filterResources(resources, filter) {
  const normalised = resources.map(normaliseResource);
  return filter === 'all' ? normalised : normalised.filter(r => r.type === filter);
}

document.addEventListener('DOMContentLoaded', () => {
  renderNav('learn', '');

  let allData = [];
  let currentFilter = 'all';

  fetch('assets/data/resources.json')
    .then(r => r.json())
    .then(data => {
      allData = data;
      renderCards(data, 'all', false);
      setupFilters(data);
    })
    .catch(err => {
      const container = document.getElementById('resources-feed');
      if (container) container.innerHTML = '<p class="error-state col-span-3">Failed to load resources.</p>';
      console.error('Error loading resources:', err);
    });

  function setupFilters(data) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        renderCards(data, currentFilter, true);
        // Hide detail panel when filter changes
        document.getElementById('detail-panel').classList.add('hidden');
      });
    });
  }

  function getTypeIcon(type) {
    const icons = { xpost: 'campaign', youtube: 'play_circle', github: 'code', article: 'article', podcast: 'headphones' };
    return icons[type] || 'link';
  }

  function getTypeCount(resources, type) {
    if (type === 'all') return resources.length;
    return resources.filter(r => (r.type || 'article') === type).length;
  }

  function renderCards(data, filter, animate) {
    const container = document.getElementById('resources-feed');
    if (!container) return;

    if (animate) {
      container.style.opacity = '0';
      container.style.transform = 'translateY(8px)';
      setTimeout(() => doRender(), 150);
    } else {
      doRender();
    }

    function doRender() {

    // Filter topics that have matching resources
    const filtered = data.filter(topic => {
      const matching = filterResources(topic.resources, filter);
      return matching.length > 0;
    });

    if (filtered.length === 0) {
      container.innerHTML = '<p class="empty-state col-span-3">No resources found for this filter.</p>';
      return;
    }

    container.innerHTML = filtered.map((topic, idx) => {
      const resources = filterResources(topic.resources, filter);
      const typeIcons = [...new Set(resources.map(r => r.type))];
      const iconHtml = typeIcons.map(t =>
        `<span class="material-symbols-outlined text-sm text-muted">${getTypeIcon(t)}</span>`
      ).join('');

      return (
        `<div class="border border-gray-200 rounded-lg p-5 bg-card cursor-pointer hover:border-primary hover:shadow-sm transition-all duration-200 topic-card" data-index="${idx}">` +
          `<p class="text-[10px] font-semibold uppercase tracking-widest text-primary mb-2">${formatDate(topic.date)}</p>` +
          `<h3 class="text-sm font-bold text-ink mb-2 leading-snug">${escapeHtml(topic.topic)}</h3>` +
          `<p class="text-xs text-muted leading-relaxed mb-3 line-clamp-2">${escapeHtml(topic.relatedNews)}</p>` +
          `<div class="flex items-center justify-between">` +
            `<div class="flex items-center gap-1">${iconHtml}</div>` +
            `<span class="text-[10px] font-semibold text-muted uppercase tracking-wider">${resources.length} resource${resources.length !== 1 ? 's' : ''}</span>` +
          `</div>` +
        `</div>`
      );
    }).join('');

    // Click handlers
    container.querySelectorAll('.topic-card').forEach(card => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.dataset.index, 10);
        showDetail(filtered[idx]);

        // Highlight active card
        container.querySelectorAll('.topic-card').forEach(c => c.classList.remove('ring-2', 'ring-primary'));
        card.classList.add('ring-2', 'ring-primary');
      });
    });

    container.style.opacity = '1';
    container.style.transform = 'translateY(0)';
    } // end doRender
  }

  function showDetail(topic) {
    const panel = document.getElementById('detail-panel');
    document.getElementById('detail-date').textContent = formatDate(topic.date);
    document.getElementById('detail-topic').textContent = topic.topic;
    document.getElementById('detail-context').textContent = topic.relatedNews;

    const resources = filterResources(topic.resources, currentFilter);
    const resourcesContainer = document.getElementById('detail-resources');

    resourcesContainer.innerHTML = resources.map(r => {
      const isValidUrl = r.url && (r.url.startsWith('http://') || r.url.startsWith('https://'));
      const href = isValidUrl ? r.url : '#';
      const linkLabel = r.type === 'youtube' ? 'WATCH' : r.type === 'github' ? 'VIEW REPO' : r.type === 'podcast' ? 'LISTEN' : 'READ MORE';
      const unavailableBadge = isValidUrl ? '' : '<span class="link-unavailable">link unavailable</span>';

      return (
        `<a href="${href}" target="_blank" rel="noopener" class="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:border-primary hover:bg-blue-50/30 transition-all duration-200 block">` +
          `<span class="material-symbols-outlined text-primary mt-0.5">${getTypeIcon(r.type)}</span>` +
          `<div class="flex-1 min-w-0">` +
            `<div class="flex items-center gap-2 mb-1">` +
              `<span class="text-[9px] font-bold uppercase tracking-widest text-muted">${escapeHtml(r.type)}</span>` +
              `${r.author ? `<span class="text-xs text-muted">${escapeHtml(r.author)}</span>` : ''}` +
            `</div>` +
            `<p class="text-sm font-semibold text-ink mb-0.5">${escapeHtml(r.title)}${unavailableBadge}</p>` +
            `<p class="text-xs text-muted leading-relaxed">${escapeHtml(r.description)}</p>` +
          `</div>` +
          `${isValidUrl ? `<span class="text-[10px] font-bold uppercase tracking-widest text-primary shrink-0 whitespace-nowrap">${linkLabel}</span>` : ''}` +
        `</a>`
      );
    }).join('');

    panel.classList.remove('hidden');
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Close detail panel
  document.getElementById('detail-close').addEventListener('click', () => {
    document.getElementById('detail-panel').classList.add('hidden');
    document.querySelectorAll('.topic-card').forEach(c => c.classList.remove('ring-2', 'ring-primary'));
  });
});
