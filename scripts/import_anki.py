import zipfile
import sqlite3
import json
import os
import sys
import shutil

import zipfile
import sqlite3
import json
import os
import sys
import shutil
import time
import random

def extract_anki_deck(apkg_path, output_ts_path='src/data/imported_words.ts'):
    print(f"Processing {apkg_path}...")
    
    # Create unique temp directory to avoid locks
    temp_dir = f'temp_anki_extract_{random.randint(1000, 9999)}'
    if os.path.exists(temp_dir):
        try:
            shutil.rmtree(temp_dir)
        except:
            pass
    os.makedirs(temp_dir)

    try:
        # Unzip .apkg
        with zipfile.ZipFile(apkg_path, 'r') as zip_ref:
            # List files to understand structure
            print("Files in archive:")
            for f in zip_ref.namelist():
                print(f" - {f}")
            zip_ref.extractall(temp_dir)

        # Look for DB - prioritize .anki21 (newer format)
        db_path = os.path.join(temp_dir, 'collection.anki21')
        if not os.path.exists(db_path):
             db_path = os.path.join(temp_dir, 'collection.anki2')
        
        if not os.path.exists(db_path):
            # Try finding any .anki2 file or sqlite file
            potential_dbs = [f for f in os.listdir(temp_dir) if f.endswith('.anki2') or f.endswith('.anki21') or 'collection' in f]
            if potential_dbs:
                db_path = os.path.join(temp_dir, potential_dbs[0])
                print(f"Using alternative DB: {db_path}")
            else:
                print("Invalid .apkg file: no database found")
                return

        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # Query notes (cards)
        cursor.execute("SELECT flds FROM notes")
        rows = cursor.fetchall()
        
        print(f"Found {len(rows)} notes.")
        
        if len(rows) > 0:
            print("Sample raw row:", rows[0][0])

        words = []
        start_id = 2000 # Higher starting ID
        
        for row in rows:
            fields = row[0].split('\x1f')
            
            if len(fields) < 2:
                continue

            # Try to identify word and translation
            # Assuming English is Field 0 or 1, Russian is Field 0 or 1
            # We need to detect which is which. 
            # Simple heuristic: Russian has Cyrillic.
            
            f0 = fields[0].strip()
            f1 = fields[1].strip()
            
            import re
            clean_tags = re.compile('<.*?>')
            f0 = re.sub(clean_tags, '', f0)
            f1 = re.sub(clean_tags, '', f1)
            
            # Check for Cyrillic
            has_cyrillic_f0 = bool(re.search('[а-яА-Я]', f0))
            has_cyrillic_f1 = bool(re.search('[а-яА-Я]', f1))
            
            word = ""
            translation = ""
            
            if has_cyrillic_f1 and not has_cyrillic_f0:
                word = f0
                translation = f1
            elif has_cyrillic_f0 and not has_cyrillic_f1:
                word = f1
                translation = f0
            else:
                # Fallback: assume Word -> Translation
                word = f0
                translation = f1

            # Skip empty
            if not word or not translation:
                continue
                
            # Skip if word is too long (likely a sentence or description)
            if len(word) > 50:
                continue

            # Create 3 wrong options (placeholders for now)
            options = [translation, "...", "...", "..."]
            
            words.append({
                "id": start_id,
                "word": word,
                "translation": translation,
                "example": f"Example with {word}", 
                "options": options
            })
            start_id += 1

        conn.close()

        # Generate TypeScript output
        ts_content = "import { Word } from './words';\n\n"
        ts_content += "export const IMPORTED_WORDS: Word[] = [\n"
        
        for w in words:
            # We will fix options later or user can regenerate
            ops = w['options']
            ts_content += f"  {{ id: {w['id']}, word: \"{w['word']}\", translation: \"{w['translation']}\", example: \"{w['example']}\", options: {json.dumps(ops, ensure_ascii=False)} }},\n"
        
        ts_content += "];\n"

        with open(output_ts_path, 'w', encoding='utf-8') as f:
            f.write(ts_content)

        print(f"Success! Extracted {len(words)} words to {output_ts_path}")

    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        # Cleanup with retry
        try:
            conn.close() # Ensure closed
        except:
            pass
            
        try:
            if os.path.exists(temp_dir):
                shutil.rmtree(temp_dir)
        except:
            print(f"Warning: Could not delete temp dir {temp_dir}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scripts/import_anki.py <path_to_apkg> [output_ts_path]")
    else:
        output_path = sys.argv[2] if len(sys.argv) > 2 else 'src/data/imported_words.ts'
        extract_anki_deck(sys.argv[1], output_path)
