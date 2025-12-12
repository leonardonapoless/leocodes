import { useState, useEffect, useCallback, useRef } from 'react';
import appleLogo from '@sakun/system.css/icon/apple.svg';

const GRID_SIZE = 20;
const SPEED = 130;

const PALETTE = {
    bg: '#8bac0f',
    fg: '#0f380f',
    snake: '#306230',
    food: '#0f380f',
    bezel: '#4a4a4a',
    screenShadow: 'inset 2px 2px 5px rgba(0,0,0,0.5)',
    ledOn: '#ff0000'
};

const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIR = { x: 0, y: -1 };

const Snake = () => {
    const [snake, setSnake] = useState(INITIAL_SNAKE);
    const [food, setFood] = useState({ x: 5, y: 5 });
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);

    const dirRef = useRef(INITIAL_DIR);
    const lastDirRef = useRef(INITIAL_DIR);
    const ticker = useRef<NodeJS.Timeout | null>(null);
    const touchStart = useRef<{ x: number, y: number } | null>(null);

    const [gameStarted, setGameStarted] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth > 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const screenSize = isDesktop ? 340 : Math.min(260, window.innerWidth - 80);

    const resetGame = useCallback(() => {
        setSnake(INITIAL_SNAKE);
        dirRef.current = INITIAL_DIR;
        lastDirRef.current = INITIAL_DIR;
        setScore(0);
        setGameOver(false);
        setGameStarted(true);
        spawnFood();
    }, []);

    const spawnFood = () => {
        setFood({
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        });
    };

    const tick = useCallback(() => {
        if (gameOver || !gameStarted) return;

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
                setGameOver(true);
                return prev;
            }

            const newSnake = [head, ...prev];

            if (head.x === food.x && head.y === food.y) {
                setScore(s => s + 1);
                spawnFood();
            } else {
                newSnake.pop();
            }

            return newSnake;
        });
    }, [food, gameOver, gameStarted]);

    useEffect(() => {
        if (gameStarted && !gameOver) {
            ticker.current = setInterval(tick, SPEED);
        }
        return () => { if (ticker.current) clearInterval(ticker.current) };
    }, [tick, gameStarted, gameOver]);

    const setDir = useCallback((x: number, y: number) => {
        if (!gameStarted) return;
        const last = lastDirRef.current;
        if (last.x === -x && last.y === -y) return;
        if (dirRef.current !== lastDirRef.current) return;
        dirRef.current = { x, y };
    }, [gameStarted]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
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
    }, [gameOver, gameStarted, setDir, resetGame]);

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
            style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                height: '100%', backgroundColor: '#c0c0c0', color: PALETTE.fg, fontFamily: '"Courier New", monospace',
                padding: '10px', boxSizing: 'border-box', overflow: 'hidden', touchAction: 'none'
            }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
                .retro-text { font-family: 'Press Start 2P', cursive; }
                .scanlines {
                    background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1));
                    background-size: 100% 4px;
                }
                `}
            </style>

            <div style={{
                backgroundColor: PALETTE.bezel, padding: '15px 15px 30px 15px', borderRadius: '10px 10px 30px 10px',
                boxShadow: 'inset -5px -5px 10px rgba(0,0,0,0.2), 5px 5px 15px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '15px'
            }}>

                <div style={{
                    backgroundColor: '#777', padding: '10px 10px 5px 10px', borderRadius: '5px 5px 20px 5px',
                    boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.5)'
                }}>
                    <div style={{
                        position: 'relative', width: screenSize, height: screenSize,
                        backgroundColor: PALETTE.bg, boxShadow: PALETTE.screenShadow, border: '2px solid #5d6d33', overflow: 'hidden'
                    }}>
                        <div className="scanlines" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}></div>
                        <div style={{
                            position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.2, backgroundSize: '10px 10px',
                            backgroundImage: `linear-gradient(${PALETTE.fg}22 1px, transparent 1px), linear-gradient(90deg, ${PALETTE.fg}22 1px, transparent 1px)`
                        }}></div>

                        {!gameStarted && !gameOver && (
                            <div style={{
                                position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                                backgroundColor: 'rgba(15, 56, 15, 0.9)', color: PALETTE.bg, zIndex: 10
                            }}>
                                <h2 className="retro-text" style={{ margin: 0, fontSize: '18px', textShadow: '2px 2px 0px #000', marginBottom: '20px' }}>SNAKE</h2>
                                <button onClick={() => setGameStarted(true)} className="retro-text" style={{
                                    background: PALETTE.bg, color: PALETTE.fg, border: '2px solid ' + PALETTE.fg, padding: '10px 20px',
                                    fontSize: '12px', cursor: 'pointer', boxShadow: '2px 2px 0px #000'
                                }}>PLAY</button>
                            </div>
                        )}

                        {gameOver && (
                            <div style={{
                                position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                                backgroundColor: 'rgba(15, 56, 15, 0.9)', color: PALETTE.bg, zIndex: 10
                            }}>
                                <h2 className="retro-text" style={{ margin: 0, fontSize: '16px', textShadow: '2px 2px 0px #000' }}>GAME OVER</h2>
                                <div style={{ height: 20 }} />
                                <button onClick={resetGame} className="retro-text" style={{
                                    background: PALETTE.bg, color: PALETTE.fg, border: '2px solid ' + PALETTE.fg, padding: '10px',
                                    fontSize: '10px', cursor: 'pointer', boxShadow: '2px 2px 0px #000'
                                }}>RESTART</button>
                                <span style={{ fontSize: '10px', marginTop: '10px', color: '#ccc' }}>Press Enter</span>
                            </div>
                        )}

                        {snake.map((s, i) => (
                            <div key={`${s.x}-${s.y}-${i}`} style={{
                                position: 'absolute', left: `${(s.x / GRID_SIZE) * 100}%`, top: `${(s.y / GRID_SIZE) * 100}%`,
                                width: `${100 / GRID_SIZE}%`, height: `${100 / GRID_SIZE}%`, backgroundColor: PALETTE.snake,
                                border: '1px solid ' + PALETTE.bg, borderRadius: '1px', boxShadow: i === 0 ? 'inset 0 0 0 1px rgba(0,0,0,0.5)' : 'none'
                            }} />
                        ))}

                        <div style={{
                            position: 'absolute', left: `${(food.x / GRID_SIZE) * 100}%`, top: `${(food.y / GRID_SIZE) * 100}%`,
                            width: `${100 / GRID_SIZE}%`, height: `${100 / GRID_SIZE}%`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            zIndex: 4
                        }}>
                            <img src={appleLogo} alt="Food" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>

                        <div className="retro-text" style={{
                            position: 'absolute', bottom: '5px', right: '5px', fontSize: '10px', color: PALETTE.fg, opacity: 0.7
                        }}>{score}</div>
                    </div>

                </div>

                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', paddingInline: '10px', alignItems: 'center' }}>
                    <div style={{ position: 'relative', width: '90px', height: '90px' }}>
                        <div style={{
                            position: 'absolute', top: '30px', left: '0', width: '90px', height: '30px', backgroundColor: '#222', borderRadius: '3px',
                            boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.2), 2px 2px 5px rgba(0,0,0,0.5)'
                        }}></div>
                        <div style={{
                            position: 'absolute', top: '0', left: '30px', width: '30px', height: '90px', backgroundColor: '#222', borderRadius: '3px',
                            boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.2), 2px 2px 5px rgba(0,0,0,0.5)'
                        }}></div>

                        <div onPointerDown={(e) => { e.stopPropagation(); setDir(0, -1); }} style={{ position: 'absolute', top: 0, left: 30, width: 30, height: 45, cursor: 'pointer', zIndex: 10 }}></div>
                        <div onPointerDown={(e) => { e.stopPropagation(); setDir(0, 1); }} style={{ position: 'absolute', bottom: 0, left: 30, width: 30, height: 45, cursor: 'pointer', zIndex: 10 }}></div>
                        <div onPointerDown={(e) => { e.stopPropagation(); setDir(-1, 0); }} style={{ position: 'absolute', top: 30, left: 0, width: 45, height: 30, cursor: 'pointer', zIndex: 10 }}></div>
                        <div onPointerDown={(e) => { e.stopPropagation(); setDir(1, 0); }} style={{ position: 'absolute', top: 30, right: 0, width: 45, height: 30, cursor: 'pointer', zIndex: 10 }}></div>

                        <div style={{ position: 'absolute', top: 35, left: 35, width: 20, height: 20, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #444, #111)' }}></div>
                    </div>

                    <div style={{ display: 'flex', gap: '15px', transform: 'rotate(-25deg)', marginTop: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div onClick={resetGame} onPointerDown={(e) => e.stopPropagation()} style={{
                                width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#8b1d3a',
                                boxShadow: 'inset 2px 2px 5px rgba(255,255,255,0.2), 2px 2px 5px rgba(0,0,0,0.5)', cursor: 'pointer'
                            }}></div>
                            <span style={{ color: '#999', fontSize: '10px', fontWeight: 'bold', marginTop: '5px' }}>B</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '-10px' }}>
                            <div onClick={resetGame} onPointerDown={(e) => e.stopPropagation()} style={{
                                width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#8b1d3a',
                                boxShadow: 'inset 2px 2px 5px rgba(255,255,255,0.2), 2px 2px 5px rgba(0,0,0,0.5)', cursor: 'pointer'
                            }}></div>
                            <span style={{ color: '#999', fontSize: '10px', fontWeight: 'bold', marginTop: '5px' }}>A</span>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                    <div style={{
                        width: '40px', height: '10px', backgroundColor: '#999', borderRadius: '10px', transform: 'rotate(-25deg)',
                        boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.5), 1px 1px 3px rgba(0,0,0,0.5)'
                    }}></div>
                    <div style={{
                        width: '40px', height: '10px', backgroundColor: '#999', borderRadius: '10px', transform: 'rotate(-25deg)',
                        boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.5), 1px 1px 3px rgba(0,0,0,0.5)'
                    }}></div>
                </div>
            </div>

            <div style={{ marginTop: '20px', color: '#666', fontSize: '14px', textAlign: 'center' }}>
                Swipe or use D-Pad / Arrows to play
            </div>
        </div>
    );
};

export default Snake;
