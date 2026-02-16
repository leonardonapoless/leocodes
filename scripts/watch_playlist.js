import fs from 'fs';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const songsPath = path.join(__dirname, 'songs.txt');
const generateScript = path.join(__dirname, 'generate_playlist.js');

console.log('👀 Watching scripts/songs.txt for changes...');

let debounceTimer;

fs.watch(songsPath, (eventType, filename) => {
    if (filename) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            console.log(`\nChanges detected in ${filename}. Regenerating playlist...`);

            const child = spawn('node', [generateScript], { stdio: 'inherit' });

            child.on('close', (code) => {
                console.log(`Playlist regeneration complete (Exit code: ${code})`);
                console.log('👀 Waiting for changes...');
            });
        }, 500);
    }
});
