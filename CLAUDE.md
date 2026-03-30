# The Daily AI Shift — Chemical Engineering x AI

## Overview
Daily AI news blog focused on chemical engineering in Australia. 3 pages: Blog, AI Impact Radar, Learn & Adapt.
Static site, no build tools, vanilla HTML/CSS/JS + Chart.js.

**Target audience:** ChemE students (undergrad/postgrad), early-career chemical engineers, and professionals in mining/resources, oil & gas, water treatment, pharma/biotech, and food processing.

## Topic Focus
All content must be framed through a **chemical engineering lens**:
- Process simulation (Aspen Plus, HYSYS, AVEVA, UniSim)
- Digital twins and plant automation (DCS, SCADA, predictive maintenance)
- Lab automation and analytical chemistry (NIR, LIMS, AI-assisted QC)
- Safety and risk engineering (HAZOP, LOPA, SIL)
- Australian ChemE industries: BHP, Rio Tinto, Fortescue, Woodside, CSL, Orica, Incitec Pivot, SA Water, Melbourne Water

## Tech Stack
- HTML/CSS/JS (no framework)
- Chart.js via CDN
- GitHub Pages hosting
- Data in JSON files under `assets/data/`

## File Structure
- `index.html` — Blog home page
- `radar.html` — AI Impact Radar (12 ChemE sub-sectors)
- `learn.html` — Curated ChemE resource feed
- `posts/` — Individual blog post HTML files
- `assets/data/` — JSON data files driving all content
- `scripts/` — Shell scripts for daily content generation

## Radar Sub-Sectors (radar-data.json)
The radar tracks these 12 Australian ChemE sub-sectors:
1. Process Design & Simulation
2. Mining & Minerals Processing
3. Oil & Gas Refining
4. Water & Wastewater Treatment
5. Pharmaceutical Manufacturing
6. Food & Beverage Processing
7. Environmental & Sustainability
8. Safety & Risk Engineering
9. Quality Control & Analytics
10. Materials Science
11. Energy & Renewables
12. Supply Chain & Logistics

## Conventions
- All data is JSON-driven (posts.json, radar-data.json, resources.json)
- No build step — edit files directly
- Mobile-first responsive design
- Keep JS simple — no modules, no bundler
- **Australian English spelling** — use organisation, colour, programme, analyse, labour, optimise, modelling, etc.
- **ChemE-focused content** — frame all analysis, career advice, and education references around chemical engineering and Australian context
- **Australian university references** — Melbourne, UNSW, Monash, UQ, Adelaide, Curtin, RMIT
- **Australian employer references** — BHP, Rio Tinto, Woodside, CSL, Orica, Incitec Pivot, SA Water, Melbourne Water

## Dev Server
```bash
python3 -m http.server 8090
```

## Important
- User will redesign UI later — focus on FUNCTIONALITY now
- The `ai-blog` / `ai-publish` / `ai-auto` shell commands must keep working
- Don't break the daily generation workflow when modifying the site
- Blog posts should use the ChemE-focused prompt in `scripts/blog-prompt.md`
