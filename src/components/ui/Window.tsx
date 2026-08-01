import { useState, useEffect, useRef, ReactNode, CSSProperties, PointerEvent } from 'react';
import { playSound, stopSound } from '../../utils/soundManager';

interface WindowProps {
    id?: string;
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
    isMobile?: boolean;
    minWidth?: number;
    minHeight?: number;
}

const Window = ({ id, title, children, onClose, isOpen, style, isActive, onFocus, onPositionChange, onSizeChange, noPadding, isMobile, minWidth = 200, minHeight = 150 }: WindowProps) => {
    const [isShaded, setIsShaded] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const dragStarted = useRef(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const dragStartPos = useRef({ x: 0, y: 0 });
    const dragDimensions = useRef({ width: 0, height: 0 });
    const resizeStart = useRef({ width: 0, height: 0, mouseX: 0, mouseY: 0 });

    const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
        if (isMobile) return;
        if (e.button !== 0) return;
        onFocus();
        e.currentTarget.setPointerCapture(e.pointerId);
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

    const handleResizePointerDown = (e: PointerEvent<HTMLButtonElement>) => {
        if (isMobile) return;
        if (e.button !== 0) return;
        e.stopPropagation();
        e.currentTarget.setPointerCapture(e.pointerId);
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
        const handlePointerMove = (e: globalThis.PointerEvent) => {
            if (isDragging && onPositionChange) {
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
                const newWidth = Math.max(minWidth, resizeStart.current.width + deltaX);
                const newHeight = Math.max(minHeight, resizeStart.current.height + deltaY);
                onSizeChange({
                    width: newWidth,
                    height: newHeight
                });
            }
        };

        const handlePointerUp = () => {
            setIsDragging(false);
            dragStarted.current = false;
            setIsResizing(false);
        };

        if (isDragging || isResizing) {
            document.addEventListener('pointermove', handlePointerMove);
            document.addEventListener('pointerup', handlePointerUp);
        }

        return () => {
            document.removeEventListener('pointermove', handlePointerMove);
            document.removeEventListener('pointerup', handlePointerUp);
        };
    }, [isDragging, isResizing, onPositionChange, onSizeChange]);

    const prevIsOpen = useRef(isOpen);
    const prevIsActive = useRef(isActive);
    const skipFocusSoundRef = useRef(false);

    useEffect(() => {
        if (isOpen && !prevIsOpen.current) {
            playSound('wopn');
        } else if (isOpen && isActive && !prevIsActive.current) {
            if (!skipFocusSoundRef.current) {
                playSound('wact');
            }
            skipFocusSoundRef.current = false;
        }
        prevIsOpen.current = isOpen;
        prevIsActive.current = isActive;
    }, [isOpen, isActive]);


    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const isScrollSoundPlaying = useRef(false);

    useEffect(() => {
        return () => {
            if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
            if (isScrollSoundPlaying.current) stopSound('sbth');
        };
    }, []);

    const stopScrollSound = () => {
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        if (isScrollSoundPlaying.current) {
            stopSound('sbth');
            playSound('sbth_decay');
            isScrollSoundPlaying.current = false;
        }
    };

    useEffect(() => {
        if (!isActive && isScrollSoundPlaying.current) {
            stopScrollSound();
        }
    }, [isActive]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;
        if (target.scrollHeight <= target.clientHeight) return;
        if (!isActive) return;

        if (!isScrollSoundPlaying.current) {
            isScrollSoundPlaying.current = true;
            playSound('sbth_attack');
            playSound('sbth', { exclusive: true, loop: true });
        }

        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

        scrollTimeoutRef.current = setTimeout(() => {
            stopScrollSound();
        }, 150);
    };

    useEffect(() => {
        if (isMobile) return;
        const container = scrollContainerRef.current;
        if (container) {
            const preventDefault = (e: Event) => {
                e.stopPropagation();
            };
            container.addEventListener('touchmove', preventDefault, { passive: false });
            return () => {
                container.removeEventListener('touchmove', preventDefault);
            };
        }
    }, [isMobile]);
    if (!isOpen) return null;

    const titleRef = useRef<HTMLHeadingElement>(null);
    const [titleFontSize, setTitleFontSize] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (!isMobile || !isOpen || !titleRef.current) {
            setTitleFontSize(undefined);
            return;
        }

        const adjustTitleSize = () => {
            const element = titleRef.current;
            if (!element) return;

            element.style.fontSize = '';

            const availableWidth = element.offsetWidth;
            const fullWidth = element.scrollWidth;

            if (fullWidth > availableWidth) {
                const computedStyle = window.getComputedStyle(element);
                const currentFontSize = parseFloat(computedStyle.fontSize) || 16;

                const ratio = availableWidth / fullWidth;
                const newSize = Math.max(9, Math.floor(currentFontSize * ratio));

                setTitleFontSize(newSize);
            } else {
                setTitleFontSize(undefined);
            }
        };

        const timer = setTimeout(adjustTitleSize, 0);
        return () => clearTimeout(timer);
    }, [title, isMobile, isOpen]);

    const titleId = `window-title-${id || title.replace(/\s+/g, '-').toLowerCase()}`;

    return (
        <div
            id={id}
            className={`window ${isActive ? 'active' : ''} `}
            role="dialog"
            aria-labelledby={titleId}
            aria-modal="false"
            style={{
                position: 'absolute',
                zIndex: isActive ? 10 : 1,
                ...style,
                height: isShaded ? 'auto' : (style?.height ?? 'auto'),
                display: 'flex',
                flexDirection: 'column'
            }}
            onClick={(e) => {
                if (!isActive) {
                    const target = e.target as HTMLElement;
                    const isInteractive = target.closest('button, a, input, select, textarea, summary, details, label, [role="button"], .interactive-element');
                    if (isInteractive) {
                        skipFocusSoundRef.current = true;
                    }
                    onFocus();
                }
            }}
        >
            <div
                className="title-bar"
                onPointerDown={handlePointerDown}
                onDoubleClick={() => {
                    if (isMobile) return;
                    playSound(isShaded ? 'wexp' : 'wcol');
                    setIsShaded(!isShaded);
                }}
                style={{ cursor: 'default', userSelect: 'none', WebkitUserSelect: 'none', position: 'relative' }}
            >
                <button
                    aria-label="Close"
                    className="close"
                    style={{ position: 'relative', zIndex: 20 }}
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                        e.stopPropagation();
                        playSound('wcls');
                        onClose();
                    }}
                />
                <h1
                    id={titleId}
                    ref={titleRef}
                    className="title"
                    style={{
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        margin: 0,
                        whiteSpace: 'nowrap',
                        maxWidth: isMobile ? 'calc(100% - 90px)' : '100%',
                        fontSize: titleFontSize ? `${titleFontSize}px` : undefined,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}
                >
                    {title}
                </h1>
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
                onPointerDown={handleResizePointerDown}
                style={{
                    position: 'absolute',
                    bottom: '0px',
                    right: '0px',
                    cursor: 'nwse-resize',
                    width: '16px',
                    height: '16px',
                    background: 'none',
                    border: 'none',
                    zIndex: 20,
                    padding: 0,
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-end'
                }}
            >
                <svg width="100" height="24" viewBox="4 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="12" y="12" width="12" height="12" fill="#b3b3baff" stroke="#4a4a4a" strokeWidth="1.5" />
                    <rect x="6" y="6" width="12" height="12" stroke="#4a4a4a" strokeWidth="1.5" fill="#c0c0d0" />
                </svg>
            </button>
        </div>
    );
};

export default Window;
