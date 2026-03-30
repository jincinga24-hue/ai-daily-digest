# The Daily AI Shift

Daily AI news blog focused on **Australian students and professionals** — tracking how artificial intelligence reshapes Australian industries and careers. Features an industry radar chart and resource feed. Built with vanilla JS, Chart.js, and static JSON data files — no build step required.

> **Australia-focused:** All content, career advice, and industry analysis is framed around the Australian context — including the local job market, Australian universities and TAFE pathways, and Australian industry sectors such as mining, agriculture, and financial services.

## Dev Server Setup

**Requirements:** Node.js (any recent version)

```bash
# 1. Clone or navigate to the project
cd ai-daily-digest

# 2. Install dependencies (only needed once)
npm install

# 3. Start the local dev server
npm start
```

Then open **http://localhost:3000** in your browser.

> The `start` script runs `npx serve .` on port 3000. All pages and assets are served as static files. Changes to HTML, CSS, or JS take effect immediately on page refresh — no rebuild needed.

**Why a server?** The site fetches JSON data files via `fetch()`. Browsers block these requests when opening HTML files directly from the filesystem (`file://`), so a local server is required.

## Pages

- `http://localhost:3000/` — Home / blog post listing
- `http://localhost:3000/radar.html` — AI industry radar chart
- `http://localhost:3000/learn.html` — Resource feed (articles, videos, tweets, GitHub repos)

## Project Structure

```
assets/
  css/
    main.css          — All styles
  js/
    utils.js          — Shared utilities (formatDate)
    nav.js            — Mobile nav toggle
    blog.js           — Blog listing page
    radar.js          — Radar chart and changes feed
    learn.js          — Resource feed with filters
  data/
    posts.json        — Blog post metadata (title, date, excerpt, tags, slug)
    radar-data.json   — Radar chart values, recent changes, key insights
    resources.json    — Learning resources grouped by topic and date
posts/
  *.html              — Individual blog post HTML files
```

## Adding Content

**New blog post:**
1. Create `posts/YYYY-MM-DD-slug.html` using an existing post as a template
2. Add an entry to `assets/data/posts.json` with matching `slug`, `title`, `date`, `excerpt`, and `tags`

**New resources:**
- Add entries to `assets/data/resources.json` — each entry groups resources by topic and date

**Radar data:**
- Edit `assets/data/radar-data.json` to update industry scores, recent changes, and key insights
