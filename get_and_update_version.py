#!/usr/bin/python3
import json
with open('package.json', 'r') as f:
    data=json.load(f)
print(data['version'])
version = data['version'].split('.')
version[-1] = str(int(version[-1])+1)
data['version'] = '.'.join(version)
with open('package.json', 'w') as f:
    json.dump(data, f, indent=2)
