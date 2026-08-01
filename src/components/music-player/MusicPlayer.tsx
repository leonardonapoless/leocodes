import React, { useRef, useState, useEffect, useCallback } from 'react';
import playlistData from '../../content/playlist.json';
import MusicPlayerUI, { Song } from './MusicPlayerUI';

interface MusicPlayerProps {
    onPlaylistToggle?: (isOpen: boolean) => void;
    isPlaylistOpen?: boolean;
    shouldAutoPlay?: boolean;
    shouldPause?: boolean;
    onPlay?: () => void;
}

function balancedShuffle(playlist: Song[], indices: number[]): number[] {
    let tallies: Record<string, number> = {};
    let currentPos: Record<string, number> = {};

    for (let i = 0; i < indices.length; i++) {
        let indexVal = indices[i];
        let band = playlist[indexVal]?.artist || 'idk';
        tallies[band] = (tallies[band] || 0) + 1;
        currentPos[band] = 0;
    }

    let tmp = [];
    for (let i = 0; i < indices.length; i++) {
        let indexVal = indices[i];
        let band = playlist[indexVal]?.artist || 'idk';
        let tot = tallies[band];
        let curr = currentPos[band];
        currentPos[band]++;
        
        tmp.push({ indexVal: indexVal, sc: (curr + Math.random()) / tot });
    }

    tmp.sort((a, b) => a.sc - b.sc);
    
    let res = [];
    for(let k=0; k<tmp.length; k++) {
        res.push(tmp[k].indexVal);
    }
    return res;
}

export default function MusicPlayer({ onPlaylistToggle, isPlaylistOpen = false, shouldAutoPlay = false, shouldPause = false, onPlay }: MusicPlayerProps) {
    const audioA = useRef<HTMLAudioElement>(null);
    const audioB = useRef<HTMLAudioElement>(null);
    const activeRef = useRef<'A' | 'B'>('A');
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.25);
    const [isShuffle, setIsShuffle] = useState(false);
    const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);
    const isMounted = useRef(true);
    const pausedByExternal = useRef(false);

    const playlist: Song[] = playlistData as Song[];
    const currentSong = playlist[currentSongIndex];

    const getActive = () => activeRef.current === 'A' ? audioA.current : audioB.current;
    const getNext = () => activeRef.current === 'A' ? audioB.current : audioA.current;

    const getNextIndex = (from: number) => {
        if (isShuffle && shuffledIndices.length > 0) {
            const pos = shuffledIndices.indexOf(from);
            return shuffledIndices[(pos + 1) % shuffledIndices.length];
        }
        return (from + 1) % playlist.length;
    };

    const getPrevIndex = (from: number) => {
        if (isShuffle && shuffledIndices.length > 0) {
            const pos = shuffledIndices.indexOf(from);
            return shuffledIndices[(pos - 1 + shuffledIndices.length) % shuffledIndices.length];
        }
        return (from - 1 + playlist.length) % playlist.length;
    };

    // load song into the audio element
    const loadInto = (el: HTMLAudioElement | null, index: number) => {
        if (!el) return;
        const url = playlist[index]?.previewUrl;
        if (url && !el.src.endsWith(url)) {
            el.src = url;
            el.load();
        }
    };

    // preload next track into the inactive element
    const preloadNext = (fromIndex: number) => {
        loadInto(getNext(), getNextIndex(fromIndex));
    };

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        if (isShuffle && isMounted.current) {
            const indices = Array.from({ length: playlist.length }, (_, i) => i);
            const shuffled = balancedShuffle(playlist, indices);
            const currentPos = shuffled.indexOf(currentSongIndex);
            if (currentPos > 0) {
                [shuffled[0], shuffled[currentPos]] = [shuffled[currentPos], shuffled[0]];
            }
            setShuffledIndices(shuffled);
        }
    }, [isShuffle, playlist.length]);

    useEffect(() => {
        if (isMounted.current) {
            preloadNext(currentSongIndex);
        }
    }, [isShuffle, shuffledIndices]);

    // handle external pause
    useEffect(() => {
        if (shouldPause) {
            if (isPlaying && isMounted.current) {
                pausedByExternal.current = true;
                setIsPlaying(false);
            }
        } else if (pausedByExternal.current && isMounted.current) {
            pausedByExternal.current = false;
            setIsPlaying(true);
        }
    }, [shouldPause, isPlaying]);

    // sync volume
    useEffect(() => {
        if (audioA.current) audioA.current.volume = volume;
        if (audioB.current) audioB.current.volume = volume;
    }, [volume]);

    // load initial song and preload next
    useEffect(() => {
        const active = getActive();
        if (active && !active.src) {
            loadInto(active, 0);
        }
        preloadNext(currentSongIndex);
    }, []);

    // sync play/pause to active element
    useEffect(() => {
        const active = getActive();
        const inactive = getNext();
        
        // Ensure inactive is never playing
        if (inactive) {
            inactive.oncanplay = null;
            inactive.pause();
        }

        if (!active) return;
        if (isPlaying) {
            const p = active.play();
            if (p) p.catch((e) => {
                console.error("Playback failed:", e);
                if (isMounted.current) {
                    setIsPlaying(false);
                }
            });
        } else {
            active.pause();
        }
    }, [isPlaying, currentSongIndex]);

    // autoplay
    useEffect(() => {
        if (shouldAutoPlay && !isPlaying && currentSongIndex === 0 && currentTime === 0 && isMounted.current) {
            setIsPlaying(true);
        }
    }, [shouldAutoPlay]);

    // when song ends, swap to the preloaded element
    const handleEnded = () => {
        const active = getActive();
        if (active) {
            active.oncanplay = null;
            active.pause();
            active.currentTime = 0;
        }

        activeRef.current = activeRef.current === 'A' ? 'B' : 'A';
        const nextIndex = getNextIndex(currentSongIndex);
        if (isMounted.current) {
            setCurrentSongIndex(nextIndex);
            setIsPlaying(true);
        }
        preloadNext(nextIndex);
    };

    // controls
    const togglePlay = () => {
        if (!isPlaying && onPlay) {
            onPlay();
        }
        if (isMounted.current) {
            setIsPlaying(!isPlaying);
        }
    };

    const playSong = useCallback((index: number) => {
        const active = getActive();
        if (active) active.oncanplay = null;
        loadInto(active, index);
        if (isMounted.current) {
            setCurrentSongIndex(index);
            setIsPlaying(true);
        }
        preloadNext(index);
        if (onPlay) onPlay();
    }, [onPlay]);

    const nextSong = () => {
        handleEnded();
    };

    const prevSong = () => {
        const prevIdx = getPrevIndex(currentSongIndex);
        const active = getActive();
        if (active) active.oncanplay = null;
        loadInto(active, prevIdx);
        if (isMounted.current) {
            setCurrentSongIndex(prevIdx);
            setIsPlaying(true);
        }
        preloadNext(prevIdx);
    };

    const toggleShuffle = () => {
        if (isMounted.current) {
            setIsShuffle(!isShuffle);
        }
    };

    const handleTimeUpdate = () => {
        const active = getActive();
        if (active && isMounted.current) {
            setCurrentTime(active.currentTime);
            setDuration(active.duration || 0);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        const active = getActive();
        if (active) {
            active.currentTime = time;
            if (isMounted.current) {
                setCurrentTime(time);
            }
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isMounted.current) {
            setVolume(parseFloat(e.target.value));
        }
    };

    const handlePlaylistToggle = () => {
        if (onPlaylistToggle) onPlaylistToggle(!isPlaylistOpen);
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <>
            <audio ref={audioA} onTimeUpdate={handleTimeUpdate} onEnded={handleEnded} preload="auto" />
            <audio ref={audioB} onTimeUpdate={handleTimeUpdate} onEnded={handleEnded} preload="auto" />

            <MusicPlayerUI
                currentSong={currentSong}
                isPlaying={isPlaying}
                volume={volume}
                currentTime={currentTime}
                duration={duration}
                isShuffle={isShuffle}
                isPlaylistOpen={isPlaylistOpen}
                playlist={playlist}
                currentSongIndex={currentSongIndex}
                onTogglePlay={togglePlay}
                onNext={nextSong}
                onPrev={prevSong}
                onToggleShuffle={toggleShuffle}
                onVolumeChange={handleVolumeChange}
                onSeek={handleSeek}
                onPlaylistToggle={handlePlaylistToggle}
                onSongSelect={playSong}
                formatTime={formatTime}
            />
        </>
    );
}
