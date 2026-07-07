import React, { useRef, useState, useEffect } from 'react';
import playlistData from '../../content/playlist.json';
import MusicPlayerUI, { Song } from './MusicPlayerUI';

interface MusicPlayerProps {
    onPlaylistToggle?: (isOpen: boolean) => void;
    isPlaylistOpen?: boolean;
    shouldAutoPlay?: boolean;
    shouldPause?: boolean;
    onPlay?: () => void;
}

function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
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
        if (url) {
            el.src = url;
            el.load();
        }
    };

    // preload next track into the inactive element
    const preloadNext = (fromIndex: number) => {
        loadInto(getNext(), getNextIndex(fromIndex));
    };

    useEffect(() => {
        if (isShuffle) {
            const indices = Array.from({ length: playlist.length }, (_, i) => i);
            setShuffledIndices(shuffleArray(indices));
        }
    }, [isShuffle, playlist.length]);

    // handle external pause
    useEffect(() => {
        if (shouldPause && isPlaying) {
            setIsPlaying(false);
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
                setIsPlaying(false);
            });
        } else {
            active.pause();
        }
    }, [isPlaying, currentSongIndex]);

    // autoplay
    useEffect(() => {
        if (shouldAutoPlay && !isPlaying && currentSongIndex === 0 && currentTime === 0) {
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

        const next = getNext();
        if (next) {
            next.volume = volume;
            next.play().catch(() => {});
        }
        // flip active
        activeRef.current = activeRef.current === 'A' ? 'B' : 'A';
        const nextIndex = getNextIndex(currentSongIndex);
        setCurrentSongIndex(nextIndex);
        setIsPlaying(true);
        // preload the one after that into the now-inactive element
        preloadNext(nextIndex);
    };

    // controls
    const togglePlay = () => {
        if (!isPlaying && onPlay) {
            onPlay();
        }
        setIsPlaying(!isPlaying);
    };

    const playSong = (index: number) => {
        const active = getActive();
        if (active) active.oncanplay = null;
        loadInto(active, index);
        setCurrentSongIndex(index);
        setIsPlaying(true);
        preloadNext(index);
        if (onPlay) onPlay();
    };

    const nextSong = () => {
        handleEnded();
    };

    const prevSong = () => {
        const prevIdx = getPrevIndex(currentSongIndex);
        const active = getActive();
        if (active) active.oncanplay = null;
        loadInto(active, prevIdx);
        setCurrentSongIndex(prevIdx);
        setIsPlaying(true);
        preloadNext(prevIdx);
    };

    const toggleShuffle = () => {
        setIsShuffle(!isShuffle);
    };

    const handleTimeUpdate = () => {
        const active = getActive();
        if (active) {
            setCurrentTime(active.currentTime);
            setDuration(active.duration || 0);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        const active = getActive();
        if (active) {
            active.currentTime = time;
            setCurrentTime(time);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(parseFloat(e.target.value));
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
