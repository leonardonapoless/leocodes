import { useEffect, useRef } from 'react';

interface WasmGameProps {
    wasmUrl: string;
    width?: number;
    height?: number;
    memoryConfig?: WebAssembly.MemoryDescriptor;
    getImportObject: (params: { memory: WebAssembly.Memory; canvas: HTMLCanvasElement }) => any;
    onInit?: (instance: WebAssembly.Instance) => void;
    onStep?: (instance: WebAssembly.Instance, timestamp: number) => void;
    onKeyDown?: (keyCode: number, instance: WebAssembly.Instance) => void;
    onKeyUp?: (keyCode: number, instance: WebAssembly.Instance) => void;
    style?: React.CSSProperties;
}

const WasmGame = ({
    wasmUrl,
    width = 640,
    height = 400,
    memoryConfig = { initial: 108 },
    getImportObject,
    onInit,
    onStep,
    onKeyDown,
    onKeyUp,
    style = {}
}: WasmGameProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const instanceRef = useRef<WebAssembly.Instance | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const memoryRef = useRef<WebAssembly.Memory | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const memory = new WebAssembly.Memory(memoryConfig);
        memoryRef.current = memory;

        const importObject = getImportObject({ memory, canvas });

        const handleKeyDown = (event: KeyboardEvent) => {
            if (onKeyDown && instanceRef.current) {
                onKeyDown(event.keyCode, instanceRef.current);
            }
            event.preventDefault();
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            if (onKeyUp && instanceRef.current) {
                onKeyUp(event.keyCode, instanceRef.current);
            }
            event.preventDefault();
        };

        canvas.addEventListener('keydown', handleKeyDown);
        canvas.addEventListener('keyup', handleKeyUp);

        canvas.focus();
        const handleFocus = () => canvas.focus();
        canvas.addEventListener('click', handleFocus);

        const step = (timestamp: number) => {
            if (instanceRef.current && onStep) {
                onStep(instanceRef.current, timestamp);
            }
            animationFrameRef.current = window.requestAnimationFrame(step);
        };

        WebAssembly.instantiateStreaming(fetch(wasmUrl), importObject)
            .then(obj => {
                instanceRef.current = obj.instance;
                if (onInit) {
                    onInit(obj.instance);
                }
                animationFrameRef.current = window.requestAnimationFrame(step);
            })
            .catch(err => {
                console.error(`failed to instantiate wasm from ${wasmUrl}:`, err);
            });

        return () => {
            if (animationFrameRef.current) {
                window.cancelAnimationFrame(animationFrameRef.current);
            }
            canvas.removeEventListener('keydown', handleKeyDown);
            canvas.removeEventListener('keyup', handleKeyUp);
            canvas.removeEventListener('click', handleFocus);
        };
    }, [wasmUrl, memoryConfig, getImportObject, onInit, onStep, onKeyDown, onKeyUp]);

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            tabIndex={0}
            style={{
                width: `${width}px`,
                height: `${height}px`,
                display: 'block',
                outline: 'none',
                background: '#000',
                cursor: 'none',
                ...style
            }}
        >
            Game screen
        </canvas>
    );
};

export default WasmGame;
