declare global {
    interface Window {
        YT: typeof YT;
        onYouTubeIframeAPIReady: () => void;
    }
}

export declare namespace YT {
    export class Player {
        constructor(elementId: string | HTMLElement, options: PlayerOptions);
        playVideo(): void;
        pauseVideo(): void;
        stopVideo(): void;
        seekTo(seconds: number, allowSeekAhead: boolean): void;
        setVolume(volume: number): void;
        getVolume(): number;
        mute(): void;
        unMute(): void;
        isMuted(): boolean;
        getDuration(): number;
        getCurrentTime(): number;
        getPlayerState(): number;
        destroy(): void;
    }

    export interface PlayerOptions {
        width?: string | number;
        height?: string | number;
        videoId?: string;
        playerVars?: PlayerVars;
        events?: Events;
    }

    export interface PlayerVars {
        autoplay?: 0 | 1;
        cc_load_policy?: 1;
        color?: 'red' | 'white';
        controls?: 0 | 1;
        disablekb?: 0 | 1;
        enablejsapi?: 0 | 1;
        end?: number;
        fs?: 0 | 1;
        hl?: string;
        iv_load_policy?: 1 | 3;
        list?: string;
        listType?: 'playlist' | 'search' | 'user_uploads';
        loop?: 0 | 1;
        modestbranding?: 1;
        origin?: string;
        playlist?: string;
        playsinline?: 0 | 1;
        rel?: 0 | 1;
        start?: number;
        widget_referrer?: string;
    }

    export interface Events {
        onReady?: (event: PlayerEvent) => void;
        onStateChange?: (event: OnStateChangeEvent) => void;
        onPlaybackQualityChange?: (event: PlayerEvent) => void;
        onPlaybackRateChange?: (event: PlayerEvent) => void;
        onError?: (event: OnErrorEvent) => void;
        onApiChange?: (event: PlayerEvent) => void;
    }

    export interface PlayerEvent {
        target: Player;
        data: any;
    }

    export interface OnStateChangeEvent extends PlayerEvent {
        data: PlayerState;
    }

    export interface OnErrorEvent extends PlayerEvent {
        data: number;
    }

    export enum PlayerState {
        UNSTARTED = -1,
        ENDED = 0,
        PLAYING = 1,
        PAUSED = 2,
        BUFFERING = 3,
        CUED = 5,
    }
}

let apiPromise: Promise<typeof YT> | null = null;

export const loadYouTubeApi = (): Promise<typeof YT> => {
    if (window.YT && window.YT.Player) {
        return Promise.resolve(window.YT);
    }

    if (apiPromise) {
        return apiPromise;
    }

    apiPromise = new Promise((resolve) => {
        const scriptUrl = 'https://www.youtube.com/iframe_api';

        const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);

        if (!existingScript) {
            const tag = document.createElement('script');
            tag.src = scriptUrl;
            tag.async = true;
            document.body.appendChild(tag);
        }

        const previousHandler = window.onYouTubeIframeAPIReady;

        window.onYouTubeIframeAPIReady = () => {
            if (previousHandler) previousHandler();
            resolve(window.YT);
        };
    });

    return apiPromise;
};
