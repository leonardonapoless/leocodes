export interface WindowState {
    isOpen: boolean;
    isActive: boolean;
    x: number;
    y: number;
    width: number;
    height: number;
    videoId?: string | null;
    url?: string;
    title?: string;
    imageUrl?: string;
    minWidth?: number;
    minHeight?: number;
}

export const INITIAL_WINDOWS: Record<string, WindowState> = {
    about: { isOpen: true, isActive: true, x: 40, y: 100, width: 500, height: 472 },
    projects: { isOpen: true, isActive: false, x: 550, y: 70, width: 650, height: 700 },
    aboutThisMac: { isOpen: false, isActive: false, x: 200, y: 120, width: 575, height: 215 },
    video: { isOpen: false, isActive: false, x: 300, y: 200, width: 640, height: 480, videoId: null, title: 'Video Player' },
    browser: { isOpen: false, isActive: false, x: 50, y: 50, width: 1280, height: 720, url: '', title: 'Web Browser' },
    contactMe: { isOpen: false, isActive: false, x: 320, y: 50, width: 800, height: 620 },
    games: { isOpen: false, isActive: false, x: 750, y: 100, width: 600, height: 500 },
    doom: { isOpen: false, isActive: false, x: 100, y: 50, width: 1280, height: 720 },
    doomManual: { isOpen: false, isActive: false, x: 200, y: 150, width: 900, height: 600 },
    imageViewer: { isOpen: false, isActive: false, x: 150, y: 150, width: 800, height: 600, imageUrl: '', title: 'Image Viewer' },
    snake: { isOpen: false, isActive: false, x: 400, y: 100, width: 420, height: 650, minWidth: 420, minHeight: 650, title: 'Snake' },
    musicPlayer: { isOpen: false, isActive: false, x: 600, y: 150, width: 320, height: 480, title: 'iTunes' }
};
