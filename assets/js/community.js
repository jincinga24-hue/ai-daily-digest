(function () {
  'use strict';

  const VERDICT_CONFIG = {
    useful: {
      label: 'Useful',
      badgeClass: 'bg-green-100 text-green-700',
      borderClass: 'border-l-green-500'
    },
    mixed: {
      label: 'Mixed',
      badgeClass: 'bg-amber-100 text-amber-700',
      borderClass: 'border-l-amber-400'
    },
    'not-useful': {
      label: 'Not Useful',
      badgeClass: 'bg-red-100 text-red-600',
      borderClass: 'border-l-red-500'
    }
  };

  function getVerdictConfig(verdict) {
    return VERDICT_CONFIG[verdict] || {
      label: verdict,
      badgeClass: 'bg-gray-100 text-gray-600',
      borderClass: 'border-l-gray-400'
    };
  }

  function buildSectorOptions(reports) {
    const sectors = [...new Set(reports.map(r => r.sector))].sort();
    return sectors;
  }

  function renderCard(report) {
    const cfg = getVerdictConfig(report.verdict);
    const tagsHtml = report.tags
      .map(t => `<span class="text-[10px] font-medium bg-primary/10 text-primary rounded-full px-2 py-0.5">${escapeHtml(t)}</span>`)
      .join('');

    return (
      `<article class="bg-card border border-gray-200 border-l-4 ${cfg.borderClass} rounded-xl p-5 flex flex-col gap-3 community-card"` +
      ` data-verdict="${escapeHtml(report.verdict)}" data-sector="${escapeHtml(report.sector)}">` +

      `<div class="flex items-start justify-between gap-3">` +
        `<div class="min-w-0">` +
          `<p class="text-xs font-semibold text-ink truncate">${escapeHtml(report.author)}</p>` +
          `<p class="text-[11px] text-muted">${escapeHtml(report.role)}</p>` +
        `</div>` +
        `<span class="shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full ${cfg.badgeClass}">${escapeHtml(cfg.label)}</span>` +
      `</div>` +

      `<div class="flex flex-wrap gap-2 text-[11px] text-muted">` +
        `<span class="flex items-center gap-1">` +
          `<span class="material-symbols-outlined" style="font-size:13px">build</span>` +
          `${escapeHtml(report.tool)}` +
        `</span>` +
        `<span class="text-gray-300">·</span>` +
        `<span class="flex items-center gap-1">` +
          `<span class="material-symbols-outlined" style="font-size:13px">factory</span>` +
          `${escapeHtml(report.sector)}` +
        `</span>` +
      `</div>` +

      `<p class="text-sm text-ink leading-relaxed">${escapeHtml(report.report)}</p>` +

      `<div class="flex items-center justify-between pt-1">` +
        `<div class="flex flex-wrap gap-1">${tagsHtml}</div>` +
        `<p class="text-[11px] text-muted shrink-0 ml-2">${formatDate(report.date)}</p>` +
      `</div>` +

      `</article>`
    );
  }

  function applyFilters(reports, verdictFilter, sectorFilter) {
    return reports.filter(r => {
      const verdictMatch = verdictFilter === 'all' || r.verdict === verdictFilter;
      const sectorMatch = sectorFilter === 'all' || r.sector === sectorFilter;
      return verdictMatch && sectorMatch;
    });
  }

  function renderFeed(reports) {
    const feed = document.getElementById('community-feed');
    const empty = document.getElementById('community-empty');
    if (!feed) return;

    if (reports.length === 0) {
      feed.innerHTML = '';
      if (empty) empty.classList.remove('hidden');
      return;
    }

    if (empty) empty.classList.add('hidden');
    feed.innerHTML = reports.map(renderCard).join('');
  }

  function updateCount(count) {
    const el = document.getElementById('report-count');
    if (el) el.textContent = count === 1 ? '1 report' : `${count} reports`;
  }

  function init() {
    let allReports = [];
    let activeVerdict = 'all';
    let activeSector = 'all';

    fetch('assets/data/community.json')
      .then(r => {
        if (!r.ok) throw new Error('Failed to load community data');
        return r.json();
      })
      .then(data => {
        if (!Array.isArray(data)) throw new Error('Invalid community data format');
        allReports = data;

        // Populate sector filter
        const sectorSelect = document.getElementById('sector-filter');
        if (sectorSelect) {
          const sectors = buildSectorOptions(allReports);
          sectors.forEach(sector => {
            const opt = document.createElement('option');
            opt.value = sector;
            opt.textContent = sector;
            sectorSelect.appendChild(opt);
          });

          sectorSelect.addEventListener('change', () => {
            activeSector = sectorSelect.value;
            const filtered = applyFilters(allReports, activeVerdict, activeSector);
            renderFeed(filtered);
            updateCount(filtered.length);
          });
        }

        // Verdict filter buttons
        document.querySelectorAll('.verdict-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            document.querySelectorAll('.verdict-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeVerdict = btn.dataset.verdict;
            const filtered = applyFilters(allReports, activeVerdict, activeSector);
            renderFeed(filtered);
            updateCount(filtered.length);
          });
        });

        renderFeed(allReports);
        updateCount(allReports.length);
      })
      .catch(err => {
        console.error('Community load error:', err);
        const feed = document.getElementById('community-feed');
        if (feed) {
          feed.innerHTML = '<p class="text-sm text-red-600 col-span-full">Failed to load community reports. Please try again later.</p>';
        }
      });

    renderNav('community');
  }

  document.addEventListener('DOMContentLoaded', init);
}());
