
import appleLogo from '@sakun/system.css/icon/apple.svg';

export const getMenus = (onOpenWindow: (id: string) => void, activeMenu: string | null, onCrash?: () => void) => ({
    apple: {
        label: <img src={appleLogo} alt="Apple" style={{
            height: '22px', width: 'auto', paddingBottom: '2px',
            filter: activeMenu === 'apple' ? 'invert(100%)' : 'none'
        }} />,
        items: [
            { label: 'About This Mac', action: () => onOpenWindow('aboutThisMac') },
            { type: 'separator' },
            { label: 'Test System Error', action: onCrash }
        ]
    },
    file: {
        label: 'File',
        items: [
            { label: 'New Folder', disabled: true },
            { label: 'Open', disabled: true },
            { label: 'Print', disabled: true },
            { label: 'Close', disabled: true }
        ]
    },
    edit: {
        label: 'Edit',
        items: [
            { label: 'Undo', disabled: true },
            { type: 'separator' },
            { label: 'Cut', disabled: true },
            { label: 'Copy', disabled: true },
            { label: 'Paste', disabled: true },
            { label: 'Clear', disabled: true }
        ]
    },
    view: {
        label: 'View',
        items: [
            { label: 'Clean Up', disabled: true },
            { label: 'Arrange By', disabled: true },
            { label: 'View Options', disabled: true }
        ]
    },
    special: {
        label: 'Special',
        items: [
            { label: 'Clean Up Desktop', disabled: true },
            { label: 'Empty Trash', disabled: true },
            { type: 'separator' },
            { label: 'Eject Disk', disabled: true },
            { label: 'Erase Disk...', disabled: true },
            { type: 'separator' },
            { label: 'Restart', disabled: true },
            { label: 'Shut Down', disabled: true }
        ]
    },
    help: {
        label: 'Help',
        items: [
            { label: 'Show Balloons', disabled: true }
        ]
    },
    leocodes: {
        label: 'LeoCodes',
        items: [
            { label: 'My Linkedin', action: () => window.open('https://www.linkedin.com/in/leonardo-napoles/') },
            { label: 'About Me', action: () => onOpenWindow('about') },
            { label: 'Contact Me', action: () => onOpenWindow('contactMe') }
        ]
    }
});
