import fileIcon from '../assets/fileicon.svg';
import folderIcon from '../assets/folder.svg';
import globeIcon from '../assets/Global.svg';
import leocodesIcon from '../assets/leocodes_logo_bw_big.svg';

export interface IconState {
    id: string;
    label: string;
    x: number;
    y: number;
    windowKey?: string;
    iconSrc: string;
}

export const INITIAL_ICONS: IconState[] = [
    { id: 'about', label: 'About Me', x: 0, y: 220, windowKey: 'about', iconSrc: fileIcon },
    { id: 'linkedin', label: 'Linkedin', x: 0, y: 50, iconSrc: globeIcon },
    { id: 'github', label: 'Github', x: 0, y: 120, iconSrc: leocodesIcon },
    { id: 'projects', label: 'Projects', x: 0, y: 300, windowKey: 'projects', iconSrc: fileIcon },
    { id: 'contactMe', label: 'Contact Me', x: 200, y: 150, windowKey: 'contactMe', iconSrc: fileIcon },
    { id: 'games', label: 'Games', x: 0, y: 380, windowKey: 'games', iconSrc: folderIcon },
];
