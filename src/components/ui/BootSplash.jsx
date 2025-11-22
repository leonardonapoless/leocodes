import { useEffect, useState, useRef } from 'react';
import logo from '../../assets/leocodes_logo_bw_big.svg';
import bootChime from '../../assets/audio/StartupPowerMacPCI.wav';
import { playSound } from '../../utils/soundManager';

const BootSplash = ({ onComplete }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [hasStarted, setHasStarted] = useState(false);
    const [showContent, setShowContent] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        // preload audio on mount
        const audio = new Audio(bootChime);
        audio.volume = 0.6; // reduce volume to 60%
        audio.load();
        audioRef.current = audio;

        // simulate early mac boot delay
        const timer = setTimeout(() => {
            setShowContent(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const startBoot = () => {
        setHasStarted(true);

        const audio = audioRef.current;
        if (!audio) return;

        // play the preloaded audio
        audio.play();

        setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 500);
        }, 2000); // adjusted to match the chime decay
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: '#808080',
                zIndex: 99999,
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.5s ease-in-out',
                pointerEvents: hasStarted ? 'none' : 'auto'
            }}>
            {showContent && (
                <>
                    <div style={{
                        position: 'absolute',
                        top: '45%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '600px',
                        height: '600px',
                        backgroundImage: `url(${logo})`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        filter: 'invert(1)'
                    }} />
                    {!hasStarted && (
                        <button
                            className="btn"
                            onClick={() => {
                                playSound('btnp');
                                startBoot();
                            }}
                            style={{
                                position: 'absolute',
                                bottom: '20%',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                cursor: 'pointer'
                            }}
                        >
                            Boot Me Up!
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default BootSplash;
