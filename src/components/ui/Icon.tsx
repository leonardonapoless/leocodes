import { useState, useRef, useEffect } from 'react';
import { playSound } from '../../utils/soundManager';

interface IconProps {
    label: string;
    iconSrc?: string;
    onDoubleClick?: () => void;
    x: number;
    y: number;
    isSelected?: boolean;
    onSelect: (e: React.MouseEvent) => void;
    onDrag?: (pos: { x: number; y: number }) => void;
    size?: number;
    style?: React.CSSProperties;
    isWindowOpen?: boolean;
}

const Icon = ({ label, iconSrc, onDoubleClick, x, y, isSelected, onSelect, onDrag, size = 48, style, isWindowOpen = false }: IconProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const startPos = useRef({ x: 0, y: 0 });
    const hasMoved = useRef(false);

    const lastClickTime = useRef(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return;

        const currentTime = new Date().getTime();
        const timeDiff = currentTime - lastClickTime.current;

        if (timeDiff < 300) {
            onDoubleClick && onDoubleClick();
        } else {
            if (!isWindowOpen) playSound('fsel');
            onSelect(e);
            setIsDragging(true);
            hasMoved.current = false;
            startPos.current = { x: e.clientX, y: e.clientY };
            dragOffset.current = {
                x: e.clientX - x,
                y: e.clientY - y
            };
        }
        lastClickTime.current = currentTime;
    };

    useEffect(() => {
        const handleMouseMove = (e: globalThis.MouseEvent) => {
            if (isDragging && onDrag) {
                if (!hasMoved.current) {
                    const dx = Math.abs(e.clientX - startPos.current.x);
                    const dy = Math.abs(e.clientY - startPos.current.y);
                    if (dx > 3 || dy > 3) {
                        hasMoved.current = true;
                    }
                }
                onDrag({
                    x: e.clientX - dragOffset.current.x,
                    y: e.clientY - dragOffset.current.y
                });
            }
        };

        const handleMouseUp = () => {
            if (isDragging && hasMoved.current) playSound('fdrp');
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
                width: `${Math.max(80, size + 20)}px`,
                cursor: 'default',
                zIndex: isSelected ? 2 : 1,
                ...style
            }}
            onMouseDown={handleMouseDown}
            onDoubleClick={onDoubleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect({ stopPropagation: () => {} } as unknown as React.MouseEvent);
                    if (onDoubleClick) {
                        onDoubleClick();
                    }
                }
            }}
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
                filter: isSelected ? 'invert(100%)' : 'none'
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
                WebkitUserSelect: 'none',
                whiteSpace: 'nowrap',
                fontFamily: "'Chicago', 'Geneva', 'MS Sans Serif', sans-serif"
            }}>
                {label}
            </span>
        </div>
    );
};

export default Icon;
