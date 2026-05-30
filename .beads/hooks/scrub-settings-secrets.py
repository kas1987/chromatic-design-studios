import json
import re
import sys

SECRET_PATTERNS = re.compile(r'TOKEN|SECRET|_KEY|PASSWORD|CREDENTIALS', re.IGNORECASE)

data = sys.stdin.read()
obj = json.loads(data)

env = obj.get('env', {})
scrubbed = {k: v for k, v in env.items() if not SECRET_PATTERNS.search(k)}
if scrubbed != env:
    obj['env'] = scrubbed
    if not obj['env']:
        del obj['env']

print(json.dumps(obj, indent=2))
