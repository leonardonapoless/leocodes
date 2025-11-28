import { useState, useEffect } from 'react';
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

import ErrorBoundary from '../ErrorBoundary';
import { WINDOW_Z } from '../../constants/designTokens';
import { INITIAL_WINDOWS, WindowState } from '../../constants/windowConfig';
import { INITIAL_ICONS, IconState } from '../../constants/iconConfig';

const Desktop = () => {
    const [windows, setWindows] = useState<Record<string, WindowState>>(INITIAL_WINDOWS);

    const [icons, setIcons] = useState<IconState[]>(INITIAL_ICONS);


    const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
    const [simulateCrash, setSimulateCrash] = useState(false);

    if (simulateCrash) {
        // simulate a real runtime error (TypeError)
        const crash: any = null;
        crash.toString();
    }

    useEffect(() => {
        setIcons(prev => prev.map(icon => ({
            ...icon,
            x: icon.id === 'contactMe'
                ? window.innerWidth - 200
                : window.innerWidth - 100
        })));
    }, []);

    const openWindow = (key: string) => {
        setWindows(prev => {
            const newWindows = { ...prev };
            Object.keys(newWindows).forEach(k => newWindows[k].isActive = false);
            newWindows[key] = { ...newWindows[key], isOpen: true, isActive: true };
            return newWindows;
        });
    };

    const openVideo = (videoId: string, title?: string, width?: number, height?: number, x?: number, y?: number) => {
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

    const openDoom = () => {
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

    const closeWindow = (key: string) => {
        setWindows(prev => ({
            ...prev,
            [key]: { ...prev[key], isOpen: false }
        }));
    };

    const focusWindow = (key: string) => {
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

    // const handleIconClick = (id: string, e: React.MouseEvent) => {
    //     e.stopPropagation();
    //     setSelectedIconId(id);
    // };

    // const handleBackgroundClick = () => {
    //     setSelectedIconId(null);
    // };

    const handleIconDrag = (id: string, { x, y }: { x: number; y: number }) => {
        setIcons(prev => prev.map(icon =>
            icon.id === id ? { ...icon, x, y } : icon
        ));
    };

    const handleIconDoubleClick = (icon: IconState) => {
        switch (icon.id) {
            case 'linkedin':
                window.open('https://www.linkedin.com/in/leonardo-napoles/', '_blank');
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

    return (
        <div
            onClick={() => setSelectedIconId(null)}
            style={{
                width: '100vw',
                height: '100vh',
                backgroundColor: '#408080',
                // classic mac os tiled pattern
                backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhYWGMYAEYB8RmROaABADeOQ8CXl/xfgAAAABJRU5ErkJggg==")',
                backgroundSize: '4px 4px',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <MenuBar onOpenWindow={openWindow} onCrash={() => setSimulateCrash(true)} />
            <div style={{ paddingTop: '30px', height: 'calc(100% - 30px)', position: 'relative' }}>

                {icons.map(icon => (
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
                    />
                ))}

                <ErrorBoundary key={`about-boundary-${windows.about.isOpen}`}>
                    <Window
                        title="About Me"
                        isOpen={windows.about.isOpen}
                        isActive={windows.about.isActive}
                        onClose={() => closeWindow('about')}
                        onFocus={() => focusWindow('about')}
                        onPositionChange={(pos) => updateWindowPosition('about', pos)}
                        onSizeChange={(size) => updateWindowSize('about', size)}
                        style={{ top: windows.about.y, left: windows.about.x, width: windows.about.width, height: windows.about.height }}
                    >
                        <AboutMe />
                    </Window>
                </ErrorBoundary>

                <ErrorBoundary key={`projects-boundary-${windows.projects.isOpen}`}>
                    <Window
                        title="Projects"
                        isOpen={windows.projects.isOpen}
                        isActive={windows.projects.isActive}
                        onClose={() => closeWindow('projects')}
                        onFocus={() => focusWindow('projects')}
                        onPositionChange={(pos) => updateWindowPosition('projects', pos)}
                        onSizeChange={(size) => updateWindowSize('projects', size)}
                        style={{ top: windows.projects.y, left: windows.projects.x, width: windows.projects.width, height: windows.projects.height }}
                    >
                        <Projects onOpenVideo={openVideo} onOpenBrowser={openBrowser} />
                    </Window>
                </ErrorBoundary>

                <ErrorBoundary key={`aboutThisMac-boundary-${windows.aboutThisMac.isOpen}`}>
                    <Window
                        title="About This Macintosh"
                        isOpen={windows.aboutThisMac.isOpen}
                        isActive={windows.aboutThisMac.isActive}
                        onClose={() => closeWindow('aboutThisMac')}
                        onFocus={() => focusWindow('aboutThisMac')}
                        onPositionChange={(pos) => updateWindowPosition('aboutThisMac', pos)}
                        onSizeChange={(size) => updateWindowSize('aboutThisMac', size)}
                        style={{ top: windows.aboutThisMac.y, left: windows.aboutThisMac.x, width: windows.aboutThisMac.width, height: windows.aboutThisMac.height }}
                    >
                        <AboutThisMac />
                    </Window>
                </ErrorBoundary>

                <ErrorBoundary key={`video-boundary-${windows.video.isOpen}`}>
                    <Window
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
                    >
                        {windows.video.videoId && <VideoPlayer videoId={windows.video.videoId} />}
                    </Window>
                </ErrorBoundary>

                <ErrorBoundary key={`browser-boundary-${windows.browser.isOpen}`}>
                    <Window
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
                    >
                        {windows.browser.url && <Browser url={windows.browser.url} />}
                    </Window>
                </ErrorBoundary>

                <ErrorBoundary key={`contactMe-boundary-${windows.contactMe.isOpen}`}>
                    <Window
                        title="Contact Me"
                        isOpen={windows.contactMe.isOpen}
                        isActive={windows.contactMe.isActive}
                        onClose={() => closeWindow('contactMe')}
                        onFocus={() => focusWindow('contactMe')}
                        onPositionChange={(pos) => updateWindowPosition('contactMe', pos)}
                        onSizeChange={(size) => updateWindowSize('contactMe', size)}
                        style={{ top: windows.contactMe.y, left: windows.contactMe.x, width: windows.contactMe.width, height: windows.contactMe.height }}
                    >
                        <ContactMe />
                    </Window>
                </ErrorBoundary>

                <ErrorBoundary key={`games-boundary-${windows.games.isOpen}`}>
                    <Window
                        title="Games"
                        isOpen={windows.games.isOpen}
                        isActive={windows.games.isActive}
                        onClose={() => closeWindow('games')}
                        onFocus={() => focusWindow('games')}
                        onPositionChange={(pos) => updateWindowPosition('games', pos)}
                        onSizeChange={(size) => updateWindowSize('games', size)}
                        style={{ top: windows.games.y, left: windows.games.x, width: windows.games.width, height: windows.games.height }}
                    >
                        <Games onOpenDoom={openDoom} onOpenManual={openDoomManual} />
                    </Window>
                </ErrorBoundary>

                <ErrorBoundary key={`doom-boundary-${windows.doom.isOpen}`}>
                    <Window
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
                    >
                        <Doom />
                    </Window>
                </ErrorBoundary>

                <ErrorBoundary key={`doomManual-boundary-${windows.doomManual.isOpen}`}>
                    <Window
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
                    >
                        <DoomManual />
                    </Window>
                </ErrorBoundary>



            </div >
        </div >
    );
};

export default Desktop;
