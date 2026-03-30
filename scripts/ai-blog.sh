#!/bin/bash
# AI Daily Digest — Draft Generator
# Usage: ai-blog

BLOG_DIR="$HOME/Vs Code/First Project/ai-daily-digest"
PROMPT_FILE="$BLOG_DIR/scripts/blog-prompt.md"
POSTS_JSON="$BLOG_DIR/assets/data/posts.json"
TODAY=$(date +%Y-%m-%d)
DRAFT_FILE="$BLOG_DIR/_drafts/$TODAY-ai-daily-digest.html"
POST_SLUG="$TODAY-ai-daily-digest"

# Check if draft already exists
if [ -f "$DRAFT_FILE" ]; then
    echo "Draft for today ($TODAY) already exists at:"
    echo "  $DRAFT_FILE"
    echo ""
    echo "To regenerate, delete it first:"
    echo "  rm \"$DRAFT_FILE\""
    exit 1
fi

echo "========================================"
echo "  The Daily AI Shift — Draft Generator"
echo "  Date: $TODAY"
echo "========================================"
echo ""
echo "Researching today's AI news and writing draft..."
echo ""

cd "$BLOG_DIR"

claude -p "$(cat "$PROMPT_FILE")

Today's date is $TODAY. Research and write today's blog post. Save it to: $DRAFT_FILE" \
    --allowedTools "Bash,Read,Write,Edit,WebSearch,WebFetch"

# Update posts.json with a draft entry (tagged as draft, can be promoted on publish)
if [[ -f "$DRAFT_FILE" && -f "$POSTS_JSON" ]]; then
  TITLE=$(python3 -c "
import re, sys
html = open(sys.argv[1]).read()
m = re.search(r'<title>(.*?)(?:\s*[|—].*)?</title>', html)
print(m.group(1).strip() if m else 'AI Daily Digest')
" "$DRAFT_FILE" 2>/dev/null || echo "AI Daily Digest")
  python3 - "$POST_SLUG" "$TITLE" "$TODAY" "$TODAY-ai-daily-digest.html" <<'PYEOF' > "${POSTS_JSON}.tmp" && mv "${POSTS_JSON}.tmp" "$POSTS_JSON"
import json, sys
slug, title, date, filename = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
with open('assets/data/posts.json') as f:
    data = json.load(f)
if not any(p.get('slug') == slug for p in data):
    data.insert(0, {
        'date': date,
        'title': title,
        'slug': slug,
        'file': filename,
        'tags': ['ai', 'daily'],
        'excerpt': f'Daily AI digest for {date}.',
        'draft': True
    })
    print(json.dumps(data, indent=2))
else:
    print(json.dumps(data, indent=2))
PYEOF
  echo "Updated: assets/data/posts.json (draft entry)"
fi

echo ""
echo "========================================"
echo "Draft saved to: $DRAFT_FILE"
echo ""
echo "To review:  open \"$DRAFT_FILE\""
echo "To edit:    code \"$DRAFT_FILE\""
echo "To publish: ai-publish"
echo "========================================"
