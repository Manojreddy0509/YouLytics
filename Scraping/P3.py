import json
from P2 import get_comments

# Fetch all comments using your function
all_comments = get_comments("7a14teGcv48", "API_KEY_HERE")

with open("all_comments1.json", "w", encoding="utf-8") as f:
    json.dump(all_comments, f, ensure_ascii=False, indent=2)

print("✅ Comments saved to all_comments.json")
