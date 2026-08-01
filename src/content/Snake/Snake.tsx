import { useState, useEffect, useRef, useCallback } from 'react';
import appleLogo from '@sakun/system.css/icon/apple.svg';
import { playSound } from '../../utils/soundManager';
import * as S from './Snake.styles';

const GRID_SIZE = 20;

const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIR = { x: 0, y: -1 };

export function Snake() {
    const [snake, setSnake] = useState(INITIAL_SNAKE);
    const [food, setFood] = useState({ x: 5, y: 5 });
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(() => {
        const saved = localStorage.getItem('snakeHighScore');
        return saved ? parseInt(saved, 10) : 0;
    });

    const dirRef = useRef(INITIAL_DIR);
    const lastDirRef = useRef(INITIAL_DIR);
    const ticker = useRef<NodeJS.Timeout | null>(null);
    const touchStart = useRef<{ x: number, y: number } | null>(null);

    const [gameStarted, setGameStarted] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
    const isMountedRef = useRef(true);

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (isMountedRef.current) {
                setIsDesktop(window.innerWidth > 768);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const screenSize = isDesktop ? 340 : Math.min(260, window.innerWidth - 80);

    const spawnFood = useCallback(() => {
        if (isMountedRef.current) {
            setFood({
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE)
            });
        }
    }, []);

    const resetGame = useCallback(() => {
        if (isMountedRef.current) {
            setSnake(INITIAL_SNAKE);
            dirRef.current = INITIAL_DIR;
            lastDirRef.current = INITIAL_DIR;
            setScore(0);
            setGameOver(false);
            setGameStarted(true);
            spawnFood();
        }
    }, [spawnFood]);

    const tick = useCallback(() => {
        if (!isMountedRef.current || gameOver || !gameStarted) return;

        setSnake(prev => {
            const currentDir = dirRef.current;
            lastDirRef.current = currentDir;

            const head = {
                x: prev[0].x + currentDir.x,
                y: prev[0].y + currentDir.y
            };

            const isOutOfBounds = head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE;
            const isSelfCollision = prev.some(s => s.x === head.x && s.y === head.y);

            if (isOutOfBounds || isSelfCollision) {
                if (isMountedRef.current) {
                    playSound('fdrp');
                    setGameOver(true);
                }
                return prev;
            }

            const newSnake = [head, ...prev];

            if (head.x === food.x && head.y === food.y) {
                if (isMountedRef.current) {
                    playSound('popp');
                    setScore(s => {
                        const newScore = s + 1;
                        setHighScore(prevHigh => {
                            if (newScore > prevHigh) {
                                localStorage.setItem('snakeHighScore', newScore.toString());
                                return newScore;
                            }
                            return prevHigh;
                        });
                        return newScore;
                    });
                    spawnFood();
                }
            } else {
                newSnake.pop();
            }

            return newSnake;
        });
    }, [food, gameOver, gameStarted, spawnFood]);

    useEffect(() => {
        if (gameStarted && !gameOver) {
            const currentSpeed = Math.max(75, 150 - score * 1.5);
            ticker.current = setInterval(tick, currentSpeed);
        }
        return () => { if (ticker.current) clearInterval(ticker.current) };
    }, [gameStarted, gameOver, tick, score]);

    const setDir = useCallback((x: number, y: number) => {
        if (!gameStarted) return;
        const last = lastDirRef.current;
        if (last.x === -x && last.y === -y) return;
        if (dirRef.current !== lastDirRef.current) return;
        dirRef.current = { x, y };
    }, [gameStarted]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (!isMountedRef.current) return;
            const key = e.key.toLowerCase();

            if (key === 'enter') {
                if (gameOver) {
                    resetGame();
                    return;
                } else if (!gameStarted) {
                    setGameStarted(true);
                    return;
                }
            }

            if (gameOver || !gameStarted) return;

            if (['arrowup', 'w'].includes(key)) setDir(0, -1);
            if (['arrowdown', 's'].includes(key)) setDir(0, 1);
            if (['arrowleft', 'a'].includes(key)) setDir(-1, 0);
            if (['arrowright', 'd'].includes(key)) setDir(1, 0);
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [gameOver, gameStarted, resetGame, setDir]);

    const onTouchStart = (e: React.TouchEvent) => {
        if (!gameStarted) return;
        touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = (e: React.TouchEvent) => {
        if (!gameStarted || !touchStart.current) return;
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const dx = endX - touchStart.current.x;
        const dy = endY - touchStart.current.y;

        if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;

        if (Math.abs(dx) > Math.abs(dy)) {
            setDir(dx > 0 ? 1 : -1, 0);
        } else {
            setDir(0, dy > 0 ? 1 : -1);
        }
        touchStart.current = null;
    };

    return (
        <div
            style={S.containerStyle}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            <style>{S.globalStyles}</style>

            <div style={S.bezelStyle}>
                <div style={S.screenFrameStyle}>
                    <div style={S.getScreenStyle(screenSize)}>
                        <div className="scanlines" style={S.scanlinesOverlayStyle}></div>
                        <div style={S.screenBackgroundPatternStyle}></div>

                        {!gameStarted && !gameOver && (
                            <div style={S.overlayStyle}>
                                <h2 className="retro-text" style={S.titleStyle}>SNAKE</h2>
                                <button onMouseDown={() => playSound('btnp')} onMouseUp={() => playSound('btnr')} onClick={() => setGameStarted(true)} className="retro-text" style={S.buttonStyle}>PLAY</button>
                            </div>
                        )}

                        {gameOver && (
                            <div style={S.overlayStyle}>
                                <h2 className="retro-text" style={S.gameOverTitleStyle}>GAME OVER</h2>
                                <div className="retro-text" style={{ fontSize: '12px', marginTop: '10px' }}>Score: {score}</div>
                                <div style={{ height: 20 }} />
                                <button onMouseDown={() => playSound('btnp')} onMouseUp={() => playSound('btnr')} onClick={resetGame} className="retro-text" style={S.restartButtonStyle}>RESTART</button>
                                <span style={S.restartHintStyle}>Press Enter</span>
                            </div>
                        )}

                        {snake.map((s, i) => (
                            <div key={`${s.x}-${s.y}-${i}`} style={S.getSnakePartStyle(s.x, s.y, i === 0, GRID_SIZE)} />
                        ))}

                        <div className="food-animated" style={S.getFoodContainerStyle(food.x, food.y, GRID_SIZE)}>
                            <img src={appleLogo} alt="Food" style={S.foodImageStyle} />
                        </div>

                        <div className="retro-text" style={{...S.scoreStyle, bottom: '20px'}}>HI: {highScore}</div>
                        <div className="retro-text" style={S.scoreStyle}>{score}</div>
                    </div>
                </div>

                <div style={S.controlsRowStyle}>
                    <div style={S.dpadContainerStyle}>
                        <div style={S.dpadHorizontalBgStyle}></div>
                        <div style={S.dpadVerticalBgStyle}></div>

                        <div
                            onPointerDown={(e) => { e.stopPropagation(); setDir(0, -1); }}
                            style={S.dpadUpHitboxStyle}
                            role="button"
                            tabIndex={0}
                            aria-label="Up"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    setDir(0, -1);
                                }
                            }}
                        ></div>
                        <div
                            onPointerDown={(e) => { e.stopPropagation(); setDir(0, 1); }}
                            style={S.dpadDownHitboxStyle}
                            role="button"
                            tabIndex={0}
                            aria-label="Down"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    setDir(0, 1);
                                }
                            }}
                        ></div>
                        <div
                            onPointerDown={(e) => { e.stopPropagation(); setDir(-1, 0); }}
                            style={S.dpadLeftHitboxStyle}
                            role="button"
                            tabIndex={0}
                            aria-label="Left"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    setDir(-1, 0);
                                }
                            }}
                        ></div>
                        <div
                            onPointerDown={(e) => { e.stopPropagation(); setDir(1, 0); }}
                            style={S.dpadRightHitboxStyle}
                            role="button"
                            tabIndex={0}
                            aria-label="Right"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    setDir(1, 0);
                                }
                            }}
                        ></div>

                        <div style={S.dpadCenterStyle}></div>
                    </div>

                    <div style={S.actionButtonsContainerStyle}>
                        <div style={S.actionButtonWrapperStyle}>
                            <div
                                className="action-btn"
                                onClick={resetGame}
                                onPointerDown={(e) => e.stopPropagation()}
                                style={S.actionButtonStyle}
                                role="button"
                                tabIndex={0}
                                aria-label="Button B"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        resetGame();
                                    }
                                }}
                            ></div>
                            <span style={S.actionButtonLabelStyle}>B</span>
                        </div>
                        <div style={S.actionButtonAWrapperStyle}>
                            <div
                                className="action-btn"
                                onClick={resetGame}
                                onPointerDown={(e) => e.stopPropagation()}
                                style={S.actionButtonStyle}
                                role="button"
                                tabIndex={0}
                                aria-label="Button A"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        resetGame();
                                    }
                                }}
                            ></div>
                            <span style={S.actionButtonLabelStyle}>A</span>
                        </div>
                    </div>
                </div>

                <div style={S.selectStartContainerStyle}>
                    <div style={S.selectStartButtonStyle}></div>
                    <div style={S.selectStartButtonStyle}></div>
                </div>
            </div>

            <div style={S.footerStyle}>
                Swipe or use D-Pad / Arrows to play
            </div>
        </div>
    );
}
