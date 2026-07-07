import { ChangeEvent } from 'react';
import './MusicPlayer.css';

export interface Song {
    id: string;
    artist: string;
    title: string;
    previewUrl: string;
    artworkUrl100: string;
    collectionName: string;
}

interface MusicPlayerUIProps {
    currentSong: Song | undefined;
    isPlaying: boolean;
    volume: number;
    currentTime: number;
    duration: number;
    isShuffle: boolean;
    isPlaylistOpen: boolean;
    playlist: Song[];
    currentSongIndex: number;
    onTogglePlay: () => void;
    onNext: () => void;
    onPrev: () => void;
    onToggleShuffle: () => void;
    onVolumeChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onSeek: (e: ChangeEvent<HTMLInputElement>) => void;
    onPlaylistToggle: () => void;
    onSongSelect: (index: number) => void;
    formatTime: (time: number) => string;
}

export default function MusicPlayerUI({
    currentSong,
    isPlaying,
    volume,
    currentTime,
    duration,
    isShuffle,
    isPlaylistOpen,
    playlist,
    currentSongIndex,
    onTogglePlay,
    onNext,
    onPrev,
    onToggleShuffle,
    onVolumeChange,
    onSeek,
    onPlaylistToggle,
    onSongSelect,
    formatTime
}: MusicPlayerUIProps) {
    return (
        <div className="music-player-container">
            <div className="player-top-area">
                {currentSong ? (
                    <>
                        <div className="album-art-container">
                            <img
                                src={currentSong.artworkUrl100}
                                alt={`Album art for ${currentSong.title} by ${currentSong.artist}`}
                                className="album-art"
                            />
                        </div>

                        <div className="song-info">
                            <div className="song-title">
                                {currentSong.title}
                            </div>
                            <div className="song-artist">
                                {currentSong.artist}
                            </div>
                            <div className="song-album">
                                {currentSong.collectionName}
                            </div>
                        </div>
                    </>
                ) : (
                    <p className="loading-text">Loading playlist...</p>
                )}
            </div>

            <div className={`control-bar ${isPlaylistOpen ? 'playlist-open' : ''}`}>
                <div className="time-control">
                    <span className="time-text">{formatTime(currentTime)}</span>

                    <div className="slider-container">
                        <div className="slider-track"></div>
                        <input
                            type="range"
                            min="0"
                            max={duration || 30}
                            value={currentTime}
                            onChange={onSeek}
                            className="retro-range-input"
                            aria-label="Progress"
                        />
                    </div>

                    <span className="time-text right">{formatTime(duration)}</span>
                </div>

                <div className="main-controls">
                    <div className="transport-buttons">
                        <button
                            className={`retro-btn retro-btn-large ${isShuffle ? 'pressed' : ''}`}
                            onClick={onToggleShuffle}
                            title="Shuffle"
                        >
                            Shuffle
                        </button>
                        <button
                            className="retro-btn retro-btn-text"
                            onClick={onPrev}
                            title="Previous"
                        >
                            Prev
                        </button>
                        <button
                            className="retro-btn retro-btn-large"
                            onClick={onTogglePlay}
                            title={isPlaying ? "Pause" : "Play"}
                        >
                            {isPlaying ? 'Pause' : 'Play'}
                        </button>
                        <button
                            className="retro-btn retro-btn-text"
                            onClick={onNext}
                            title="Next"
                        >
                            Next
                        </button>
                    </div>

                    <button
                        className="retro-btn playlist-toggle-btn"
                        onClick={onPlaylistToggle}
                        title={isPlaylistOpen ? "Hide Playlist" : "Show Playlist"}
                    >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="2" y="3" width="8" height="1.5" fill="black" />
                            <rect x="2" y="6" width="8" height="1.5" fill="black" />
                            <rect x="2" y="9" width="8" height="1.5" fill="black" />
                        </svg>
                    </button>

                    <div className="volume-control">
                        <span className="volume-label">Vol</span>
                        <div className="volume-slider-container">
                            <div className="slider-track"></div>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={onVolumeChange}
                                className="retro-range-input volume-slider"
                                aria-label="Volume"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {isPlaylistOpen && (
                <div className="playlist-container">
                    <table className="playlist-table">
                        <tbody>
                            {playlist.map((song, index) => {
                                const isSelected = currentSongIndex === index;
                                const rowClass = isSelected ? 'selected' : (index % 2 === 0 ? 'even' : 'odd');

                                return (
                                    <tr
                                        key={index}
                                        onClick={() => onSongSelect(index)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                onSongSelect(index);
                                            }
                                        }}
                                        className={`playlist-row ${rowClass}`}
                                        role="button"
                                        tabIndex={0}
                                    >
                                        <td className="playlist-cell-index">{index + 1}.</td>
                                        <td className="playlist-cell-title">{song.title}</td>
                                        <td className="playlist-cell-artist">{song.artist}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
