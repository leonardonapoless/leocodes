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
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.25);
    const [isShuffle, setIsShuffle] = useState(false);
    const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);

    const playlist: Song[] = playlistData as Song[];
    const currentSong = playlist[currentSongIndex];

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
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    // sync react state to audio element
    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.error("Playback failed:", error);
                        setIsPlaying(false);
                    });
                }
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentSongIndex]);

    // autoplay
    useEffect(() => {
        if (shouldAutoPlay && !isPlaying && currentSongIndex === 0 && currentTime === 0) {
            setIsPlaying(true);
        }
    }, [shouldAutoPlay]);

    // controls
    const togglePlay = () => {
        if (!isPlaying && onPlay) {
            onPlay();
        }
        setIsPlaying(!isPlaying);
    };

    const playSong = (index: number) => {
        setCurrentSongIndex(index);
        setIsPlaying(true);
        if (onPlay) onPlay();
    };

    const nextSong = () => {
        if (isShuffle && shuffledIndices.length > 0) {
            const currentShufflePos = shuffledIndices.indexOf(currentSongIndex);
            const nextShufflePos = (currentShufflePos + 1) % shuffledIndices.length;
            setCurrentSongIndex(shuffledIndices[nextShufflePos]);
        } else {
            setCurrentSongIndex((prev) => (prev + 1) % playlist.length);
        }
        setIsPlaying(true);
    };

    const prevSong = () => {
        if (isShuffle && shuffledIndices.length > 0) {
            const currentShufflePos = shuffledIndices.indexOf(currentSongIndex);
            const prevShufflePos = (currentShufflePos - 1 + shuffledIndices.length) % shuffledIndices.length;
            setCurrentSongIndex(shuffledIndices[prevShufflePos]);
        } else {
            setCurrentSongIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
        }
        setIsPlaying(true);
    };

    const toggleShuffle = () => {
        setIsShuffle(!isShuffle);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            setDuration(audioRef.current.duration || 0);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
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
            {/* hidden audio element driven by state */}
            <audio
                ref={audioRef}
                src={currentSong?.previewUrl}
                onTimeUpdate={handleTimeUpdate}
                onEnded={nextSong}
            />

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
