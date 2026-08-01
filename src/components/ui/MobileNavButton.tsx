import { useEffect, useState } from 'react';
import { playSound } from '../../utils/soundManager';

interface MobileNavButtonProps {
    targetId: string | null;
}

const MobileNavButton = ({ targetId }: MobileNavButtonProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (targetId) {
            const timer = setTimeout(() => setIsVisible(true), 100);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [targetId]);

    const handleAction = () => {
        if (targetId) {
            const element = document.getElementById(targetId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    if (!targetId) return null;

    return (
        <button
            onClick={handleAction}
            onMouseDown={() => playSound('btnp')}
            onMouseUp={() => playSound('btnr')}
            className="btn"
            style={{
                position: 'fixed',
                bottom: '20px',
                left: '20px',
                zIndex: 10000,
                minWidth: 'auto',
                width: '40px',
                height: '40px',
                padding: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.3s, transform 0.3s',
                pointerEvents: isVisible ? 'auto' : 'none'
            }}
            aria-label="Scroll to window"
        >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M12 19L19 12M12 19L5 12" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
            </svg>
        </button>
    );
};

export default MobileNavButton;
