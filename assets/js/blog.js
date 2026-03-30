// Pure helpers (testable outside DOMContentLoaded)
function renderBlogCard(post) {
  const tagsHtml = (post.tags || []).map(t =>
    `<span class="inline-block text-[10px] font-semibold uppercase tracking-widest bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">${escapeHtml(t)}</span>`
  ).join('');

  return (
    `<article class="border-b border-gray-200 py-8 flex gap-6 group">` +
      `<div class="w-24 shrink-0 text-xs text-muted pt-1">${formatDate(post.date)}</div>` +
      `<div class="flex-1 min-w-0">` +
        `<a href="posts/${post.slug}.html" class="block">` +
          `<h2 class="text-xl font-semibold text-ink group-hover:text-primary transition-colors mb-2 leading-snug">${escapeHtml(post.title)}</h2>` +
          `<p class="text-sm text-muted leading-relaxed mb-4">${escapeHtml(post.excerpt)}</p>` +
        `</a>` +
        `<div class="flex flex-wrap gap-2">${tagsHtml}</div>` +
      `</div>` +
    `</article>`
  );
}

document.addEventListener('DOMContentLoaded', () => {
  renderNav('blog', '');

  let allPosts = [];
  let currentYear = 2026;
  let currentMonth = 2; // 0-indexed: 2 = March

  const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  fetch('assets/data/posts.json')
    .then(r => r.json())
    .then(posts => {
      allPosts = posts;
      // Start on the month of the most recent post
      if (posts.length > 0) {
        posts.sort((a, b) => b.date.localeCompare(a.date));
        const latest = posts[0].date.split('-');
        currentYear = parseInt(latest[0], 10);
        currentMonth = parseInt(latest[1], 10) - 1;
      }
      renderCalendar();
    })
    .catch(err => {
      const grid = document.getElementById('calendar-grid');
      if (grid) grid.innerHTML = '<p class="error-state col-span-7">Failed to load posts.</p>';
      console.error('Error loading posts:', err);
    });

  // Month navigation
  document.getElementById('prev-month').addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    renderCalendar();
  });

  document.getElementById('next-month').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendar();
  });

  function renderCalendar() {
    const grid = document.getElementById('calendar-grid');
    const label = document.getElementById('month-label');
    if (!grid || !label) return;

    // Build post lookup for this month
    const postsByDay = {};
    allPosts.forEach(p => {
      const parts = p.date.split('-');
      const pYear = parseInt(parts[0], 10);
      const pMonth = parseInt(parts[1], 10) - 1;
      const pDay = parseInt(parts[2], 10);
      if (pYear === currentYear && pMonth === currentMonth) {
        postsByDay[pDay] = p;
      }
    });

    const postCount = Object.keys(postsByDay).length;
    label.textContent = `${MONTH_NAMES[currentMonth]} ${currentYear}`;

    // Update post count badge next to month label
    let countBadge = document.getElementById('month-post-count');
    if (!countBadge) {
      countBadge = document.createElement('span');
      countBadge.id = 'month-post-count';
      countBadge.className = 'text-xs text-muted font-normal ml-2';
      label.parentNode.insertBefore(countBadge, label.nextSibling);
    }
    countBadge.textContent = postCount === 1 ? '1 post' : `${postCount} posts`;

    // First day of month (0=Sun, convert to Mon-start: Mon=0)
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Today
    const now = new Date();
    const isCurrentMonth = now.getFullYear() === currentYear && now.getMonth() === currentMonth;
    const today = now.getDate();

    let html = '';

    // Empty cells before first day
    for (let i = 0; i < startOffset; i++) {
      html += `<div class="aspect-square"></div>`;
    }

    // Day cells
    for (let day = 1; day <= daysInMonth; day++) {
      const post = postsByDay[day];
      const isToday = isCurrentMonth && day === today;

      if (post) {
        html += `<div class="aspect-square border rounded-lg cursor-pointer transition-all duration-200 hover:border-primary hover:shadow-sm flex flex-col items-center justify-center gap-1 ${isToday ? 'border-primary bg-blue-50' : 'border-gray-200 bg-card'}" data-slug="${escapeHtml(post.slug)}" data-title="${escapeHtml(post.title)}" data-date="${post.date}" data-excerpt="${escapeHtml(post.excerpt)}" data-tags="${(post.tags || []).join(',')}">` +
          `<span class="text-sm font-bold ${isToday ? 'text-primary' : 'text-ink'}">${day}</span>` +
          `<span class="w-1.5 h-1.5 rounded-full bg-primary"></span>` +
        `</div>`;
      } else {
        html += `<div class="aspect-square border border-gray-100 rounded-lg flex items-center justify-center select-none ${isToday ? 'border-primary/30 bg-blue-50/20' : 'opacity-40'}" data-empty-day="${day}">` +
          `<span class="text-sm ${isToday ? 'font-bold text-primary/50' : 'text-gray-300'}">${day}</span>` +
        `</div>`;
      }
    }

    grid.innerHTML = html;

    // Click handlers for days with posts
    grid.querySelectorAll('[data-slug]').forEach(cell => {
      cell.addEventListener('click', () => {
        showPreview(cell.dataset);
      });
    });

    // Click handlers for empty days — show inline message
    grid.querySelectorAll('[data-empty-day]').forEach(cell => {
      cell.addEventListener('click', () => {
        showEmptyDayMessage(cell.dataset.emptyDay);
      });
    });

    // Auto-show the latest post in this month, or empty-month message
    const latestDay = Object.keys(postsByDay).sort((a, b) => b - a)[0];
    if (latestDay) {
      const cell = grid.querySelector(`[data-slug="${postsByDay[latestDay].slug}"]`);
      if (cell) showPreview(cell.dataset);
    } else {
      showEmptyMonthMessage();
    }
  }

  function showEmptyDayMessage(day) {
    const preview = document.getElementById('post-preview');
    const emptyMsg = document.getElementById('empty-day-message');

    preview.classList.add('hidden');

    if (!emptyMsg) {
      const msg = document.createElement('div');
      msg.id = 'empty-day-message';
      msg.className = 'mt-8 py-4 px-6 rounded-lg border border-gray-200 bg-card text-sm text-muted text-center';
      msg.textContent = 'No digest for this day.';
      preview.parentNode.insertBefore(msg, preview.nextSibling);
    } else {
      emptyMsg.textContent = 'No digest for this day.';
      emptyMsg.classList.remove('hidden');
    }

    // Clear active ring on post cells
    document.querySelectorAll('#calendar-grid [data-slug]').forEach(c => {
      c.classList.remove('ring-2', 'ring-primary');
    });
  }

  function showEmptyMonthMessage() {
    const preview = document.getElementById('post-preview');
    preview.classList.add('hidden');

    let emptyMsg = document.getElementById('empty-day-message');
    if (!emptyMsg) {
      emptyMsg = document.createElement('div');
      emptyMsg.id = 'empty-day-message';
      emptyMsg.className = 'mt-8 py-4 px-6 rounded-lg border border-gray-200 bg-card text-sm text-muted text-center';
      preview.parentNode.insertBefore(emptyMsg, preview.nextSibling);
    }

    emptyMsg.textContent = `No posts in ${MONTH_NAMES[currentMonth]} ${currentYear} yet.`;
    emptyMsg.classList.remove('hidden');
  }

  function showPreview(data) {
    const emptyMsg = document.getElementById('empty-day-message');
    if (emptyMsg) emptyMsg.classList.add('hidden');

    const preview = document.getElementById('post-preview');
    document.getElementById('preview-date').textContent = formatDate(data.date);
    document.getElementById('preview-title').textContent = data.title;
    document.getElementById('preview-excerpt').textContent = data.excerpt;
    document.getElementById('preview-link').href = `posts/${data.slug}.html`;

    const tagsContainer = document.getElementById('preview-tags');
    const tags = data.tags ? data.tags.split(',').filter(Boolean) : [];
    tagsContainer.innerHTML = tags.map(t =>
      `<span class="inline-block text-[10px] font-semibold uppercase tracking-widest bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">${escapeHtml(t)}</span>`
    ).join('');

    preview.classList.remove('hidden');

    // Highlight selected cell
    document.querySelectorAll('#calendar-grid [data-slug]').forEach(c => {
      c.classList.remove('ring-2', 'ring-primary');
    });
    const activeCell = document.querySelector(`#calendar-grid [data-slug="${data.slug}"]`);
    if (activeCell) activeCell.classList.add('ring-2', 'ring-primary');
  }
});
