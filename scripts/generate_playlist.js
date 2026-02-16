import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const songsPath = path.join(__dirname, 'songs.txt');
const rawPlaylist = fs.readFileSync(songsPath, 'utf-8');

const songs = rawPlaylist.split('\n')
    .filter(line => line.trim() !== '')
    .map((line, index) => {
        const cleanLine = line.replace(/^\d+\s*-\s*/, '').trim();
        const parts = cleanLine.split(' - ');

        if (parts.length >= 2) {
            return {
                id: (index + 1).toString(),
                artist: parts[0].trim(),
                title: parts.slice(1).join(' - ').trim(),
                originalLine: line
            };
        }
        return null;
    })
    .filter(s => s !== null);


const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function searchITunes(song, retries = 3) {
    const query = `${song.artist} ${song.title}`;
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=10&country=US`;

    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            });

            if (response.status === 403 || response.status === 429) {
                console.warn(`Rate limited for ${song.title}. Waiting before retry ${i + 1}...`);
                await sleep(5000 * (i + 1));
                continue;
            }

            if (response.ok) {
                const data = await response.json();
                if (data.resultCount > 0) {
                    const inputTitle = song.title.toLowerCase();
                    const inputArtist = song.artist.toLowerCase();
                    const isRemixRequested = inputTitle.includes('remix') || inputTitle.includes(' mix') || inputTitle.includes(' edit');

                    const scoredResults = data.results.map(r => {
                        let score = 0;
                        const rTitle = r.trackName.toLowerCase();
                        const rAlbum = (r.collectionName || '').toLowerCase();
                        const rArtist = r.artistName.toLowerCase();

                        if (rArtist === inputArtist) score += 100;
                        if (rArtist.includes(inputArtist)) score += 50;

                        const cleanRTitle = rTitle.split('(')[0].trim().split('[')[0].trim();
                        if (rTitle === inputTitle) score += 50;
                        else if (cleanRTitle === inputTitle) score += 40;
                        else if (rTitle.startsWith(inputTitle)) score += 20;
                        else if (rTitle.includes(inputTitle)) score += 10;

                        const isResultRemix = rTitle.includes('remix') || rTitle.includes(' mix') || rTitle.includes(' edit') || rTitle.includes('dub');
                        const isOriginalMix = rTitle.includes('original mix') || rTitle.includes('original version');

                        if (!isRemixRequested && isResultRemix && !isOriginalMix) {
                            score -= 100;
                        }
                        if (isRemixRequested && isResultRemix) {
                            score += 10;
                        }
                        if (isOriginalMix) {
                            score += 10;
                        }

                        if (rTitle.includes('live') || rTitle.includes('concert')) score -= 50;
                        if (rTitle.includes('karaoke') || rTitle.includes('tribute') || rTitle.includes('cover')) score -= 500;
                        if (rTitle.includes('[mixed]')) score -= 100;
                        if (rAlbum.includes('greatest hits') || rAlbum.includes('best of') || rAlbum.includes('essential') || rAlbum.includes('collection') || rAlbum.includes('anthology')) {
                            score -= 10;
                        }
                        if (rAlbum.includes('compilation') || rAlbum.includes('100 hits') || rAlbum.includes('ministry of sound') || rAlbum.includes('now that\'s what i call') || rAlbum.includes('various artists')) {
                            score -= 50;
                        }

                        return { result: r, score };
                    });

                    scoredResults.sort((a, b) => b.score - a.score);

                    const bestMatch = scoredResults[0];

                    const result = bestMatch.result;
                    let previewUrl = result.previewUrl;

                    if (previewUrl && previewUrl.includes('.p.m4a')) {
                        const epUrl = previewUrl.replace('.p.m4a', '.ep.m4a');
                        try {
                            const headRes = await fetch(epUrl, { method: 'HEAD' });
                            if (headRes.ok) {
                                previewUrl = epUrl;
                            }
                        } catch (e) { }
                    }

                    return {
                        ...song,
                        found: true,
                        itunesId: result.trackId,
                        previewUrl: previewUrl,
                        artworkUrl100: result.artworkUrl100,
                        artworkUrl60: result.artworkUrl60,
                        collectionName: result.collectionName,
                        trackName: result.trackName,
                        artistName: result.artistName,
                        trackViewUrl: result.trackViewUrl
                    };
                } else {
                    console.warn(`No results for: ${song.artist} - ${song.title}`);
                    return { ...song, found: false };
                }
            } else {
                console.warn(`HTTP Error ${response.status} for: ${song.artist} - ${song.title}`);
                return { ...song, found: false };
            }
        } catch (error) {
            console.error(`Attempt ${i + 1} failed for: ${song.artist} - ${song.title}`, error.message);
            if (i === retries - 1) return { ...song, found: false, error: error.message };
            await sleep(2000);
        }
    }
}

async function generate() {
    console.log(`Found ${songs.length} songs to process...`);

    const libraryPath = path.join(__dirname, 'library.json');
    let library = {};
    if (fs.existsSync(libraryPath)) {
        try {
            library = JSON.parse(fs.readFileSync(libraryPath, 'utf-8'));
            console.log(`Loaded Library with ${Object.keys(library).length} cached songs.`);
        } catch (e) {
            console.warn("Could not read library, starting fresh.", e.message);
        }
    }

    const playlist = [];
    let fetchCount = 0;
    let cacheCount = 0;
    let libraryUpdated = false;

    for (let i = 0; i < songs.length; i++) {
        const song = songs[i];

        const key = `${song.artist.toLowerCase()} - ${song.title.toLowerCase()}`;

        if (library[key] && library[key].found && library[key].previewUrl) {
            const entry = { ...library[key], id: song.id };
            playlist.push(entry);
            cacheCount++;
        } else {
            console.log(`[${i + 1}/${songs.length}] Fetching: ${song.artist} - ${song.title}`);
            const result = await searchITunes(song);

            if (result.found) {
                const { id, ...libraryEntry } = result;
                library[key] = libraryEntry;
                libraryUpdated = true;

                playlist.push(result);
                fetchCount++;
                await sleep(3500);
            } else {
                playlist.push(result);
            }
        }
    }
    if (libraryUpdated || fetchCount > 0) { // logic check
        fs.writeFileSync(libraryPath, JSON.stringify(library, null, 2));
        console.log(`Updated Library saved to ${libraryPath}`);
    }

    const validResults = playlist.filter(r => r.found && r.previewUrl);
    console.log(`\nGeneration Complete:`);
    console.log(`- Cached: ${cacheCount}`);
    console.log(`- Fetched: ${fetchCount}`);
    console.log(`- Total Valid: ${validResults.length}/${songs.length}`);

    const outputPath = path.join(__dirname, '../src/content/playlist.json');
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(validResults, null, 2));
    console.log(`Playlist written to ${outputPath}`);
}

generate();
