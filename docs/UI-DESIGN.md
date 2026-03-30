# UI Design: The Daily AI Shift

> Note: User will provide final design later. Current focus is functionality.

## Design System
- **Background:** #0a0a0f (deep dark)
- **Card background:** #12121a
- **Border:** #2a2a3a
- **Text:** #e8e8f0
- **Muted text:** #8888a0
- **Accent 1:** #6366f1 (indigo)
- **Accent 2:** #22d3ee (cyan)
- **Red:** #f87171
- **Green:** #4ade80
- **Orange:** #fb923c
- **Border radius:** 12px
- **Max width:** 900px

## Page 1: Blog (index.html)
- Hero with gradient title
- Card list of posts (date, title, excerpt, tags)
- Cards link to individual post pages

## Page 2: AI Impact Radar (radar.html)
- Centered radar/spider chart (Chart.js)
- Two datasets: theoretical (indigo) vs observed (red)
- 22 industry labels around the chart
- Legend explaining the two lines
- Recent Changes section with arrow indicators (up/down)
- Key Takeaways insight cards in grid

## Page 3: Learn & Adapt (learn.html)
- Filter bar (All, Tweets, YouTube, GitHub, Articles)
- Resources grouped by date
- Each topic group shows: topic title, news context, then resource links
- Resource links show: icon, title, description, author, type badge

## Navigation
- Sticky top nav with blur backdrop
- Logo left, links right
- Active page has underline indicator
- Mobile: hamburger toggle

## Responsive
- Mobile breakpoint: 640px
- Single column on mobile
- Hamburger nav on mobile
