import { useState, useEffect, useRef, ReactNode, CSSProperties, MouseEvent } from 'react';
import { playSound } from '../../utils/soundManager';

interface WindowProps {
    title: string;
    children: ReactNode;
    onClose: () => void;
    isOpen: boolean;
    style?: CSSProperties;
    isActive: boolean;
    onFocus: () => void;
    onPositionChange?: (pos: { x: number; y: number }) => void;
    onSizeChange?: (size: { width: number; height: number }) => void;
    noPadding?: boolean;
}

const Window = ({ title, children, onClose, isOpen, style, isActive, onFocus, onPositionChange, onSizeChange, noPadding }: WindowProps) => {
    const [isShaded, setIsShaded] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const dragStarted = useRef(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const dragStartPos = useRef({ x: 0, y: 0 });
    const dragDimensions = useRef({ width: 0, height: 0 });
    const resizeStart = useRef({ width: 0, height: 0, mouseX: 0, mouseY: 0 });

    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        if (e.button !== 0) return;
        onFocus();
        setIsDragging(true);
        dragStarted.current = false;
        const rect = e.currentTarget.getBoundingClientRect();
        dragOffset.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        dragStartPos.current = {
            x: e.clientX,
            y: e.clientY
        };
        dragDimensions.current = {
            width: rect.width,
            height: rect.height
        };
    };

    const handleResizeMouseDown = (e: MouseEvent<HTMLButtonElement>) => {
        if (e.button !== 0) return;
        e.stopPropagation();
        onFocus();
        setIsResizing(true);
        resizeStart.current = {
            width: style?.width ? (typeof style.width === 'number' ? style.width : parseInt(style.width as string)) : 300,
            height: style?.height ? (typeof style.height === 'number' ? style.height : parseInt(style.height as string)) : 200,
            mouseX: e.clientX,
            mouseY: e.clientY
        };
    };

    useEffect(() => {
        const handleMouseMove = (e: globalThis.MouseEvent) => {
            if (isDragging && onPositionChange) {
                // drag threshold
                const deltaX = Math.abs(e.clientX - dragStartPos.current.x);
                const deltaY = Math.abs(e.clientY - dragStartPos.current.y);

                if (!dragStarted.current && (deltaX > 5 || deltaY > 5)) {
                    dragStarted.current = true;
                }

                if (dragStarted.current) {
                    const newX = e.clientX - dragOffset.current.x;
                    const newY = e.clientY - dragOffset.current.y;

                    const MENU_BAR_HEIGHT = 21;

                    const windowWidth = dragDimensions.current.width;
                    const windowHeight = dragDimensions.current.height;
                    const maxX = window.innerWidth - windowWidth;
                    const maxY = window.innerHeight - windowHeight;

                    const constrainedX = Math.max(0, Math.min(newX, maxX));
                    const constrainedY = Math.max(MENU_BAR_HEIGHT, Math.min(newY, maxY));

                    onPositionChange({
                        x: constrainedX,
                        y: constrainedY
                    });
                }
            }
            if (isResizing && onSizeChange) {
                const deltaX = e.clientX - resizeStart.current.mouseX;
                const deltaY = e.clientY - resizeStart.current.mouseY;
                const newWidth = Math.max(200, resizeStart.current.width + deltaX);
                const newHeight = Math.max(150, resizeStart.current.height + deltaY);
                onSizeChange({
                    width: newWidth,
                    height: newHeight
                });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            dragStarted.current = false;
            setIsResizing(false);
        };

        if (isDragging || isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isResizing, onPositionChange, onSizeChange]);

    const prevIsOpen = useRef(isOpen);
    useEffect(() => {
        if (isOpen && !prevIsOpen.current) {
            playSound('wopn');
        }
        prevIsOpen.current = isOpen;
    }, [isOpen]);

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    let scrollTimeout: NodeJS.Timeout | undefined;

    const lastScrollSoundTime = useRef(0);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;
        const isScrollable = target.scrollHeight > target.clientHeight;

        if (isScrollable) {
            target.classList.add('scrolling');

            const now = Date.now();
            if (now - lastScrollSoundTime.current > 150) {
                playSound('sbth');
                lastScrollSoundTime.current = now;
            }

            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }

            scrollTimeout = setTimeout(() => {
                target.classList.remove('scrolling');
            }, 1000);
        }
    };

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            // Add non-passive touch listener to prevent body scroll
            const preventDefault = (e: Event) => {
                e.stopPropagation();
            };
            container.addEventListener('touchmove', preventDefault, { passive: false });
            return () => {
                container.removeEventListener('touchmove', preventDefault);
            };
        }
    }, []);
    if (!isOpen) return null;

    return (
        <div
            className={`window ${isActive ? 'active' : ''} `}
            style={{
                position: 'absolute',
                zIndex: isActive ? 10 : 1,
                ...style,
                height: isShaded ? 'auto' : (style?.height ?? 'auto'),
                display: 'flex',
                flexDirection: 'column'
            }}
            onClick={onFocus}
        >
            <div
                className="title-bar"
                onMouseDown={handleMouseDown}
                onDoubleClick={() => setIsShaded(!isShaded)}
                style={{ cursor: 'default', userSelect: 'none', WebkitUserSelect: 'none', position: 'relative' }}
            >
                <button aria-label="Close" className="close" onMouseDown={(e) => e.stopPropagation()} onClick={(e) => {
                    e.stopPropagation();
                    playSound('wcls');
                    onClose();
                }}></button>
                <h1 className="title" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', margin: 0 }}>{title}</h1>
            </div>
            <div className="separator"></div>
            <div
                ref={scrollContainerRef}
                className="window-pane"
                onScroll={handleScroll}
                style={{
                    ...(noPadding ? { padding: 0 } : {}),
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    pointerEvents: (isDragging || isResizing) ? 'none' : 'auto',
                    flex: 1,
                    overflow: 'auto',
                    position: 'relative',
                    display: isShaded ? 'none' : 'block'
                }}>
                {children}
            </div>
            <button
                aria-label="Resize"
                className="resize"
                onMouseDown={handleResizeMouseDown}
                style={{
                    position: 'absolute',
                    bottom: '2px',
                    right: '2px',
                    cursor: 'nwse-resize',
                    width: '15px',
                    height: '15px',
                    background: 'none',
                    border: 'none',
                    zIndex: 20
                }}
            >
                <svg width="100%" height="100%" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 15L0 15L15 0Z" fill="#808080" fillOpacity="0.5" />
                    <line x1="3" y1="15" x2="15" y2="3" stroke="black" strokeWidth="1" />
                    <line x1="7" y1="15" x2="15" y2="7" stroke="black" strokeWidth="1" />
                    <line x1="11" y1="15" x2="15" y2="11" stroke="black" strokeWidth="1" />
                </svg>
            </button>
        </div>
    );
};

export default Window;
