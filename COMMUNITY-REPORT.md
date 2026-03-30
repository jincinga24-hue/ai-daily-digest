# AI Beta Test — Feedback Report

**URL:** http://localhost:8090
**Date:** 2026-03-30 05:51 UTC
**Personas tested:** 10
**Verdict:** NO-GO

---

## PMF Signals

| Metric | Value |
|--------|-------|
| Would download | 0% |
| Would pay | 0% |
| Would return | 20% |
| Avg UX score | 4.5/10 |
| **Verdict** | **NO-GO** |

---

## UX Scores

| Dimension | Avg Score |
|-----------|-----------|
| Time To Value | ████░░░░░░ 4.1/10 |
| Navigation Clarity | █████░░░░░ 5.4/10 |
| Visual Design | █████░░░░░ 5.2/10 |
| Error Handling | ███░░░░░░░ 3.5/10 |
| Mobile Experience | ████░░░░░░ 4.3/10 |

---

## Top Friction Points

- **(1x)** Nav has IMPACT and BLOG as separate links but both route to index.html — that's confusing and feels broken
- **(1x)** The calendar UI ('Click a date to read that day's digest') promises a full archive but only one date (Mar 30) has content — every other day is presumably dead
- **(1x)** No explanation of what COMMUNITY, JOBS, or READINESS actually contain before I click them — I'm not going to click 4 unknowns with 32 seconds of patience
- **(1x)** 7 nav items for what appears to be a single blog post is severe over-engineering of the information architecture
- **(1x)** Zero personalization, filtering, or subscription mechanism visible above the fold — I can't signal 'I care about process simulation, not food processing'
- **(1x)** I came from an AnyProxy HN post — this is a chemical engineering blog, not a proxy tool. Complete mismatch. 0 relevance to why I clicked.
- **(1x)** The calendar widget shows 'Click a date to read that day's digest' but only one date (Mar 30) has any content — the rest are empty dead zones. I clicked Mar 28, nothing happened.
- **(1x)** Seven nav links (IMPACT, BLOG, RADAR, LEARN, COMMUNITY, JOBS, READINESS) but IMPACT and BLOG both go to index.html — that's confusing duplication
- **(1x)** 19 seconds of patience used up entirely on realising this has zero to do with what I searched for
- **(1x)** The calendar UI ('Click a date to read that day's digest') loaded with no filled dates visible — I see Mon/Tue/Wed/Thu/Fri/Sat/Sun headers but no indication of which dates actually have content beyond today. I'm not clicking through a blank calendar.

---

## Bugs Found

- **(1x)** IMPACT and BLOG in the nav both link to index.html — duplicate links with different labels is either a bug or a UX decision that needs explaining
- **(1x)** Hidden duplicate nav links exist (8 hidden interactive elements mirror the visible nav) — suggests a mobile menu that may be broken or redundant
- **(1x)** IMPACT and BLOG nav links both resolve to index.html — either IMPACT is redundant or it should go to a different page
- **(1x)** Calendar days other than Mar 30 appear clickable but produce no response — no loading state, no empty state message, nothing
- **(1x)** IMPACT nav link and BLOG nav link both point to index.html — duplicate nav entries with different labels going to the same page.
- **(1x)** Hidden duplicate nav links exist in DOM (BLOG, RADAR, LEARN, COMMUNITY, JOBS, READINESS all appear twice per the interactive elements list) — likely a mobile hamburger menu, but could cause screen reader confusion.
- **(1x)** IMPACT and BLOG nav links both resolve to index.html — either a duplicate nav item or a broken routing decision
- **(1x)** Calendar shows full month grid but only one date (Mar 30) appears to have a post — no visual differentiation between days with content vs. empty days, making the calendar widget misleading
- **(1x)** IMPACT and BLOG nav links both resolve to index.html — duplicate nav entries suggest either a routing bug or unfinished page separation.
- **(1x)** Interactive elements list shows 7 nav links duplicated as hidden — likely a mobile hamburger menu that mirrors desktop nav, but with 'menu' button also hidden, the mobile nav may be broken or untested.
- **(1x)** Calendar grid appears to render only headers (Mon Tue Wed Thu Fri Sat Sun) with no actual date cells visible in the scraped text — either the dates failed to render or JavaScript is required but the content scraper missed them
- **(1x)** Duplicate nav links: both 'IMPACT' and 'BLOG' resolve to index.html — one of these is either mislabeled or a dead link
- **(1x)** IMPACT nav link and BLOG nav link both resolve to index.html — either a mistake or the nav labels are misleading
- **(1x)** Calendar shows 'chevron_left / chevron_right' month navigation but there's no indication whether previous months have any content — navigating left likely shows an empty calendar with no feedback
- **(1x)** IMPACT and BLOG nav links both resolve to index.html — either IMPACT is not a real page or the nav labeling is wrong
- **(1x)** Duplicate nav links exist (both visible and hidden sets) suggesting a mobile menu that may not be properly toggled — 'menu' button is hidden but mobile nav items also hidden, unclear interaction state
- **(1x)** IMPACT and BLOG in the nav bar both point to index.html — these appear to be the same page, likely a nav link duplication bug
- **(1x)** Hidden nav links duplicate all visible nav links — suggests a mobile hamburger menu that mirrors desktop nav, but both sets are in the DOM simultaneously which could cause accessibility issues with duplicate link targets

---

## What Users Liked

- **(1x)** 615ms load on a static site is clean — this is what happens when you skip the framework tax, and I respect it
- **(1x)** The Mar 30 post headline is specific and dateable ('DeepSeek V3.2', 'Anthropic Sydney office') — actual named events, not vague AI trend slop
- **(1x)** 615ms load time is genuinely fast for a content site — no framework bloat is noticeable
- **(1x)** Zero JS errors is rare and appreciated
- **(1x)** 615ms load time is genuinely fast for a content site — no spinner, no layout shift, page was just there.
- **(1x)** The niche is unusually specific: AI x Australian chemical engineering. That specificity is the only reason I didn't close the tab in the first 3 seconds.
- **(1x)** 615ms load time is genuinely fast for a content site — no spinner, no layout shift, page just appeared
- **(1x)** The niche specificity (ChemE x AI x Australia) is actually interesting — I've never seen this angle before and the Mar 30 headline 'Anthropic opens a Sydney office' is legitimately news I care about
- **(1x)** 615ms load time with no JS errors — this actually loads fast, which is more than I can say for every bloated React news site I've rage-quit.
- **(1x)** The niche is real and specific: Australian ChemE x AI. I immediately knew if this was for me. That clarity is rare.

---

## Suggestions

- **(1x)** Kill COMMUNITY, JOBS, READINESS from the nav until they have real content — empty pages destroy trust faster than having fewer pages
- **(1x)** Show post count or date range on the calendar so I know if this is a 3-day-old project or a year of archives before I invest time
- **(1x)** Add an RSS or email subscribe link — if I can't passively receive this, the daily cadence promise means nothing to me
- **(1x)** If calendar dates have no content, show a disabled state or tooltip — dead clicks feel like bugs
- **(1x)** Remove the duplicate IMPACT/BLOG nav entry or make them distinct destinations
- **(1x)** Show post count or filled calendar dots so I know there's more than one day of content before I invest any interaction.
- **(1x)** Fix the IMPACT/BLOG duplicate nav — pick one label or make IMPACT a non-link heading.
- **(1x)** Visually distinguish calendar days that have posts (dot indicator, bold date) from empty days — right now it's a useless grid
- **(1x)** Merge IMPACT and BLOG into one nav item or explain the difference — duplicate links to the same page break trust immediately
- **(1x)** Add a visible post count or 'Last updated: Mar 30' timestamp somewhere above the fold so I know this is actually live

---

## Individual Persona Feedback

### Luna Park (35, Real user from Hacker News. Their words: "I was running Gemini CLI with the conductor format for task tracking, and Claude Code with superpowers skills for implementation — also inspired by OpenClaw&#x27;s approach. All great tools, but compl...")
Tech: 47% | Patience: 32s | Download: ✗ | Pay: ✗ | Return: ✗

Okay, I'm on the page. 'The Daily AI Shift — Chemical Engineering x AI.' My first read: this is niche in a way that could be genuinely useful, or niche in a way that means nobody maintains it. The nav has seven items across the top. SEVEN. IMPACT. BLOG. RADAR. LEARN. COMMUNITY. JOBS. READINESS. I'm already suspicious — in my experience, the wider the nav, the emptier the pages. I click COMMUNITY because that's the first unknown I want to stress-test. If it's a ghost town, I'm out.

I notice both IMPACT and BLOG link to the exact same index.html. That's not a metaphor for something — that's just a bug or a copy-paste error in the nav, and it immediately pings my 'this is half-finished' detector. The calendar widget is cute — 'Click a date to read that day's digest' — but March 2026 shows exactly one post. One. Mar 30. Every other day is presumably empty. So either this launched today, or the daily cadence is aspirational marketing copy. I've been burned by that before. Daily AI newsletters that are actually weekly-ish newsletters with a daily brand.

The actual post title is good — specific companies, specific models, real events. If this were email-delivered to me with no friction, I'd read it. But the product is asking me to come back daily to a calendar that's mostly empty, navigate seven tabs most of which are probably placeholder pages, and figure out what READINESS even means without clicking it. My 32 seconds are up and my benchmark is still my RSS reader. This doesn't beat it yet.

### Kai Young (23, Real user from Hacker News. Their words: "AnyProxy v1.0.13 - Web Management &amp; Clash Support ## New Features ### Web Management Interface * Gateway Dashboard *: Real-time monitoring at http:&#x2F;&#x2F;localhost:8090 - Active connections a...")
Tech: 71% | Patience: 19s | Download: ✗ | Pay: ✗ | Return: ✗

I clicked through from an HN comment about AnyProxy's web management interface running at localhost:8090. The URL matched. The product did not. I landed on 'The Daily AI Shift | Chemical Engineering x AI' and my brain just stalled for a second — is this a joke? I'm looking for a proxy dashboard and I'm getting Australian mining industry AI news. I gave it maybe 8 seconds to make sense before accepting it never would.

I did a fast scan anyway out of habit. Seven nav items crammed in a header, two of them pointing to the same page. A calendar widget that looked interactive. I clicked a couple of empty dates — Mar 27, Mar 28 — nothing. No spinner, no 'no post yet', just silence. That's the kind of half-finished UX that tells me this thing isn't ready. The one post that exists (Mar 30) loaded fast and the tag system looked clean, but I wasn't reading a ChemE digest.

I left at the 19-second mark. Not because it's a bad product for its actual audience — honestly if I were a chemical engineering student in Australia it might be useful — but it is categorically the wrong product for me, delivered via a URL collision with an unrelated HN thread. I won't be back.

### Casey Kim (31, Real user from Hacker News. Their words: "&gt; Adds the current webpage to the local YACY index. This assumes you are running YaCy in localhost:8090. Is there a way to use this plugin with an instance of Yacy hosted somewhere other than local...")
Tech: 46% | Patience: 18s | Download: ✗ | Pay: ✗ | Return: ✗

I landed on this from HN, already annoyed because I've been burned by niche AI newsletters that post twice and disappear. The page loaded fast — I'll give it that, under a second. Then I scanned the nav: IMPACT, BLOG, RADAR, LEARN, COMMUNITY, JOBS, READINESS. Seven items. I mentally noted 'COMMUNITY' and 'JOBS' as vaporware placeholders on a site this small, classic premature nav inflation. I clicked BLOG out of reflex and landed on... the same page. Same URL. That's the kind of lazy detail that tells me the builder copy-pasted the nav without checking.

I looked at the calendar — the whole interaction model is 'click a date.' But the calendar shows a grid with no visual cue of which dates have posts. No dots, no highlights, nothing. I can see today has a post about DeepSeek and Anthropic's Sydney office, which is actually relevant to me, but I've been on this page for maybe 10 seconds and already found a broken nav link and a calendar that doesn't show me why I should use it. My benchmark for this kind of thing is just having a curated RSS feed in Reeder — it doesn't ask me to click through a blank calendar.

I didn't click READ POST. The headline was fine — 'ChemE Careers at an Inflection Point' is the kind of thing I'd actually read — but I've seen too many of these micro-blogs that are one good post and then silence. The calendar gave me no evidence of history. I closed the tab. If there's a proper RSS feed or even a visible post archive showing 30 days of content, I might come back. Right now it feels like a demo, not a product.

### James Young (44, Real user from Hacker News. Their words: "The web server is only active if you run the command fish_config. When you run this command, if finds the next available port, starting at localhost:8000 and opens a web browser pointing to that port....")
Tech: 45% | Patience: 90s | Download: ✗ | Pay: ✗ | Return: ✓

I land on the page and it loads fast — okay, that's a point in its favor, my current RSS setup takes 2-3 seconds to render. But then I look at the nav bar: IMPACT, BLOG, RADAR, LEARN, COMMUNITY, JOBS, READINESS. Seven items. I hover IMPACT and BLOG and see they both go to index.html. That's my first red flag — either someone didn't finish building this or they don't know what their own product is called. I've seen this before on half-baked side projects that get abandoned in month two.

I scroll down to the calendar because that's the most visually distinct element. 'Click a date to read that day's digest.' I click March 15. Nothing. March 20. Nothing. So the calendar is essentially decorative except for today. That's a deal-breaker pattern I've hit before — UI that promises interactivity and delivers emptiness. It's not a bug exactly, it's just dishonest design.

I almost leave here, but then I notice the actual post headline: 'Anthropic opens a Sydney office. Australian industrial employers cut roles as AI reshapes operations.' That's... actually specific and real. I work adjacent to industrial automation and I've never seen a blog that combines ChemE with Australian AI news at this level of specificity. My patience is at about 70 seconds now. I click READ POST to see if the content delivers, because if it does, I might bookmark this even with the nav mess. The verdict on whether I return entirely depends on what's inside that post.

### Jack Chen (28, Real user from Hacker News. Their words: "alias ip=&quot;curl icanhazip.com&quot; # Your public IP address alias diskspace=&quot;du -S | sort -n -r |less&quot; alias pyserver=&#x27;python -m SimpleHTTPServer&#x27; alias phpserver=&#x27;php -S...")
Tech: 79% | Patience: 58s | Download: ✗ | Pay: ✗ | Return: ✓

Okay, HN link, ChemE + AI, Australian focus — niche enough to be interesting. Load is fast, I'll give it that. I land on 'The Daily AI Shift' and immediately scan the nav: IMPACT, BLOG, RADAR, LEARN, COMMUNITY, JOBS, READINESS. Seven items. I click BLOG and I'm... still on the same page? Same URL. I click IMPACT — same page again. That's my first yellow flag, feels unfinished.

I scroll down and there's a calendar for March 2026. One date lit up: March 30. I click it, it shows one post about DeepSeek and Anthropic Sydney. The content headline is actually decent — 'ChemE Careers at an Inflection Point' is exactly the kind of framing I'd want. But I'm sitting here thinking: this is a *daily* digest with one day of content and a calendar UI that implies there should be 30 days of posts. That gap between the promise and the reality is a deal-breaker pattern I've seen before.

I'm at about 45 seconds in. I'm not rage-quitting — the niche is genuinely good and the post itself looks substantive enough that I'd read it. But I wouldn't bookmark this or come back organically. There's no RSS, no subscribe, no feed. The 'daily' in the name requires a retention mechanism and I see nothing. I'd return if someone linked me a specific post. I would not seek this out.

### Jack Singh (31, Real user from Hacker News. Their words: "Hoping this is useful to others. Motivation is simplicity. I wanted to be able to install easily via &quot;go get github.com&#x2F;fkautz&#x2F;serve&quot;, run by typing &quot;serve&quot; and visit htt...")
Tech: 97% | Patience: 58s | Download: ✗ | Pay: ✗ | Return: ✗

Landed on the page, clocked the nav immediately. Seven nav items, two of them point to index.html — IMPACT and BLOG both go to the same place. That's sloppy. I've seen this before on side projects where someone adds nav items as placeholders and never cleans them up. Not a dealbreaker yet, but the credibility meter dropped.

Scrolled for the calendar. 'Click a date to read that day's digest' — okay, so where are the dates? I see the day-of-week headers (Mon Tue Wed Thu Fri Sat Sun) but the actual date grid is nowhere in the scraped content. Either it rendered below the fold and I missed it, or JavaScript is populating it dynamically and something went wrong. Either way, I'm not going to dig around to find out. One post from today is visible. One. If I'm evaluating whether a daily digest is worth subscribing to, I need to see a track record — not just today's entry.

I hit my patience limit around here. No RSS link anywhere visible. For a 'daily digest' aimed at technical readers, that's the single most important distribution mechanism and it's absent. My current approach — a curated RSS folder in NetNewsWire — does this better out of the box. This would need RSS, a working calendar, and deduplicated nav before I'd consider coming back. Right now it reads like a well-intentioned side project that isn't ready for daily use.

### Kai Kim (42, Real user from Hacker News. Their words: "Doesn&#x27;t look like it supports HTTP pipelining: [trent@ubuntu&#x2F;ttypts&#x2F;4(~s&#x2F;wrk)%] .&#x2F;wrk -c 1 -t 1 --latency -d 5 http:&#x2F;&#x2F;localhost:8080&#x2F;Makefile Running 5s test @ ...")
Tech: 37% | Patience: 59s | Download: ✗ | Pay: ✗ | Return: ✗

Landed on this from HN. First thing I see is a nav bar with seven items — IMPACT, BLOG, RADAR, LEARN, COMMUNITY, JOBS, READINESS — and I immediately clock that IMPACT and BLOG point to the same URL. That's the kind of sloppy detail that tells me either the developer didn't QA this or it's a placeholder that never got cleaned up. Either way, not a great sign. I've been burned by 'daily digest' products before that have three posts and a lot of empty chrome.

I scroll down and there's a calendar widget. 'Click a date to read that day's digest.' Okay. I see March 2026, day headers, and... Mar 30 has a post card visible. That's it. One post. The calendar itself is just whitespace above it. I can't tell if the dates are supposed to render as clickable cells and failed, or if this is intentional and only today shows up. My gut says it's a display bug — the calendar grid is there, the dates aren't. I've got maybe 20 seconds of patience left at this point.

I'm not going to click through to the post. If the landing experience is this ambiguous — broken-looking calendar, duplicate nav links, one lonely article — I'm not going to find value in the next 20 seconds. I've seen this pattern: ambitious scope (seven nav sections!), thin execution (one post, half-rendered UI). The load time was good, I'll give it that. But this isn't noticeably better than just reading a curated newsletter or checking LinkedIn. I'm out.

### Henry Smith (47, Real user from Hacker News. Their words: "It could be extended to support other kinds of Markdown. Feel free to open an issue and suggest it! Caddy does have basic reverse proxy functionality. Something like what you&#x27;re suggesting could ...")
Tech: 68% | Patience: 63s | Download: ✗ | Pay: ✗ | Return: ✗

Landed on this from HN. The pitch is niche enough that I'm actually curious — ChemE + AI in Australia is a specific enough angle that someone clearly has a point of view. Load was fast, no jank, good start. I immediately looked for an RSS feed or API — nothing in the footer, nothing obvious in the nav. I'm a feed reader person and this is a dealbreaker tendency I have. Scanned the 7-item nav: IMPACT, BLOG, RADAR, LEARN, COMMUNITY, JOBS, READINESS. Clicked COMMUNITY — placeholder or real? Same with JOBS. Spent about 15 seconds trying to find any extensibility hook: webhook, API, JSON feed, even a mailto subscribe. Nothing.

The calendar widget for browsing posts is an interesting UI choice but I'm immediately suspicious — one visible post for March 30 and everything else is presumably empty. That's thin. I clicked through to the Mar 30 post link just to verify content exists, and it does seem like a real article based on the description. But I'm here looking for a platform I can integrate with or extend, and this is a completely closed static HTML site with no hooks.

By the time I hit 50 seconds I'd already mentally checked out. There's no RSS, no API, no search, no way to programmatically consume this. The IMPACT/BLOG nav duplication bugged me — sloppy. For a power user this is a read-only island. Nice niche, decent execution on the static site fundamentals, but zero extensibility. I won't return regularly because I have no way to subscribe without checking back manually, and I'm not doing that for a single-post-per-day blog.

### Zara Costa (41, Real user from Hacker News. Their words: "i totally agree, though i'd phrase it as: RescueTime is too granular, whereas i want something with low but abstract resolution. i manually track every hour of my day into categories such as startup, ...")
Tech: 70% | Patience: 23s | Download: ✗ | Pay: ✗ | Return: ✗

Okay, I clicked through from the HN thread expecting... I'm not sure what. Something about time tracking or productivity categories? But I'm looking at a chemical engineering AI news blog. I'm a software person, not a ChemE. I'm already irritated because I misread the context of the link. My 23 seconds are running out fast.

I scan the page. There's a calendar with one post on it — March 30. The headline is fine, actually specific ('DeepSeek V3.2 unlocks new simulation co-pilot possibilities'), but I don't care about process simulation. I notice IMPACT and BLOG both go to index.html. That's sloppy. I click BLOG out of reflex — same page. Classic nav bug that nobody tested.

I'm out. This is a niche industry blog for Australian chemical engineers and I am neither Australian nor a chemical engineer. Even if I were, I'd want an RSS feed before bookmarking anything, and I don't see one. The product itself might be fine for its actual audience — the specificity and load speed are real positives — but I'm the wrong user and I found no reason to stay past the first 15 seconds.

### Taylor Muller (36, Real user from Hacker News. Their words: "Apparently Netflix is cracking down on users circumventing the geolocks on content -- but if you want to try, remember that ssh does socks5 (including DNS) proxying. Spin up a VPS at eg Digital Ocean ...")
Tech: 99% | Patience: 44s | Download: ✗ | Pay: ✗ | Return: ✗

Landed on 'The Daily AI Shift' from an HN link. Title says Chemical Engineering x AI — okay, not what I'm after but I give it 10 seconds. I'm looking for anything touching geolocking circumvention, SSH tunneling, SOCKS5, VPN evasion, that kind of thing. I scan the nav: IMPACT, BLOG, RADAR, LEARN, COMMUNITY, JOBS, READINESS. Nothing screams networking or security.

The single visible post is about 'DeepSeek V3.2 unlocks new simulation co-pilot possibilities' and 'Anthropic opens a Sydney office.' Tags: models, process-simulation, australia, careers, cheme. Hard no. I look for a search bar — there isn't one. The entire discovery model is a calendar where you click dates. That's a dealbreaker for me; I'm not going to manually step through March 2026 hoping to stumble on SSH content that almost certainly isn't here.

I'm out at roughly the 20-second mark. This is a niche vertical blog for Australian ChemE students. Competently built — fast, no errors, clean nav — but it has exactly zero relevance to what I came for. Wrong product, wrong audience, wrong topic. Not a quality problem, just a complete mismatch.
