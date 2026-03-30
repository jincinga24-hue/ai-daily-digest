# PRD: The Daily AI Shift

## One-Liner
A daily AI news blog for Australian chemical engineers and ChemE students — tracking how AI reshapes process engineering, mining, oil and gas, pharma, water treatment, and related careers.

## Problem
AI is transforming chemical engineering practice, but existing AI news sites don't connect developments to ChemE careers. Process engineers don't know how tools like Aspen Plus with AI assist will change their work. ChemE students don't know which skills to prioritise. Professionals at BHP, Woodside, and CSL aren't sure which AI developments matter for their industry.

## Target User
- ChemE undergrad and postgrad students (Melbourne, UNSW, Monash, UQ, Adelaide, Curtin, RMIT)
- Early-career chemical engineers (0–5 years) in process design, mining, oil and gas, or pharma
- Mid-career professionals in Australian resources, water, and pharmaceutical sectors wanting to understand AI's impact on their role

## MVP Features

### Feature 1: Daily ChemE AI Digest
- **Status:** PARTIAL
- Blog page listing daily AI digest posts focused on chemical engineering
- Each post covers: what happened in AI, ChemE-specific impact (process engineers, safety engineers, lab analysts, plant operators, R&D chemists, environmental engineers), bigger picture, ChemE action items
- Posts stored as HTML in `/posts/` directory
- Post index driven by `posts.json`
- Navigation between posts
- Daily generation via `ai-blog` shell command using Claude Code with ChemE-focused prompt

### Feature 2: AI Impact Radar — ChemE Sub-Sectors
- **Status:** PARTIAL
- Interactive radar/spider chart showing theoretical vs observed AI coverage across 12 Australian ChemE sub-sectors
- Sub-sectors: Process Design & Simulation, Mining & Minerals Processing, Oil & Gas Refining, Water & Wastewater Treatment, Pharmaceutical Manufacturing, Food & Beverage Processing, Environmental & Sustainability, Safety & Risk Engineering, Quality Control & Analytics, Materials Science, Energy & Renewables, Supply Chain & Logistics
- Data driven by `radar-data.json`
- Recent changes log showing what shifted and why, with Australian employer context
- Key takeaway insight cards referencing BHP, Rio Tinto, Woodside, CSL, etc.
- Chart updates when new AI developments change sub-sector scores

### Feature 3: Learn & Adapt — ChemE Resource Feed
- **Status:** PARTIAL
- Curated external resource feed for ChemE professionals and students
- Sources include: IChemE, Engineers Australia, RACI, AspenTech, AVEVA, Australian university ChemE departments, industry reports
- Resources grouped by date and tied to that day's ChemE AI news
- Filter by resource type (YouTube, GitHub, articles, podcasts)
- Each resource shows: title, description, author, type, link
- Data driven by `resources.json`

## Tech Stack
- **Frontend:** Vanilla HTML/CSS/JS (static site)
- **Charts:** Chart.js (CDN)
- **Hosting:** GitHub Pages
- **Content Generation:** Claude Code CLI (`ai-blog` command)
- **Data:** JSON files (`posts.json`, `radar-data.json`, `resources.json`)

## Success Metric
All 3 pages fully functional, mobile responsive, dark theme, data-driven from JSON files. A user can browse posts, explore the radar chart, and click through curated resources.

## Kill Metric
If after 10 cycles the blog page can't render posts from JSON and the radar chart doesn't display, pivot approach.

## Design Direction
- Dark theme (deep navy/black background)
- Clean, modern, minimal
- Accent colors: indigo + cyan
- Card-based layout
- Mobile-first responsive
- UI redesign will come later from user — focus on functionality now
