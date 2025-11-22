import { useState, useRef, useEffect } from 'react';
import { playSound } from '../../utils/soundManager';

const Icon = ({ label, iconSrc, onDoubleClick, x, y, isSelected, onSelect, onDrag, size = 48 }) => {
    const [isDragging, setIsDragging] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });

    const lastClickTime = useRef(0);

    const handleMouseDown = (e) => {
        if (e.button !== 0) return;

        // custom double click detection because ondoubleclick was being finicky
        // tracks time between clicks and triggers action if < 300ms
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - lastClickTime.current;

        if (timeDiff < 300) {
            playSound('flap');
            onDoubleClick && onDoubleClick();
        } else {
            playSound('fsel');
            onSelect(e);
            setIsDragging(true);
            dragOffset.current = {
                x: e.clientX - x,
                y: e.clientY - y
            };
        }
        lastClickTime.current = currentTime;
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isDragging && onDrag) {
                onDrag({
                    x: e.clientX - dragOffset.current.x,
                    y: e.clientY - dragOffset.current.y
                });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, onDrag]);

    return (
        <div
            style={{
                position: 'absolute',
                top: y,
                left: x,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: `${Math.max(80, size + 20)}px`, // add padding around icon
                cursor: 'default',
                zIndex: isSelected ? 2 : 1
            }}
            onMouseDown={handleMouseDown}
            onDoubleClick={onDoubleClick}
        >
            <div style={{
                width: `${size}px`,
                height: `${size}px`,
                marginBottom: '4px',
                backgroundColor: iconSrc ? 'transparent' : '#ccc',
                backgroundImage: iconSrc ? `url(${iconSrc})` : 'none',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                border: iconSrc ? 'none' : '1px solid #000',
                filter: isSelected ? 'invert(100%)' : 'none' // invert colors when selected
            }}>
                {!iconSrc && <div style={{ width: '100%', height: '100%', border: '1px solid white', boxSizing: 'border-box' }}></div>}
            </div>
            <span style={{
                background: isSelected ? '#000' : '#fff',
                color: isSelected ? '#fff' : '#000',
                padding: '0 2px',
                border: isSelected ? '1px dotted #fff' : '1px dotted #fff',
                fontSize: '12px',
                textAlign: 'center',
                userSelect: 'none',
                whiteSpace: 'nowrap',
                fontFamily: "'Chicago', 'Geneva', 'MS Sans Serif', sans-serif"
            }}>
                {label}
            </span>
        </div>
    );
};

export default Icon;
