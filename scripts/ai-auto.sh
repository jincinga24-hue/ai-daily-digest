#!/bin/bash
# AI Daily Digest — Auto mode (Phase 2)
# Researches, writes, and publishes without review
# Usage: ai-auto

BLOG_DIR="$HOME/Vs Code/First Project/ai-daily-digest"
PROMPT_FILE="$BLOG_DIR/scripts/blog-prompt.md"
POSTS_JSON="$BLOG_DIR/assets/data/posts.json"
TODAY=$(date +%Y-%m-%d)
POST_FILE="$BLOG_DIR/posts/$TODAY-ai-daily-digest.html"
POST_SLUG="$TODAY-ai-daily-digest"

if [ -f "$POST_FILE" ]; then
    echo "Today's post ($TODAY) already published."
    exit 0
fi

echo "========================================"
echo "  The Daily AI Shift — Auto Publish"
echo "  Date: $TODAY"
echo "========================================"

cd "$BLOG_DIR"

# Generate directly to _posts (skip drafts)
claude -p "$(cat "$PROMPT_FILE")

Today's date is $TODAY. Research and write today's blog post. Save it DIRECTLY to: $POST_FILE" \
    --allowedTools "Bash,Read,Write,Edit,WebSearch,WebFetch"

# Update posts.json with the new entry
if [[ -f "$POST_FILE" && -f "$POSTS_JSON" ]]; then
  TITLE=$(python3 -c "
import re, sys
html = open(sys.argv[1]).read()
m = re.search(r'<title>(.*?)(?:\s*[|—].*)?</title>', html)
print(m.group(1).strip() if m else 'AI Daily Digest')
" "$POST_FILE" 2>/dev/null || echo "AI Daily Digest")
  python3 - "$POST_SLUG" "$TITLE" "$TODAY" "$TODAY-ai-daily-digest.html" <<'PYEOF' > "${POSTS_JSON}.tmp" && mv "${POSTS_JSON}.tmp" "$POSTS_JSON"
import json, sys
slug, title, date, filename = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
with open('assets/data/posts.json') as f:
    data = json.load(f)
# Avoid duplicates
if not any(p.get('slug') == slug for p in data):
    data.insert(0, {
        'date': date,
        'title': title,
        'slug': slug,
        'file': filename,
        'tags': ['ai', 'daily'],
        'excerpt': f'Daily AI digest for {date}.'
    })
    print(json.dumps(data, indent=2))
else:
    import sys as _sys
    print(json.dumps(data, indent=2))
PYEOF
  echo "Updated: assets/data/posts.json"
fi

# Auto commit and push
git add "posts/$TODAY-ai-daily-digest.html" "assets/data/posts.json"
git commit -m "feat: publish AI daily digest for $TODAY"
git push origin main 2>/dev/null || echo "Note: Push failed. Commit saved locally."

echo ""
echo "Auto-published: $POST_FILE"
