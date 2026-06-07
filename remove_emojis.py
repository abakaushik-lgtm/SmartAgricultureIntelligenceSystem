import os
import emoji

def remove_emojis_from_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return

    # Check if there are any emojis
    if emoji.emoji_count(content) > 0:
        # Replace emojis with nothing
        new_content = emoji.replace_emoji(content, replace='')
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Removed emojis from {filepath}")
        except Exception as e:
            print(f"Error writing to {filepath}: {e}")

def main():
    dirs_to_process = ['frontend/src', 'backend', 'docs']
    files_to_process = ['README.md', 'index.html', 'frontend/index.html']
    
    # Process specific files
    for f in files_to_process:
        if os.path.exists(f):
            remove_emojis_from_file(f)
            
    # Process directories
    for d in dirs_to_process:
        if os.path.exists(d):
            for root, dirs, files in os.walk(d):
                for file in files:
                    if file.endswith(('.py', '.tsx', '.ts', '.js', '.jsx', '.html', '.css', '.md')):
                        filepath = os.path.join(root, file)
                        remove_emojis_from_file(filepath)

if __name__ == '__main__':
    main()
