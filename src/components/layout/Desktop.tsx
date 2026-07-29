import { useState, useEffect, useCallback, useRef } from 'react';
import MenuBar from '../ui/MenuBar';
import Window from '../ui/Window';
import Icon from '../ui/Icon';
import VideoPlayer from '../ui/VideoPlayer';
import Browser from '../ui/Browser';
import AboutMe from '../../content/AboutMe';
import Projects from '../../content/Projects';
import AboutThisMac from '../../content/AboutThisMac';
import ContactMe from '../../content/ContactMe';
import Games from '../../content/Games';
import Doom from '../../content/Doom';
import DoomManual from '../../content/DoomManual';
import { Snake } from '../../content/Snake/Snake';
import MobileNavButton from '../ui/MobileNavButton';
import MusicPlayer from '../../components/music-player/MusicPlayer';

import ErrorBoundary from '../ErrorBoundary';
import { WINDOW_Z } from '../../constants/designTokens';
import { INITIAL_WINDOWS, WindowState } from '../../constants/windowConfig';
import { INITIAL_ICONS, IconState } from '../../constants/iconConfig';
import { playSound } from '../../utils/soundManager';

interface DesktopProps {
    isBooted?: boolean;
}

const Desktop = ({ isBooted = true }: DesktopProps) => {
    const [windows, setWindows] = useState<Record<string, WindowState>>(INITIAL_WINDOWS);

    const [icons, setIcons] = useState<IconState[]>(INITIAL_ICONS);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    const [shouldAutoPlayMusic, setShouldAutoPlayMusic] = useState(false);
    const [activeMedia, setActiveMedia] = useState<'none' | 'video' | 'music'>('none');

    const handleVideoPlay = useCallback(() => {
        setActiveMedia('video');
    }, []);

    const handleMusicPlay = useCallback(() => {
        setActiveMedia('music');
    }, []);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (isBooted) {
            timer = setTimeout(() => {
                setShouldAutoPlayMusic(true);
            }, 1800);
        }
        return () => clearTimeout(timer);
    }, [isBooted]);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const mobile = width <= 768;
            setIsMobile(mobile);

            if (!mobile) {
                setIcons(INITIAL_ICONS.map(icon => {
                    let xOffset = 90;
                    if (icon.id === 'contactMe') {
                        xOffset = 190;
                    }

                    return {
                        ...icon,
                        x: width - xOffset
                    };
                }));

                setWindows(prev => {
                    const playerWidth = 320;
                    const playerHeight = 215;

                    return {
                        ...prev,
                        musicPlayer: {
                            ...prev.musicPlayer,
                            x: width - playerWidth - 60,
                            y: height - playerHeight - 50
                        }
                    };
                });
            } else {
                setIcons(INITIAL_ICONS);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        setWindows(prev => {
            return {
                ...prev,
                musicPlayer: {
                    ...prev.musicPlayer,
                    isOpen: true,
                    width: 320,
                    height: 215
                }
            };
        });

        return () => window.removeEventListener('resize', handleResize);
    }, []);


    const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
    const [simulateCrash, setSimulateCrash] = useState(false);
    const musicPlayerOriginalY = useRef<number | null>(null);

    if (simulateCrash) {
        const crash: any = null;
        crash.toString();
    }


    const openWindow = (key: string) => {
        if (windows[key]?.isOpen && !windows[key]?.isActive) {
            playSound('wact');
        }
        setWindows(prev => {
            const newWindows = { ...prev };
            Object.keys(newWindows).forEach(k => newWindows[k].isActive = false);
            newWindows[key] = { ...newWindows[key], isOpen: true, isActive: true };
            return newWindows;
        });
    };

    const openVideo = (videoId: string, title?: string, width?: number, height?: number, x?: number, y?: number) => {
        if (windows.video?.isOpen && !windows.video?.isActive) {
            playSound('wact');
        }
        setWindows(prev => {
            const newWindows = { ...prev };
            Object.keys(newWindows).forEach(k => newWindows[k].isActive = false);
            newWindows.video = {
                ...newWindows.video,
                isOpen: true,
                isActive: true,
                videoId,
                title: title || 'Video Player',
                width: width || newWindows.video.width,
                height: height || newWindows.video.height,
                x: x || newWindows.video.x,
                y: y || newWindows.video.y
            };
            return newWindows;
        });
    };

    const openBrowser = (url: string, title?: string) => {
        if (windows.browser?.isOpen && !windows.browser?.isActive) {
            playSound('wact');
        }
        setWindows(prev => {
            const newWindows = { ...prev };
            Object.keys(newWindows).forEach(k => newWindows[k].isActive = false);
            newWindows.browser = {
                ...newWindows.browser,
                isOpen: true,
                isActive: true,
                url,
                title: title || 'Web Browser'
            };
            return newWindows;
        });
    };

    const openImage = (imageUrl: string, title?: string, width?: number, height?: number, x?: number, y?: number) => {
        if (windows.imageViewer?.isOpen && !windows.imageViewer?.isActive) {
            playSound('wact');
        }
        setWindows(prev => {
            const newWindows = { ...prev };
            Object.keys(newWindows).forEach(k => newWindows[k].isActive = false);
            newWindows.imageViewer = {
                ...newWindows.imageViewer,
                isOpen: true,
                isActive: true,
                imageUrl,
                title: title || 'Image Viewer',
                width: width || 800,
                height: height || 600,
                x: x ?? newWindows.imageViewer.x,
                y: y ?? newWindows.imageViewer.y
            };
            return newWindows;
        });
    };

    const openDoom = () => {
        if (windows.doom?.isOpen && !windows.doom?.isActive) {
            playSound('wact');
        }
        setWindows(prev => {
            const newWindows = { ...prev };
            Object.keys(newWindows).forEach(k => newWindows[k].isActive = false);
            newWindows.doom = {
                ...newWindows.doom,
                isOpen: true,
                isActive: true
            };
            return newWindows;
        });
    };

    const openDoomManual = () => {
        if (windows.doomManual?.isOpen && !windows.doomManual?.isActive) {
            playSound('wact');
        }
        setWindows(prev => {
            const newWindows = { ...prev };
            Object.keys(newWindows).forEach(k => newWindows[k].isActive = false);
            newWindows.doomManual = {
                ...newWindows.doomManual,
                isOpen: true,
                isActive: true
            };
            return newWindows;
        });
    };

    const openSnake = () => {
        if (windows.snake?.isOpen && !windows.snake?.isActive) {
            playSound('wact');
        }
        setWindows(prev => {
            const newWindows = { ...prev };
            Object.keys(newWindows).forEach(k => newWindows[k].isActive = false);
            newWindows.snake = {
                ...newWindows.snake,
                isOpen: true,
                isActive: true
            };
            return newWindows;
        });
    };
    const closeWindow = (key: string) => {
        setWindows(prev => ({
            ...prev,
            [key]: { ...prev[key], isOpen: false }
        }));
    };

    const focusWindow = (key: string) => {
        if (windows[key]?.isOpen && !windows[key]?.isActive) {
            playSound('wact');
        }
        setWindows(prev => {
            const newWindows = { ...prev };
            Object.keys(newWindows).forEach(k => newWindows[k].isActive = false);
            newWindows[key].isActive = true;
            return newWindows;
        });
    };

    const updateWindowPosition = (key: string, { x, y }: { x: number; y: number }) => {
        setWindows(prev => ({
            ...prev,
            [key]: { ...prev[key], x, y }
        }));
    };

    const updateWindowSize = (key: string, { width, height }: { width: number; height: number }) => {
        setWindows(prev => ({
            ...prev,
            [key]: { ...prev[key], width, height }
        }));
    };


    const handleIconDrag = (id: string, { x, y }: { x: number; y: number }) => {
        setIcons(prev => prev.map(icon =>
            icon.id === id ? { ...icon, x, y } : icon
        ));
    };

    const handleIconDoubleClick = (icon: IconState) => {
        switch (icon.id) {
            case 'linkedin':
                window.open('https://www.linkedin.com/in/leonardonapoles/', '_blank');
                break;

            case 'github':
                window.open('https://github.com/leonardonapoless', '_blank');
                break;

            default:
                if (icon.windowKey) {
                    openWindow(icon.windowKey);
                }
                break;
        }
    };

    const handlePlaylistToggle = (isOpen: boolean) => {
        setWindows(prev => {
            const currentWin = prev.musicPlayer;
            const targetHeight = isOpen ? 500 : 215;
            let newY = currentWin.y;

            if (isOpen) {
                musicPlayerOriginalY.current = currentWin.y;

                if (newY + targetHeight > window.innerHeight) {
                    newY = Math.max(0, window.innerHeight - targetHeight - 40);
                }
            } else {
                if (musicPlayerOriginalY.current !== null) {
                    newY = musicPlayerOriginalY.current;
                    musicPlayerOriginalY.current = null;
                }
            }

            return {
                ...prev,
                musicPlayer: {
                    ...currentWin,
                    height: targetHeight,
                    y: newY
                }
            };
        });
    };

    return (
        <div
            className="desktop-container"
            onClick={() => setSelectedIconId(null)}
            style={{
                width: '100vw',
                height: isMobile ? 'auto' : '100dvh',
                minHeight: '100dvh',
                backgroundColor: '#408080',
                backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhYWGMYAEYB8RmROaABADeOQ8CXl/xfgAAAABJRU5ErkJggg==")',
                backgroundSize: '4px 4px',
                backgroundAttachment: 'fixed',
                position: 'relative',
                overflow: 'hidden',
                WebkitOverflowScrolling: 'touch',
                paddingBottom: isMobile ? 'calc(100px + env(safe-area-inset-bottom))' : '0'
            }}
        >
            <MenuBar onOpenWindow={openWindow} onCrash={() => setSimulateCrash(true)} />
            <div className={isMobile ? "mobile-layout" : ""} style={{
                paddingTop: '30px',
                height: isMobile ? 'auto' : 'calc(100dvh - 30px)',
                position: 'relative',
                minHeight: 'calc(100dvh - 30px)',
                paddingBottom: isMobile ? 'env(safe-area-inset-bottom)' : '0'
            }}>

                {isMobile && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '15px',
                        padding: '20px 10px',
                        width: '100%',
                        boxSizing: 'border-box',
                        justifyItems: 'center'
                    }}>
                        {icons.map(icon => (
                            <div key={icon.id} style={{ position: 'relative', width: 'auto', height: 'auto' }}>
                                <Icon
                                    {...icon}
                                    x={0} y={0}
                                    style={{ position: 'relative', top: 'auto', left: 'auto', transform: 'none', margin: 0 }}
                                    isSelected={selectedIconId === icon.id}
                                    onSelect={(e) => {
                                        e.stopPropagation();
                                        setSelectedIconId(icon.id);
                                        handleIconDoubleClick(icon);
                                    }}
                                    onDoubleClick={() => handleIconDoubleClick(icon)}
                                    onDrag={() => { }}
                                    size={42}
                                    isWindowOpen={Boolean(icon.windowKey && windows[icon.windowKey]?.isOpen)}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {!isMobile && icons.map(icon => (
                    <Icon
                        key={icon.id}
                        {...icon}
                        isSelected={selectedIconId === icon.id}
                        onSelect={(e) => {
                            e.stopPropagation();
                            setSelectedIconId(icon.id);
                        }}
                        onDoubleClick={() => handleIconDoubleClick(icon)}
                        onDrag={(pos) => handleIconDrag(icon.id, pos)}
                        isWindowOpen={Boolean(icon.windowKey && windows[icon.windowKey]?.isOpen)}
                    />
                ))}

                <ErrorBoundary key={`about-boundary-${windows.about.isOpen}`}>
                    <Window
                        id="window-about"
                        title="About Me"
                        isOpen={windows.about.isOpen}
                        isActive={windows.about.isActive}
                        onClose={() => closeWindow('about')}
                        onFocus={() => focusWindow('about')}
                        onPositionChange={(pos) => updateWindowPosition('about', pos)}
                        onSizeChange={(size) => updateWindowSize('about', size)}
                        style={{ top: windows.about.y, left: windows.about.x, width: windows.about.width, height: windows.about.height }}
                        isMobile={isMobile}
                    >
                        <AboutMe />
                    </Window>
                </ErrorBoundary>

                <ErrorBoundary key={`projects-boundary-${windows.projects.isOpen}`}>
                    <Window
                        id="window-projects"
                        title="Projects"
                        isOpen={windows.projects.isOpen}
                        isActive={windows.projects.isActive}
                        onClose={() => closeWindow('projects')}
                        onFocus={() => focusWindow('projects')}
                        onPositionChange={(pos) => updateWindowPosition('projects', pos)}
                        onSizeChange={(size) => updateWindowSize('projects', size)}
                        style={{ top: windows.projects.y, left: windows.projects.x, width: windows.projects.width, height: windows.projects.height }}
                        isMobile={isMobile}
                    >
                        <Projects onOpenVideo={openVideo} onOpenBrowser={openBrowser} onOpenImage={openImage} />
                    </Window>
                </ErrorBoundary>

                <ErrorBoundary key={`aboutThisMac-boundary-${windows.aboutThisMac.isOpen}`}>
                    <Window
                        id="window-aboutThisMac"
                        title="About This Macintosh"
                        isOpen={windows.aboutThisMac.isOpen}
                        isActive={windows.aboutThisMac.isActive}
                        onClose={() => closeWindow('aboutThisMac')}
                        onFocus={() => focusWindow('aboutThisMac')}
                        onPositionChange={(pos) => updateWindowPosition('aboutThisMac', pos)}
                        onSizeChange={(size) => updateWindowSize('aboutThisMac', size)}
                        style={{ top: windows.aboutThisMac.y, left: windows.aboutThisMac.x, width: windows.aboutThisMac.width, height: windows.aboutThisMac.height }}
                        isMobile={isMobile}
                    >
                        <AboutThisMac />
                    </Window>
                </ErrorBoundary>

                <ErrorBoundary key={`video-boundary-${windows.video.isOpen}`}>
                    <Window
                        id="window-video"
                        title={windows.video.title || 'Video Player'}
                        isOpen={windows.video.isOpen}
                        isActive={windows.video.isActive}
                        onClose={() => closeWindow('video')}
                        onFocus={() => focusWindow('video')}
                        onPositionChange={(pos) => updateWindowPosition('video', pos)}
                        onSizeChange={(size) => updateWindowSize('video', size)}
                        noPadding={true}
                        style={{
                            top: windows.video.y,
                            left: windows.video.x,
                            width: windows.video.width,
                            height: windows.video.height,
                            zIndex: windows.video.isActive ? WINDOW_Z.media : 15
                        }}
                        isMobile={isMobile}
                    >
                        {windows.video.videoId && <VideoPlayer
                            key={`${windows.video.videoId}-${isMobile}`}
                            videoId={windows.video.videoId}
                            isMobile={isMobile}
                            onPlay={handleVideoPlay}
                            shouldPause={activeMedia === 'music'}
                        />}
                    </Window>
                </ErrorBoundary>

                <ErrorBoundary key={`browser-boundary-${windows.browser.isOpen}`}>
                    <Window
                        id="window-browser"
                        title={windows.browser.title || 'Web Browser'}
                        isOpen={windows.browser.isOpen}
                        isActive={windows.browser.isActive}
                        onClose={() => closeWindow('browser')}
                        onFocus={() => focusWindow('browser')}
                        onPositionChange={(pos) => updateWindowPosition('browser', pos)}
                        onSizeChange={(size) => updateWindowSize('browser', size)}
                        noPadding={true}
                        style={{
                            top: windows.browser.y,
                            left: windows.browser.x,
                            width: windows.browser.width,
                            height: windows.browser.height,
                            zIndex: windows.browser.isActive ? WINDOW_Z.media : 15
                        }}
                        isMobile={isMobile}
                    >
                        {windows.browser.url && <Browser url={windows.browser.url} />}
                    </Window>
                </ErrorBoundary>

                <ErrorBoundary key={`imageViewer-boundary-${windows.imageViewer.isOpen}`}>
                    <Window
                        id="window-imageViewer"
                        title={windows.imageViewer.title || 'Image Viewer'}
                        isOpen={windows.imageViewer.isOpen}
                        isActive={windows.imageViewer.isActive}
                        onClose={() => closeWindow('imageViewer')}
                        onFocus={() => focusWindow('imageViewer')}
                        onPositionChange={(pos) => updateWindowPosition('imageViewer', pos)}
                        onSizeChange={(size) => updateWindowSize('imageViewer', size)}
                        noPadding
                        style={{
                            top: windows.imageViewer.y,
                            left: windows.imageViewer.x,
                            width: windows.imageViewer.width,
                            height: windows.imageViewer.height,
                            zIndex: windows.imageViewer.isActive ? WINDOW_Z.media : 15
                        }}
                        isMobile={isMobile}
                    >
                        {windows.imageViewer.imageUrl && (
                            <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#000', overflow: 'hidden' }}>
                                <img
                                    src={windows.imageViewer.imageUrl}
                                    alt={windows.imageViewer.title}
                                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }}
                                />
                            </div>
                        )}
                    </Window>
                </ErrorBoundary>

                <ErrorBoundary key={`contactMe-boundary-${windows.contactMe.isOpen}`}>
                    <Window
                        id="window-contactMe"
                        title="Contact Me"
                        isOpen={windows.contactMe.isOpen}
                        isActive={windows.contactMe.isActive}
                        onClose={() => closeWindow('contactMe')}
                        onFocus={() => focusWindow('contactMe')}
                        onPositionChange={(pos) => updateWindowPosition('contactMe', pos)}
                        onSizeChange={(size) => updateWindowSize('contactMe', size)}
                        style={{ top: windows.contactMe.y, left: windows.contactMe.x, width: windows.contactMe.width, height: windows.contactMe.height }}
                        isMobile={isMobile}
                    >
                        <ContactMe />
                    </Window>
                </ErrorBoundary>

                <ErrorBoundary key={`games-boundary-${windows.games.isOpen}`}>
                    <Window
                        id="window-games"
                        title="Games"
                        isOpen={windows.games.isOpen}
                        isActive={windows.games.isActive}
                        onClose={() => closeWindow('games')}
                        onFocus={() => focusWindow('games')}
                        onPositionChange={(pos) => updateWindowPosition('games', pos)}
                        onSizeChange={(size) => updateWindowSize('games', size)}
                        style={{ top: windows.games.y, left: windows.games.x, width: windows.games.width, height: windows.games.height }}
                        isMobile={isMobile}
                    >
                        <Games onOpenDoom={openDoom} onOpenManual={openDoomManual} onOpenSnake={openSnake} isMobile={isMobile} />
                    </Window>
                </ErrorBoundary>

                <ErrorBoundary key={`doom-boundary-${windows.doom.isOpen}`}>
                    <Window
                        id="window-doom"
                        title="Doom"
                        isOpen={windows.doom.isOpen}
                        isActive={windows.doom.isActive}
                        onClose={() => closeWindow('doom')}
                        onFocus={() => focusWindow('doom')}
                        onPositionChange={(pos) => updateWindowPosition('doom', pos)}
                        onSizeChange={(size) => updateWindowSize('doom', size)}
                        noPadding={true}
                        style={{
                            top: windows.doom.y,
                            left: windows.doom.x,
                            width: windows.doom.width,
                            height: windows.doom.height,
                            zIndex: windows.doom.isActive ? WINDOW_Z.media : 15
                        }}
                        isMobile={isMobile}
                    >
                        <Doom />
                    </Window>
                </ErrorBoundary>

                <ErrorBoundary key={`doomManual-boundary-${windows.doomManual.isOpen}`}>
                    <Window
                        id="window-doomManual"
                        title="Doom Read Me"
                        isOpen={windows.doomManual.isOpen}
                        isActive={windows.doomManual.isActive}
                        onClose={() => closeWindow('doomManual')}
                        onFocus={() => focusWindow('doomManual')}
                        onPositionChange={(pos) => updateWindowPosition('doomManual', pos)}
                        onSizeChange={(size) => updateWindowSize('doomManual', size)}
                        style={{
                            top: windows.doomManual.y,
                            left: windows.doomManual.x,
                            width: windows.doomManual.width,
                            height: windows.doomManual.height,
                            zIndex: windows.doomManual.isActive ? WINDOW_Z.media : 15
                        }}
                        isMobile={isMobile}
                    >
                        <DoomManual />
                    </Window>
                </ErrorBoundary>

                <ErrorBoundary key={`snake-boundary-${windows.snake.isOpen}`}>
                    <Window
                        id="window-snake"
                        title="Snake"
                        isOpen={windows.snake.isOpen}
                        isActive={windows.snake.isActive}
                        onClose={() => closeWindow('snake')}
                        onFocus={() => focusWindow('snake')}
                        onPositionChange={(pos) => updateWindowPosition('snake', pos)}
                        onSizeChange={(size) => updateWindowSize('snake', size)}
                        noPadding={true}
                        minWidth={windows.snake.minWidth}
                        minHeight={windows.snake.minHeight}
                        style={{
                            top: windows.snake.y,
                            left: windows.snake.x,
                            width: windows.snake.width,
                            height: windows.snake.height,
                            zIndex: windows.snake.isActive ? WINDOW_Z.media : 15
                        }}
                        isMobile={isMobile}
                    >
                        <Snake />
                    </Window>

                </ErrorBoundary>

                <ErrorBoundary key={`musicPlayer-boundary-${windows.musicPlayer?.isOpen}`}>
                    <Window
                        id="window-musicPlayer"
                        title={windows.musicPlayer?.title || "iTunes"}
                        isOpen={windows.musicPlayer?.isOpen}
                        isActive={windows.musicPlayer?.isActive}
                        onClose={() => closeWindow('musicPlayer')}
                        onFocus={() => focusWindow('musicPlayer')}
                        onPositionChange={(pos) => updateWindowPosition('musicPlayer', pos)}
                        onSizeChange={(size) => updateWindowSize('musicPlayer', size)}
                        noPadding={true}
                        style={{
                            top: windows.musicPlayer?.y,
                            left: windows.musicPlayer?.x,
                            width: windows.musicPlayer?.width,
                            height: windows.musicPlayer?.height,
                            zIndex: windows.musicPlayer?.isActive ? WINDOW_Z.media : 15
                        }}
                        isMobile={isMobile}
                    >
                        <MusicPlayer
                            isPlaylistOpen={windows.musicPlayer?.height > 300}
                            onPlaylistToggle={handlePlaylistToggle}
                            shouldAutoPlay={shouldAutoPlayMusic}
                            shouldPause={activeMedia === 'video'}
                            onPlay={handleMusicPlay}
                        />
                    </Window>
                </ErrorBoundary>

                {isMobile && (() => {
                    const activeWindowEntry = Object.entries(windows).find(([key, w]) => w.isOpen && w.isActive && key !== 'about' && key !== 'projects');
                    const targetId = activeWindowEntry ? `window-${activeWindowEntry[0]}` : null;
                    return <MobileNavButton targetId={targetId} />;
                })()}
            </div>
        </div >
    );
};

export default Desktop;
