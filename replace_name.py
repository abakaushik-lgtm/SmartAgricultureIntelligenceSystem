import os
import pathlib

exclude = ['node_modules', '.git', 'dist', '.venv', '__pycache__', '.pytest_cache', 'models', 'data', '.mypy_cache']

def replace_in_files():
    root = pathlib.Path('.')
    for p in root.rglob('*'):
        if not p.is_file() or any(ex in p.parts for ex in exclude):
            continue
        if p.suffix in ['.pyc', '.pt', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.pdf', '.zip']:
            continue
            
        try:
            with open(p, 'rb') as f:
                content_bytes = f.read()
            content = content_bytes.decode('utf-8')
        except Exception:
            continue
            
        if 'HarvestMind' in content or 'harvestmind' in content:
            new_content = content.replace('HarvestMind', 'HarvestMind')
            new_content = new_content.replace('HarvestMind', 'HarvestMind')
            new_content = new_content.replace('harvestmind', 'harvestmind')
            
            if new_content != content:
                with open(p, 'wb') as f:
                    f.write(new_content.encode('utf-8'))
                print(f"Updated {p}")

if __name__ == '__main__':
    replace_in_files()
