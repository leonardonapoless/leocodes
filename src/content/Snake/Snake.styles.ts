import { type CSSProperties } from 'react';

export const PALETTE = {
    bg: '#8bac0f',
    fg: '#0f380f',
    snake: '#306230',
    food: '#0f380f',
    bezel: '#4a4a4a',
    screenShadow: 'inset 2px 2px 5px rgba(0,0,0,0.5)',
    ledOn: '#ff0000'
};

export const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    backgroundColor: '#c0c0c0',
    color: PALETTE.fg,
    fontFamily: '"Courier New", monospace',
    padding: '10px',
    boxSizing: 'border-box',
    overflow: 'hidden',
    touchAction: 'none'
};

export const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
    .retro-text { font-family: 'Press Start 2P', cursive; }
    .scanlines {
        background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1));
        background-size: 100% 4px;
    }
    @keyframes food-pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(0.9); opacity: 0.9; }
    }
    .food-animated {
        animation: food-pulse 1.2s infinite ease-in-out;
    }
    .action-btn:active {
        transform: scale(0.95);
        box-shadow: inset 3px 3px 6px rgba(0,0,0,0.8), inset -1px -1px 2px rgba(255,255,255,0.2) !important;
    }
`;

export const bezelStyle: CSSProperties = {
    backgroundColor: PALETTE.bezel,
    padding: '15px 15px 30px 15px',
    borderRadius: '10px 10px 30px 10px',
    boxShadow: 'inset -5px -5px 10px rgba(0,0,0,0.2), 5px 5px 15px rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px'
};

export const screenFrameStyle: CSSProperties = {
    backgroundColor: '#777',
    padding: '10px 10px 5px 10px',
    borderRadius: '5px 5px 20px 5px',
    boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.5)'
};

export const getScreenStyle = (screenSize: number): CSSProperties => ({
    position: 'relative',
    width: screenSize,
    height: screenSize,
    backgroundColor: PALETTE.bg,
    boxShadow: PALETTE.screenShadow,
    border: '2px solid #5d6d33',
    overflow: 'hidden',
    cursor: 'none'
});

export const scanlinesOverlayStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 5
};

export const screenBackgroundPatternStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    opacity: 0.2,
    backgroundSize: '10px 10px',
    backgroundImage: `linear-gradient(${PALETTE.fg}22 1px, transparent 1px), linear-gradient(90deg, ${PALETTE.fg}22 1px, transparent 1px)`
};

export const overlayStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 56, 15, 0.9)',
    color: PALETTE.bg,
    zIndex: 10
};

export const titleStyle: CSSProperties = {
    margin: 0,
    fontSize: '18px',
    textShadow: '2px 2px 0px #000',
    marginBottom: '20px'
};

export const buttonStyle: CSSProperties = {
    background: PALETTE.bg,
    color: PALETTE.fg,
    border: '2px solid ' + PALETTE.fg,
    padding: '10px 20px',
    fontSize: '12px',
    cursor: 'pointer',
    boxShadow: '2px 2px 0px #000'
};

export const gameOverTitleStyle: CSSProperties = {
    margin: 0,
    fontSize: '16px',
    textShadow: '2px 2px 0px #000'
};

export const restartButtonStyle: CSSProperties = {
    ...buttonStyle,
    padding: '10px',
    fontSize: '10px'
};

export const restartHintStyle: CSSProperties = {
    fontSize: '10px',
    marginTop: '10px',
    color: '#ccc'
};

export const getSnakePartStyle = (x: number, y: number, isHead: boolean, GRID_SIZE: number): CSSProperties => ({
    position: 'absolute',
    left: `${(x / GRID_SIZE) * 100}%`,
    top: `${(y / GRID_SIZE) * 100}%`,
    width: `${100 / GRID_SIZE}%`,
    height: `${100 / GRID_SIZE}%`,
    backgroundColor: PALETTE.snake,
    border: '1px solid ' + PALETTE.bg,
    borderRadius: '1px',
    boxShadow: isHead ? 'inset 0 0 0 1px rgba(0,0,0,0.5)' : 'none'
});

export const getFoodContainerStyle = (x: number, y: number, GRID_SIZE: number): CSSProperties => ({
    position: 'absolute',
    left: `${(x / GRID_SIZE) * 100}%`,
    top: `${(y / GRID_SIZE) * 100}%`,
    width: `${100 / GRID_SIZE}%`,
    height: `${100 / GRID_SIZE}%`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 4
});

export const foodImageStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
};

export const scoreStyle: CSSProperties = {
    position: 'absolute',
    bottom: '5px',
    right: '5px',
    fontSize: '10px',
    color: PALETTE.fg,
    opacity: 0.7
};

export const controlsRowStyle: CSSProperties = {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    paddingInline: '10px',
    alignItems: 'center'
};

export const dpadContainerStyle: CSSProperties = {
    position: 'relative',
    width: '90px',
    height: '90px'
};

export const dpadHorizontalBgStyle: CSSProperties = {
    position: 'absolute',
    top: '30px',
    left: '0',
    width: '90px',
    height: '30px',
    backgroundColor: '#222',
    borderRadius: '3px',
    boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.2), 2px 2px 5px rgba(0,0,0,0.5)'
};

export const dpadVerticalBgStyle: CSSProperties = {
    position: 'absolute',
    top: '0',
    left: '30px',
    width: '30px',
    height: '90px',
    backgroundColor: '#222',
    borderRadius: '3px',
    boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.2), 2px 2px 5px rgba(0,0,0,0.5)'
};

export const dpadUpHitboxStyle: CSSProperties = { position: 'absolute', top: 0, left: 30, width: 30, height: 45, cursor: 'pointer', zIndex: 10 };
export const dpadDownHitboxStyle: CSSProperties = { position: 'absolute', bottom: 0, left: 30, width: 30, height: 45, cursor: 'pointer', zIndex: 10 };
export const dpadLeftHitboxStyle: CSSProperties = { position: 'absolute', top: 30, left: 0, width: 45, height: 30, cursor: 'pointer', zIndex: 10 };
export const dpadRightHitboxStyle: CSSProperties = { position: 'absolute', top: 30, right: 0, width: 45, height: 30, cursor: 'pointer', zIndex: 10 };

export const dpadCenterStyle: CSSProperties = {
    position: 'absolute',
    top: 35,
    left: 35,
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: 'radial-gradient(circle at 30% 30%, #444, #111)'
};

export const actionButtonsContainerStyle: CSSProperties = {
    display: 'flex',
    gap: '15px',
    transform: 'rotate(-25deg)',
    marginTop: '20px'
};

export const actionButtonWrapperStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
};

export const actionButtonAWrapperStyle: CSSProperties = {
    ...actionButtonWrapperStyle,
    marginTop: '-10px'
};

export const actionButtonStyle: CSSProperties = {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: '#8b1d3a',
    boxShadow: 'inset 2px 2px 5px rgba(255,255,255,0.2), 2px 2px 5px rgba(0,0,0,0.5)',
    cursor: 'pointer'
};

export const actionButtonLabelStyle: CSSProperties = {
    color: '#999',
    fontSize: '10px',
    fontWeight: 'bold',
    marginTop: '5px'
};

export const selectStartContainerStyle: CSSProperties = {
    display: 'flex',
    gap: '15px',
    marginTop: '10px'
};

export const selectStartButtonStyle: CSSProperties = {
    width: '40px',
    height: '10px',
    backgroundColor: '#999',
    borderRadius: '10px',
    transform: 'rotate(-25deg)',
    boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.5), 1px 1px 3px rgba(0,0,0,0.5)'
};

export const footerStyle: CSSProperties = {
    marginTop: '20px',
    color: '#666',
    fontSize: '14px',
    textAlign: 'center'
};
