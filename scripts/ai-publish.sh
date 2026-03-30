#!/bin/bash
# AI Daily Digest — Publish approved draft
# Usage: ai-publish [date]
# If no date given, publishes today's draft

BLOG_DIR="$HOME/Vs Code/First Project/ai-daily-digest"
DATE=${1:-$(date +%Y-%m-%d)}
DRAFT_FILE="$BLOG_DIR/_drafts/$DATE-ai-daily-digest.html"
POST_FILE="$BLOG_DIR/posts/$DATE-ai-daily-digest.html"

if [ ! -f "$DRAFT_FILE" ]; then
    echo "No draft found for $DATE"
    echo "  Expected: $DRAFT_FILE"
    echo ""
    echo "Run 'ai-blog' first to generate a draft."
    exit 1
fi

if [ -f "$POST_FILE" ]; then
    echo "Post for $DATE already published!"
    echo "  $POST_FILE"
    exit 1
fi

echo "Publishing draft for $DATE..."

# Move draft to posts
cp "$DRAFT_FILE" "$POST_FILE"
rm "$DRAFT_FILE"

# Update posts.json with the new post entry
POSTS_JSON="$BLOG_DIR/assets/data/posts.json"
if [ -f "$POSTS_JSON" ]; then
  python3 - "$POST_FILE" "$DATE" "$POSTS_JSON" <<'PYEOF'
import json, sys, re
from pathlib import Path

post_file, date, posts_json_path = sys.argv[1], sys.argv[2], sys.argv[3]

# Extract title from HTML
html = Path(post_file).read_text(encoding='utf-8')
match = re.search(r'<h1[^>]*>([^<]+)</h1>', html)
title = match.group(1).strip() if match else f'AI Daily Digest — {date}'

# Build slug and filename from path
filename = Path(post_file).name
slug = filename.replace('.html', '')

with open(posts_json_path) as f:
    data = json.load(f)

# Avoid duplicate entries
if not any(p.get('date') == date for p in data):
    data.insert(0, {
        'date': date,
        'title': title,
        'slug': slug,
        'file': filename,
        'tags': ['AI', 'ChemE'],
        'excerpt': 'Daily AI digest for chemical engineers.'
    })
    with open(posts_json_path, 'w') as f:
        json.dump(data, f, indent=2)
    print(f"Updated posts.json with entry for {date}")
else:
    print(f"posts.json already has entry for {date}, skipping")
PYEOF
else
  echo "Warning: assets/data/posts.json not found — add entry manually"
fi

# Git commit and push
cd "$BLOG_DIR"
git add "posts/$DATE-ai-daily-digest.html" "assets/data/posts.json"
git commit -m "feat: publish AI daily digest for $DATE"
git push origin main 2>/dev/null || echo "Note: Push failed or no remote set up yet. Commit saved locally."

echo ""
echo "Published: $POST_FILE"
echo "Run 'git push' if auto-push didn't work."
