import { useCallback, useMemo } from 'react';
import WasmGame from '../components/ui/WasmGame';

const Doom = () => {
    const doom_screen_width = 320 * 2;
    const doom_screen_height = 200 * 2;

    const readWasmString = useCallback((memory: WebAssembly.Memory, offset: number, length: number) => {
        const bytes = new Uint8Array(memory.buffer, offset, length);
        return new TextDecoder('utf8').decode(bytes);
    }, []);

    const appendOutput = useCallback((memory: WebAssembly.Memory, style: string) => {
        return function (offset: number, length: number) {
            const string = readWasmString(memory, offset, length);
            console.log(`Doom [${style}]:`, string);
        };
    }, [readWasmString]);

    const getMilliseconds = useCallback(() => {
        return performance.now();
    }, []);

    const drawCanvas = useCallback((memory: WebAssembly.Memory, canvas: HTMLCanvasElement, ptr: number) => {
        const doom_screen = new Uint8ClampedArray(memory.buffer, ptr, doom_screen_width * doom_screen_height * 4);
        const render_screen = new ImageData(doom_screen, doom_screen_width, doom_screen_height);
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.putImageData(render_screen, 0, 0);
        }
    }, [doom_screen_width, doom_screen_height]);

    const getImportObject = useCallback(({ memory, canvas }: { memory: WebAssembly.Memory; canvas: HTMLCanvasElement }) => {
        return {
            js: {
                js_console_log: appendOutput(memory, "log"),
                js_stdout: appendOutput(memory, "stdout"),
                js_stderr: appendOutput(memory, "stderr"),
                js_milliseconds_since_start: getMilliseconds,
                js_draw_screen: (ptr: number) => drawCanvas(memory, canvas, ptr),
            },
            env: {
                memory: memory
            }
        };
    }, [appendOutput, getMilliseconds, drawCanvas]);

    const doomKeyCode = useCallback((keyCode: number) => {
        switch (keyCode) {
            case 8: return 127;             // backspace
            case 17: return (0x80 + 0x1d);  // rctrl
            case 18: return (0x80 + 0x38);  // ralt
            case 37: return 0xac;           // left
            case 38: return 0xad;           // up
            case 39: return 0xae;           // right
            case 40: return 0xaf;           // down
            // wasd
            case 87: return 0xad;           // w -> up
            case 65: return 0xac;           // a -> left
            case 83: return 0xaf;           // s -> down
            case 68: return 0xae;           // d -> right
            // shooting
            case 80: return (0x80 + 0x1d);  // p -> rctrl (fire)
            default:
                if (keyCode >= 65 && keyCode <= 90) {
                    return keyCode + 32;    // ascii to lower case
                }
                if (keyCode >= 112 && keyCode <= 123) {
                    return keyCode + 75;    // f1
                }
                return keyCode;
        }
    }, []);

    const onKeyDown = useCallback((keyCode: number, instance: WebAssembly.Instance) => {
        if (instance) {
            (instance.exports.add_browser_event as Function)(0, doomKeyCode(keyCode));
        }
    }, [doomKeyCode]);

    const onKeyUp = useCallback((keyCode: number, instance: WebAssembly.Instance) => {
        if (instance) {
            (instance.exports.add_browser_event as Function)(1, doomKeyCode(keyCode));
        }
    }, [doomKeyCode]);

    const onStep = useCallback((instance: WebAssembly.Instance) => {
        (instance.exports.doom_loop_step as Function)();
    }, []);

    const onInit = useCallback((instance: WebAssembly.Instance) => {
        (instance.exports.main as Function)();
    }, []);

    const memoryConfig = useMemo(() => ({ initial: 108 }), []);

    return (
        <WasmGame
            wasmUrl="doom.wasm"
            width={640}
            height={400}
            memoryConfig={memoryConfig}
            getImportObject={getImportObject}
            onInit={onInit}
            onStep={onStep}
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
            style={{
                width: '100%',
                height: '100%',
                imageRendering: 'pixelated'
            }}
        />
    );
};

export default Doom;
