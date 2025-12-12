import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { loadYouTubeApi, YT } from '../../utils/loadYouTubeApi';

interface VideoPlayerProps {
    videoId: string;
    isMobile?: boolean;
}

const VideoPlayer = ({ videoId, isMobile = false }: VideoPlayerProps) => {
    const playerRef = useRef<YT.Player | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(50);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isReady, setIsReady] = useState(false);
    const animationFrameRef = useRef<number | null>(null);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        let isMounted = true;
        let playerInstance: YT.Player | null = null;

        const init = async () => {
            try {
                const yt = await loadYouTubeApi();

                if (!isMounted) return;

                playerInstance = new yt.Player(`youtube-player-${videoId}`, {
                    height: '100%',
                    width: '100%',
                    videoId: videoId,
                    playerVars: {
                        playsinline: 1,
                        controls: isMobile ? 1 : 0,
                        modestbranding: 1,
                        rel: 0,
                        iv_load_policy: 3,
                        fs: isMobile ? 1 : 0,
                        disablekb: 0
                    },
                    events: {
                        onReady: onPlayerReady,
                        onStateChange: onPlayerStateChange
                    }
                });

                playerRef.current = playerInstance;

            } catch (error) {
                console.error("Failed to load YouTube API", error);
            }
        };

        init();

        return () => {
            isMounted = false;
            if (playerInstance) {
                playerInstance.destroy();
                playerRef.current = null;
            }
        };
    }, [videoId, isMobile]);

    useEffect(() => {
        const updateTime = () => {
            if (playerRef.current && isPlaying) {
                const time = playerRef.current.getCurrentTime();
                setCurrentTime(time);
                animationFrameRef.current = requestAnimationFrame(updateTime);
            }
        };

        if (isPlaying) {
            animationFrameRef.current = requestAnimationFrame(updateTime);
        } else {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isPlaying]);

    useEffect(() => {
        return () => {
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
        };
    }, []);

    const onPlayerReady = (event: YT.PlayerEvent) => {
        setIsReady(true);
        setDuration(event.target.getDuration());
        event.target.setVolume(volume);
        // Only auto-play if permitted (some mobile browsers block it, but we can try)
        // event.target.playVideo(); 
    };

    const onPlayerStateChange = (event: YT.OnStateChangeEvent) => {
        setIsPlaying(event.data === 1);
        if (event.data === 1) {
            setDuration(event.target.getDuration());
        }
    };

    const togglePlay = () => {
        if (!isReady || !playerRef.current) return;
        if (isPlaying) {
            playerRef.current.pauseVideo();
        } else {
            playerRef.current.playVideo();
        }
    };

    const handleStop = () => {
        if (!isReady || !playerRef.current) return;
        playerRef.current.stopVideo();
        setIsPlaying(false);
        setCurrentTime(0);
    };

    const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newVolume = Number(e.target.value);
        setVolume(newVolume);
        if (playerRef.current) {
            playerRef.current.setVolume(newVolume);
        }
    };

    const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(e.target.value);
        setCurrentTime(newTime);
        if (playerRef.current) {
            playerRef.current.seekTo(newTime, true);
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: isMobile ? 'auto' : '100%',
                width: '100%',
                background: '#000',
                position: 'relative',
                aspectRatio: isMobile ? '16/9' : 'auto'
            }}
            onMouseEnter={() => {
                if (isMobile) return;
                if (controlsTimeoutRef.current) {
                    clearTimeout(controlsTimeoutRef.current);
                    controlsTimeoutRef.current = null;
                }
                const controls = document.querySelector(`.video-controls-${videoId}`) as HTMLElement;
                if (controls) controls.style.opacity = '1';
            }}
            onMouseLeave={() => {
                if (isMobile) return;
                if (isPlaying) {
                    const controls = document.querySelector(`.video-controls-${videoId}`) as HTMLElement;
                    if (controls) {
                        controlsTimeoutRef.current = setTimeout(() => {
                            controls.style.opacity = '0';
                        }, 1200);
                    }
                }
            }}
        >
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden', width: '100%', pointerEvents: isMobile ? 'auto' : 'inherit' }}>
                <div id={`youtube-player-${videoId}`} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1 }}></div>
                {!isMobile && (
                    <div
                        onClick={togglePlay}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'transparent',
                            cursor: 'pointer',
                            zIndex: 5
                        }}
                    ></div>
                )}
            </div>

            {!isMobile && (
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '40px',
                    backgroundColor: '#f6f5ecff',
                    borderTop: '2px solid #dfdfdf',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 10px',
                    gap: '8px',
                    fontFamily: 'Chicago, sans-serif',
                    fontSize: '12px',
                    zIndex: 10,
                    transition: 'opacity 0.2s ease',
                    opacity: isPlaying ? 0 : 1,
                    flexWrap: 'wrap'
                }}
                    className={`video-controls video-controls-${videoId}`}
                >
                    <button
                        onClick={togglePlay}
                        style={{
                            minWidth: '50px',
                            height: '24px',
                            border: '2px solid',
                            borderColor: '#dfdfdf #404040 #404040 #dfdfdf',
                            backgroundColor: '#c0c0c0',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {isPlaying ? 'Pause' : 'Play'}
                    </button>

                    <button
                        onClick={handleStop}
                        style={{
                            minWidth: '50px',
                            height: '24px',
                            border: '2px solid',
                            borderColor: '#dfdfdf #404040 #404040 #dfdfdf',
                            backgroundColor: '#c0c0c0',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        Stop
                    </button>

                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '5px', minWidth: '150px' }}>
                        <span style={{ minWidth: '35px', fontSize: '11px' }}>{formatTime(currentTime)}</span>
                        <input
                            type="range"
                            min="0"
                            max={duration || 100}
                            step="0.1"
                            value={currentTime}
                            onChange={handleSeek}
                            className="video-seek-slider"
                            style={{
                                flex: 1,
                                height: '12px',
                                WebkitAppearance: 'none',
                                appearance: 'none',
                                background: '#4a4a4a',
                                outline: 'none',
                                border: '1px solid #2a2a2a',
                                borderRadius: '0',
                                cursor: 'pointer'
                            }}
                        />
                        <span style={{ minWidth: '35px', fontSize: '11px' }}>{formatTime(duration)}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', minWidth: '80px' }}>
                        <span style={{ fontSize: '11px' }}>Vol</span>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="video-volume-slider"
                            style={{
                                width: '100%',
                                height: '12px',
                                WebkitAppearance: 'none',
                                appearance: 'none',
                                background: '#4a4a4a',
                                outline: 'none',
                                border: '1px solid #2a2a2a',
                                borderRadius: '0',
                                cursor: 'pointer'
                            }}
                        />
                    </div>
                </div>
            )}

            <style>{`
                .video-seek-slider::-webkit-slider-thumb,
                .video-volume-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 14px;
                    height: 14px;
                    background: #c0c0c0;
                    cursor: pointer;
                    border: 2px solid;
                    border-color: #dfdfdf #404040 #404040 #dfdfdf;
                    border-radius: 0;
                }
                
                .video-seek-slider::-moz-range-thumb,
                .video-volume-slider::-moz-range-thumb {
                    width: 14px;
                    height: 14px;
                    background: #c0c0c0;
                    cursor: pointer;
                    border: 2px solid;
                    border-color: #dfdfdf #404040 #404040 #dfdfdf;
                    border-radius: 0;
                }
                
                @media (max-width: 500px) {
                    .video-controls-${videoId} {
                        height: auto !important;
                        padding: 5px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default VideoPlayer;
