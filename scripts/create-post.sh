#!/usr/bin/env bash
# Usage: ./scripts/create-post.sh <date> <title>
# Example: ./scripts/create-post.sh 2026-04-01 "AI Weekly Roundup"

set -euo pipefail

DATE="${1:-}"
TITLE="${2:-}"

if [[ -z "$DATE" || -z "$TITLE" ]]; then
  echo "Usage: $0 <YYYY-MM-DD> <\"Post Title\">"
  exit 1
fi

if ! [[ "$DATE" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
  echo "Error: Date must be in YYYY-MM-DD format"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
POSTS_DIR="$PROJECT_ROOT/posts"
POSTS_JSON="$PROJECT_ROOT/assets/data/posts.json"

# Generate slug from title: lowercase, spaces to hyphens, strip special chars
SLUG=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9 ]//g' | sed 's/ \+/-/g' | sed 's/-\+/-/g')
FILENAME="${DATE}-${SLUG}.html"
FILEPATH="$POSTS_DIR/$FILENAME"

if [[ -f "$FILEPATH" ]]; then
  echo "Error: Post already exists at posts/$FILENAME"
  exit 1
fi

# Format display date from YYYY-MM-DD
PARTS=(${DATE//-/ })
YEAR="${PARTS[0]}"
MONTH_NUM="${PARTS[1]#0}"
DAY_NUM="${PARTS[2]#0}"
MONTHS=("" "January" "February" "March" "April" "May" "June" "July" "August" "September" "October" "November" "December")
DISPLAY_DATE="${MONTHS[$MONTH_NUM]} $DAY_NUM, $YEAR"

# Use Python to write the HTML file safely, avoiding shell injection from $TITLE
python3 - "$FILEPATH" "$TITLE" "$DISPLAY_DATE" <<'PYEOF'
import sys
from html import escape

filepath, title, display_date = sys.argv[1], sys.argv[2], sys.argv[3]
safe_title = escape(title)
safe_date = escape(display_date)

content = f"""<!DOCTYPE html>
<html lang="en-AU">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{safe_title} — {safe_date} | The Daily AI Shift</title>
  <meta name="description" content="TODO: Add description">
  <meta property="og:title" content="{safe_title} | The Daily AI Shift">
  <meta property="og:description" content="TODO: Add description">
  <meta property="og:type" content="website">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>&#x26A1;</text></svg>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
  <script>
    tailwind.config = {{
      theme: {{
        extend: {{
          colors: {{
            primary: '#005cba',
            'primary-dark': '#004a99',
            surface: '#f9f9fb',
            card: '#ffffff',
            ink: '#2d3338',
            muted: '#6b7280'
          }},
          fontFamily: {{ sans: ['Inter', 'system-ui', 'sans-serif'] }}
        }}
      }}
    }}
  </script>
  <link rel="stylesheet" href="../assets/css/main.css">
  <style>body {{ font-family: 'Inter', system-ui, sans-serif; }}</style>
</head>
<body class="bg-surface text-ink min-h-screen">
  <nav id="main-nav"></nav>

  <main class="max-w-3xl mx-auto px-6 pt-24 pb-16">
    <a href="../index.html" class="inline-flex items-center text-xs font-semibold uppercase tracking-widest text-primary hover:text-primary-dark transition-colors mb-8">&larr; Back to all posts</a>
    <h1 class="text-3xl md:text-4xl font-black tracking-tight text-ink mb-3">{safe_title}</h1>
    <div class="flex flex-wrap items-center gap-2 mb-10 text-sm text-muted">
      <span>{safe_date}</span>
      <span class="text-gray-300">&middot;</span>
      <span class="inline-block text-[10px] font-semibold uppercase tracking-widest bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">TODO</span>
    </div>

    <div class="post-content leading-relaxed">
      <h2>TODO: Section heading</h2>
      <p>TODO: Post content goes here.</p>
    </div>
  </main>

  <footer class="border-t border-gray-200 py-8 mt-16">
    <div class="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-muted">
      <span>&copy; 2026 The Daily AI Shift. Built with Claude Code.</span>
      <span class="font-semibold uppercase tracking-widest text-ink">IMPACT</span>
    </div>
  </footer>

  <script src="../assets/js/utils.js"></script>
  <script>renderNav('blog', '../');</script>
</body>
</html>"""

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
PYEOF

echo "Created: posts/$FILENAME"

# Add entry to posts.json if it exists
if [[ -f "$POSTS_JSON" ]]; then
  # Use sys.argv to avoid shell quoting issues with titles containing special chars
  python3 - "$DATE-$SLUG" "$TITLE" "$DATE" "$FILENAME" "$POSTS_JSON" <<'PYEOF' > "${POSTS_JSON}.tmp" && mv "${POSTS_JSON}.tmp" "$POSTS_JSON"
import json, sys
slug, title, date, filename, posts_json = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5]
with open(posts_json) as f:
    data = json.load(f)
data.insert(0, {
    'date': date,
    'title': title,
    'slug': slug,
    'file': filename,
    'tags': ['TODO'],
    'excerpt': 'TODO: Add excerpt'
})
print(json.dumps(data, indent=2))
PYEOF

  echo "Updated: assets/data/posts.json"
else
  echo "Warning: assets/data/posts.json not found — add entry manually"
fi

echo "Done. Edit posts/$FILENAME to add your content."
