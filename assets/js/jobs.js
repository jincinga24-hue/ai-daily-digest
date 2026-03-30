(function () {
  'use strict';

  const AI_RELEVANCE_ORDER = { high: 0, medium: 1, low: 2 };

  function sortJobs(jobs) {
    return [...jobs].sort((a, b) => {
      const dateDiff = new Date(b.posted) - new Date(a.posted);
      if (dateDiff !== 0) return dateDiff;
      return (AI_RELEVANCE_ORDER[a.aiRelevance] ?? 3) - (AI_RELEVANCE_ORDER[b.aiRelevance] ?? 3);
    });
  }

  function getFilterValues() {
    return {
      level: document.getElementById('level-filter').value,
      type: document.getElementById('type-filter').value,
      aiRelevance: document.getElementById('ai-filter').value,
      sector: document.getElementById('sector-filter').value
    };
  }

  function applyFilters(jobs, filters) {
    return jobs.filter(job => {
      if (filters.level !== 'all' && job.level !== filters.level) return false;
      if (filters.type !== 'all' && job.type !== filters.type) return false;
      if (filters.aiRelevance !== 'all' && job.aiRelevance !== filters.aiRelevance) return false;
      if (filters.sector !== 'all' && job.sector !== filters.sector) return false;
      return true;
    });
  }

  function typeBadge(type) {
    const CONFIG = {
      internship: { label: 'Internship', classes: 'bg-blue-100 text-blue-700' },
      graduate:   { label: 'Graduate',   classes: 'bg-green-100 text-green-700' },
      research:   { label: 'Research',   classes: 'bg-purple-100 text-purple-700' }
    };
    const cfg = CONFIG[type] || { label: type, classes: 'bg-gray-100 text-gray-600' };
    return `<span class="inline-block text-[10px] font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${cfg.classes}">${cfg.label}</span>`;
  }

  function aiDot(relevance) {
    const CONFIG = {
      high:   { color: 'bg-emerald-500', label: 'High AI relevance' },
      medium: { color: 'bg-amber-400',   label: 'Medium AI relevance' },
      low:    { color: 'bg-gray-300',    label: 'Low AI relevance' }
    };
    const cfg = CONFIG[relevance] || CONFIG.low;
    return `<span class="flex items-center gap-1.5 text-[10px] font-medium text-muted uppercase tracking-wider">
      <span class="inline-block w-2 h-2 rounded-full ${cfg.color}" title="${cfg.label}"></span>
      ${relevance} AI
    </span>`;
  }

  function borderColor(relevance) {
    if (relevance === 'high')   return 'border-l-emerald-500';
    if (relevance === 'medium') return 'border-l-amber-400';
    return 'border-l-gray-300';
  }

  function renderCard(job) {
    const border = borderColor(job.aiRelevance);
    return `
      <article class="bg-card border border-gray-200 border-l-4 ${border} rounded-xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
        <div class="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <p class="text-xs font-semibold text-primary uppercase tracking-widest mb-0.5">${escapeHtml(job.company)}</p>
            <p class="text-[11px] text-muted">${escapeHtml(job.location)}</p>
          </div>
          <div class="flex flex-col items-end gap-1.5">
            ${typeBadge(job.type)}
            ${aiDot(job.aiRelevance)}
          </div>
        </div>

        <h2 class="text-base font-bold text-ink leading-snug">${escapeHtml(job.title)}</h2>

        <p class="text-xs text-muted leading-relaxed">${escapeHtml(job.aiContext)}</p>

        <div class="flex items-center justify-between mt-auto pt-2 border-t border-gray-100 flex-wrap gap-2">
          <div class="text-[11px] text-muted">
            <span class="font-semibold uppercase tracking-wide">Deadline:</span>
            ${escapeHtml(job.deadline)}
          </div>
          <a
            href="${escapeHtml(job.url)}"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-white bg-primary hover:bg-primary-dark transition-colors px-4 py-1.5 rounded-full"
          >APPLY <span class="material-symbols-outlined" style="font-size:13px">open_in_new</span></a>
        </div>
      </article>
    `;
  }

  function populateSectorDropdown(jobs) {
    const sectors = [...new Set(jobs.map(j => j.sector))].sort();
    const select = document.getElementById('sector-filter');
    const fragment = document.createDocumentFragment();
    sectors.forEach(sector => {
      const opt = document.createElement('option');
      opt.value = sector;
      opt.textContent = sector;
      fragment.appendChild(opt);
    });
    select.appendChild(fragment);
  }

  function renderJobs(jobs, animate) {
    const feed = document.getElementById('jobs-feed');
    const empty = document.getElementById('jobs-empty');
    const count = document.getElementById('jobs-count');

    function doRender() {
      if (!jobs.length) {
        feed.innerHTML = '';
        empty.classList.remove('hidden');
        count.textContent = '';
      } else {
        empty.classList.add('hidden');
        count.textContent = `${jobs.length} opportunit${jobs.length === 1 ? 'y' : 'ies'}`;
        feed.innerHTML = jobs.map(renderCard).join('');
      }
      feed.style.opacity = '1';
      feed.style.transform = 'translateY(0)';
    }

    if (animate) {
      feed.style.opacity = '0';
      feed.style.transform = 'translateY(8px)';
      setTimeout(doRender, 150);
    } else {
      doRender();
    }
  }

  function init(allJobs) {
    const sorted = sortJobs(allJobs);
    populateSectorDropdown(sorted);
    renderJobs(sorted, false);

    const filterIds = ['level-filter', 'type-filter', 'ai-filter', 'sector-filter'];
    filterIds.forEach(id => {
      document.getElementById(id).addEventListener('change', () => {
        const filters = getFilterValues();
        const filtered = applyFilters(sorted, filters);
        renderJobs(filtered, true);
      });
    });
  }

  fetch('assets/data/jobs.json')
    .then(res => {
      if (!res.ok) throw new Error(`Failed to load jobs.json: ${res.status}`);
      return res.json();
    })
    .then(data => {
      if (!Array.isArray(data)) throw new Error('jobs.json must be an array');
      init(data);
    })
    .catch(err => {
      console.error('Jobs page error:', err);
      const feed = document.getElementById('jobs-feed');
      if (feed) {
        feed.innerHTML = `<p class="text-sm text-red-500 col-span-2">Could not load job listings. Please try refreshing the page.</p>`;
      }
    });
}());
