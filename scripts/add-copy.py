#!/usr/bin/env python3
"""Ajoute/merge une section dans src/data/copy.json de façon atomique (verrou).
Usage : python3 scripts/add-copy.py <clé_section> '<json de la section>'
"""
import sys, json, fcntl, os
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
p = os.path.join(root, 'src/data/copy.json')
key, payload = sys.argv[1], json.loads(sys.argv[2])
with open(p, 'r+', encoding='utf-8') as f:
    fcntl.flock(f, fcntl.LOCK_EX)
    data = json.load(f)
    section = data.get(key, {})
    for k, v in payload.items():
        if k == '_labels': section.setdefault('_labels', {}).update(v)
        else: section[k] = v
    data[key] = section
    f.seek(0); f.truncate(); json.dump(data, f, ensure_ascii=False, indent=2); f.write('\n')
print('ok', key, list(payload.keys())[:8])
