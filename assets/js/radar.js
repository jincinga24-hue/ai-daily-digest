document.addEventListener('DOMContentLoaded', () => {
  renderNav('radar', '');

  const radarPromise = fetch('assets/data/radar-data.json')
    .then(r => r.json())
    .then(data => {
      const chart = renderRadarChart(data);
      renderChanges(data.changes || []);
      renderInsights(data.insights || []);
      const dateEl = document.getElementById('radar-date');
      if (dateEl && data.lastUpdated) dateEl.textContent = formatDate(data.lastUpdated);
      if (chart) setupLegendInteraction(chart);
      return data;
    })
    .catch(err => {
      const container = document.getElementById('radar-changes');
      if (container) container.innerHTML = '<p class="error-state">Failed to load radar data. Please try again later.</p>';
      console.error('Error loading radar data:', err);
      return null;
    });

  const evidencePromise = fetch('assets/data/radar-evidence.json')
    .then(r => r.json())
    .catch(err => {
      console.error('Error loading radar evidence:', err);
      return null;
    });

  Promise.all([radarPromise, evidencePromise]).then(([data, evidence]) => {
    if (data && evidence) {
      fetch('assets/data/radar-history.json')
        .then(r => r.json())
        .then(history => {
          if (history) renderTrends(history, data.industries, evidence);
        })
        .catch(err => console.error('Error loading radar history:', err));
    } else if (data) {
      fetch('assets/data/radar-history.json')
        .then(r => r.json())
        .then(history => {
          if (history) renderTrends(history, data.industries, null);
        })
        .catch(err => console.error('Error loading radar history:', err));
    }
  });

  setupEvidenceClose();
});

function renderRadarChart(data) {
  const canvas = document.getElementById('radarChart');
  if (!canvas) return null;
  const ctx = canvas.getContext('2d');

  return new Chart(ctx, {
    type: 'radar',
    data: {
      labels: data.industries,
      datasets: [
        {
          label: 'Theoretical AI Coverage',
          data: data.theoretical,
          borderColor: '#005cba',
          backgroundColor: '#005cba18',
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: '#005cba'
        },
        {
          label: 'Observed AI Coverage',
          data: data.observed,
          borderColor: '#ef4444',
          backgroundColor: '#ef444415',
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: '#ef4444'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          callbacks: {
            title: tooltipItems => tooltipItems[0].chart.data.labels[tooltipItems[0].dataIndex],
            label: tooltipItem => `${tooltipItem.dataset.label}: ${tooltipItem.formattedValue}`
          }
        }
      },
      scales: {
        r: {
          min: 0,
          max: 1,
          ticks: {
            stepSize: 0.2,
            color: '#9ca3af',
            backdropColor: 'transparent',
            font: { size: 10 }
          },
          pointLabels: {
            color: '#2d3338',
            font: { size: 11, weight: '500' }
          },
          grid: { color: '#e5e7eb' },
          angleLines: { color: '#e5e7eb' }
        }
      }
    }
  });
}

function setupLegendInteraction(chart) {
  const legendItems = document.querySelectorAll('.legend-item');
  legendItems.forEach((item, index) => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      const meta = chart.getDatasetMeta(index);
      meta.hidden = !meta.hidden;
      item.style.opacity = meta.hidden ? '0.4' : '1';
      chart.update();
    });
  });
}

function renderChanges(changes) {
  const container = document.getElementById('radar-changes');
  if (!container) return;

  const directionConfig = {
    up:     { colour: 'text-emerald-600', bg: 'bg-emerald-50', symbol: '\u2191' },
    down:   { colour: 'text-red-500',     bg: 'bg-red-50',     symbol: '\u2193' },
    stable: { colour: 'text-amber-500',   bg: 'bg-amber-50',   symbol: '\u2194' }
  };

  container.innerHTML = changes.map(c => {
    const cfg = directionConfig[c.direction] || directionConfig.stable;
    return (
      `<div class="bg-card border border-gray-200 rounded-xl px-5 py-4 mb-3 flex items-center gap-4">` +
        `<span class="shrink-0 w-8 h-8 rounded-full ${cfg.bg} ${cfg.colour} flex items-center justify-center font-bold text-base">${cfg.symbol}</span>` +
        `<div class="flex-1 min-w-0">` +
          `<p class="font-semibold text-sm text-ink">${escapeHtml(c.industry)}</p>` +
          `<p class="text-xs text-muted mt-0.5">${escapeHtml(c.reason)}</p>` +
        `</div>` +
        `<span class="text-xs text-muted shrink-0">${formatDate(c.date)}</span>` +
      `</div>`
    );
  }).join('');
}

function renderInsights(insights) {
  const container = document.getElementById('insight-cards');
  if (!container) return;

  container.innerHTML = insights.map(ins =>
    `<div class="bg-card border border-gray-200 rounded-xl p-5 hover:border-primary transition-colors">` +
      `<p class="text-xs font-semibold uppercase tracking-widest text-primary mb-2">${escapeHtml(ins.title)}</p>` +
      `<p class="text-sm text-muted leading-relaxed">${escapeHtml(ins.body)}</p>` +
    `</div>`
  ).join('');
}

function setupEvidenceClose() {
  const closeBtn = document.getElementById('evidence-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      const panel = document.getElementById('evidence-panel');
      const placeholder = document.getElementById('evidence-placeholder');
      if (panel) panel.classList.add('hidden');
      if (placeholder) placeholder.classList.remove('hidden');
      document.querySelectorAll('#trend-cards .trend-card-active').forEach(el => {
        el.classList.remove('trend-card-active', 'border-primary');
      });
    });
  }
}

function renderEvidencePanel(sectorName, sectorData) {
  const panel = document.getElementById('evidence-panel');
  const placeholder = document.getElementById('evidence-placeholder');
  const titleEl = document.getElementById('evidence-sector-title');
  const entriesEl = document.getElementById('evidence-entries');
  if (!panel || !entriesEl || !titleEl) return;

  titleEl.textContent = sectorName;

  const typeLabels = {
    product_launch: 'Product Launch',
    company_deployment: 'Company Deployment',
    hiring: 'Hiring Signal',
    research: 'Research',
    news: 'News',
    community_report: 'Community Report',
    industry_report: 'Industry Report',
    model_release: 'Model Release'
  };

  const entries = sectorData.evidence || [];
  entriesEl.innerHTML = entries.map(e => {
    const typeLabel = typeLabels[e.type] || e.type;
    const verifiedBadge = e.verified
      ? `<span class="inline-block text-[10px] font-semibold uppercase tracking-widest bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">Verified</span>`
      : `<span class="inline-block text-[10px] font-semibold uppercase tracking-widest bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">Unverified</span>`;
    const impactColour = e.impact === 'baseline' ? 'text-muted' : e.impact.startsWith('+') ? 'text-emerald-600' : 'text-red-500';
    const sourceLink = e.sourceUrl
      ? `<a href="${escapeHtml(e.sourceUrl)}" target="_blank" rel="noopener noreferrer" class="font-semibold text-primary hover:underline">${escapeHtml(e.source)}</a>`
      : `<span class="font-semibold text-ink">${escapeHtml(e.source)}</span>`;

    return (
      `<div class="border-b border-gray-100 pb-4 last:border-0 last:pb-0">` +
        `<div class="flex flex-wrap items-center gap-2 mb-1.5">` +
          `<span class="text-[10px] font-semibold uppercase tracking-widest bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">${escapeHtml(typeLabel)}</span>` +
          verifiedBadge +
          `<span class="text-xs text-muted">${escapeHtml(e.date)}</span>` +
          `<span class="text-xs ${impactColour} font-semibold ml-auto">${escapeHtml(e.impact)}</span>` +
        `</div>` +
        `<p class="text-sm text-ink leading-snug mb-1">${escapeHtml(e.claim)}</p>` +
        `<p class="text-xs text-muted">Source: ${sourceLink}</p>` +
      `</div>`
    );
  }).join('');

  panel.classList.remove('hidden');
  if (placeholder) placeholder.classList.add('hidden');
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function renderTrends(history, industries, evidence) {
  const main = document.querySelector('main');
  if (!main || !history.length || !industries) return;

  // Build per-industry time series (oldest → newest)
  const sorted = [...history].sort((a, b) => a.date.localeCompare(b.date));
  const latest = sorted[sorted.length - 1];
  const prev   = sorted.length >= 2 ? sorted[sorted.length - 2] : null;

  const SPARKLINE_W = 80;
  const SPARKLINE_H = 28;
  const SPARKLINE_PAD = 2;

  function buildSparkline(values) {
    if (!values || values.length < 2) return '';
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 0.01;
    const step = (SPARKLINE_W - SPARKLINE_PAD * 2) / (values.length - 1);
    const points = values.map((v, i) => {
      const x = SPARKLINE_PAD + i * step;
      const y = SPARKLINE_H - SPARKLINE_PAD - ((v - min) / range) * (SPARKLINE_H - SPARKLINE_PAD * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
    const lastX = SPARKLINE_PAD + (values.length - 1) * step;
    const lastY = SPARKLINE_H - SPARKLINE_PAD - ((values[values.length - 1] - min) / range) * (SPARKLINE_H - SPARKLINE_PAD * 2);
    return (
      `<svg width="${SPARKLINE_W}" height="${SPARKLINE_H}" viewBox="0 0 ${SPARKLINE_W} ${SPARKLINE_H}" class="shrink-0">` +
        `<polyline points="${points}" fill="none" stroke="#005cba" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>` +
        `<circle cx="${lastX.toFixed(1)}" cy="${lastY.toFixed(1)}" r="2.5" fill="#005cba"/>` +
      `</svg>`
    );
  }

  const cardsHtml = industries.map((name, i) => {
    const seriesValues = sorted.map(snap => snap.observed[i]);
    const currentScore = latest.observed[i];
    const prevScore    = prev ? prev.observed[i] : currentScore;
    const delta = currentScore - prevScore;
    const direction = delta > 0.005 ? 'up' : delta < -0.005 ? 'down' : 'stable';
    const dirCfg = {
      up:     { colour: 'text-emerald-600', symbol: '↑' },
      down:   { colour: 'text-red-500',     symbol: '↓' },
      stable: { colour: 'text-amber-500',   symbol: '→' }
    }[direction];
    const sparkline = buildSparkline(seriesValues);

    const sectorData = evidence && evidence.sectors ? evidence.sectors[name] : null;
    const sourceCount = sectorData && sectorData.evidence ? sectorData.evidence.length : 0;
    const sourceBadge = sourceCount > 0
      ? `<span class="text-[10px] font-semibold text-muted">${sourceCount} source${sourceCount !== 1 ? 's' : ''}</span>`
      : '';
    const clickable = sectorData ? 'cursor-pointer hover:border-primary transition-colors' : '';

    return (
      `<div class="bg-card border border-gray-200 rounded-xl p-4 flex items-center gap-4 ${clickable}" data-sector="${escapeHtml(name)}">` +
        `<div class="flex-1 min-w-0">` +
          `<p class="text-xs font-semibold text-ink truncate">${escapeHtml(name)}</p>` +
          `<div class="flex items-center gap-1.5 mt-1">` +
            `<span class="text-sm font-bold text-ink">${(currentScore * 100).toFixed(0)}%</span>` +
            `<span class="text-sm font-bold ${dirCfg.colour}">${dirCfg.symbol}</span>` +
            sourceBadge +
          `</div>` +
        `</div>` +
        sparkline +
      `</div>`
    );
  }).join('');

  const section = document.createElement('section');
  section.innerHTML =
    `<div class="flex items-center gap-4 mb-6">` +
      `<p class="text-xs font-semibold uppercase tracking-widest text-muted">Trends</p>` +
      `<div class="h-px flex-1 bg-gray-200"></div>` +
    `</div>` +
    `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" id="trend-cards">${cardsHtml}</div>`;

  main.appendChild(section);

  if (evidence && evidence.sectors) {
    const trendCards = document.querySelectorAll('#trend-cards [data-sector]');
    trendCards.forEach(card => {
      const sectorName = card.getAttribute('data-sector');
      const sectorData = evidence.sectors[sectorName];
      if (!sectorData) return;
      card.addEventListener('click', () => {
        trendCards.forEach(c => c.classList.remove('trend-card-active', 'border-primary'));
        card.classList.add('trend-card-active', 'border-primary');
        renderEvidencePanel(sectorName, sectorData);
      });
    });
  }
}
