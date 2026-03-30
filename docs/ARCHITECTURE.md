# Architecture: The Daily AI Shift

## Overview
Static website with 3 pages, data-driven by JSON files, hosted on GitHub Pages.

## Folder Structure
```
ai-daily-digest/
├── index.html              # Blog page (home)
├── radar.html              # AI Impact Radar page
├── learn.html              # Learn & Adapt resource feed
├── assets/
│   ├── css/
│   │   └── main.css        # All styles
│   ├── js/
│   │   ├── nav.js          # Mobile nav toggle
│   │   ├── blog.js         # Blog list renderer
│   │   ├── radar.js        # Radar chart + changes + insights
│   │   └── learn.js        # Resource feed renderer + filters
│   └── data/
│       ├── posts.json      # Blog post index
│       ├── radar-data.json # Radar chart data + changes + insights
│       └── resources.json  # Curated external resources
├── posts/
│   └── YYYY-MM-DD-ai-daily-digest.html  # Individual post pages
├── _drafts/                # Draft posts (not published)
├── scripts/
│   ├── ai-blog.sh          # Draft generation command
│   ├── ai-publish.sh       # Publish approved draft
│   ├── ai-auto.sh          # Auto-publish mode
│   └── blog-prompt.md      # Master prompt for Claude Code
└── docs/
    ├── PRD.md
    └── ARCHITECTURE.md
```

## Data Flow
1. `ai-blog` command → Claude Code researches AI news → writes draft to `_drafts/`
2. User reviews draft → runs `ai-publish` → moves to `posts/`, updates `posts.json`, `radar-data.json`, `resources.json`
3. Git push → GitHub Pages deploys
4. Frontend loads JSON files → renders pages dynamically

## Libraries
- Chart.js 4.x (CDN) — radar chart

## Key Decisions
- Static site (no build tools, no framework) for simplicity and free GitHub Pages hosting
- JSON-driven data so Claude Code can update content without touching HTML
- All pages share same nav, CSS, and dark theme
- Mobile responsive with hamburger nav
```
