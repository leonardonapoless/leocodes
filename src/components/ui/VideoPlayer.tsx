import { useEffect, useRef, useState } from 'react';

declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}

interface VideoPlayerProps {
    videoId: string;
}

const VideoPlayer = ({ videoId }: VideoPlayerProps) => {
    const playerRef = useRef<any>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(50);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            if (firstScriptTag && firstScriptTag.parentNode) {
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            }
        }

        const initPlayer = () => {
            playerRef.current = new window.YT.Player(`youtube-player-${videoId}`, {
                height: '100%',
                width: '100%',
                videoId: videoId,
                playerVars: {
                    'playsinline': 1,
                    'controls': 0,
                    'modestbranding': 0,
                    'rel': 0,
                    'iv_load_policy': 3,
                    'fs': 0,
                    'disablekb': 0
                },
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        };

        if (window.YT && window.YT.Player) {
            initPlayer();
        } else {
            window.onYouTubeIframeAPIReady = initPlayer;
        }

        return () => {
            if (playerRef.current && playerRef.current.destroy) {
                playerRef.current.destroy();
            }
        };
    }, [videoId]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying) {
            interval = setInterval(() => {
                if (playerRef.current && playerRef.current.getCurrentTime) {
                    setCurrentTime(playerRef.current.getCurrentTime());
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    useEffect(() => {
        return () => {
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
        };
    }, []);

    const onPlayerReady = (event: any) => {
        setIsReady(true);
        setDuration(event.target.getDuration());
        event.target.setVolume(volume);
        event.target.playVideo();
    };

    const onPlayerStateChange = (event: any) => {
        setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
    };

    const togglePlay = () => {
        if (!isReady) return;
        if (isPlaying) {
            playerRef.current.pauseVideo();
        } else {
            playerRef.current.playVideo();
        }
    };

    const handleStop = () => {
        if (!isReady) return;
        playerRef.current.stopVideo();
        setIsPlaying(false);
        setCurrentTime(0);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = Number(e.target.value);
        setVolume(newVolume);
        if (playerRef.current) {
            playerRef.current.setVolume(newVolume);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    return (
        <div
            style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', background: '#000', position: 'relative' }}
            onMouseEnter={() => {
                if (controlsTimeoutRef.current) {
                    clearTimeout(controlsTimeoutRef.current);
                    controlsTimeoutRef.current = null;
                }
                const controls = document.querySelector('.video-controls') as HTMLElement;
                if (controls) controls.style.opacity = '1';
            }}
            onMouseLeave={() => {
                if (isPlaying) {
                    const controls = document.querySelector('.video-controls') as HTMLElement;
                    if (controls) {
                        controlsTimeoutRef.current = setTimeout(() => {
                            controls.style.opacity = '0';
                        }, 1200);
                    }
                }
            }}
        >
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden', width: '100%' }}>
                <div id={`youtube-player-${videoId}`} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}></div>
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
            </div>

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
                className="video-controls"
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
                        max={duration}
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
                    .video-controls {
                        height: auto !important;
                        padding: 5px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default VideoPlayer;
