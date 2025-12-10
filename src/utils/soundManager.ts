import wopn from '../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/wopn.mp3';
import wcls from '../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/wcls.mp3';
import mnuo from '../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/mnuo.mp3';
import mnuc from '../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/mnuc.mp3';
import mnui from '../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/mnui.mp3';
import btnp from '../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/btnp.mp3';
import btnr from '../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/btnr.mp3';
import fsel from '../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/fsel.mp3';
import flap from '../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/flap.mp3';
import sbap from '../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/sbap.mp3';
import sbar from '../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/sbar.mp3';
import sbth from '../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/sbth.mp3';
import sbtp from '../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/sbtp.mp3';

const soundFiles: Record<string, string> = {
    wopn, wcls, mnuo, mnuc, mnui, btnp, btnr, fsel, flap, sbap, sbar, sbth, sbtp
};

const soundVolumes: Record<string, number> = {
    wopn: 0.2,
    wcls: 0.2,
    mnuo: 0.2,
    mnuc: 0.2,
    mnui: 0.1,
    btnp: 0.3,
    btnr: 0.3,
    fsel: 0.3,
    flap: 0.3,
    sbap: 0.15,
    sbar: 0.15,
    sbth: 0.15,
    sbtp: 0.15,
};

const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
const ctx = new AudioContextClass();
const soundBuffers: Record<string, AudioBuffer> = {};

export const playSound = async (name: string) => {
    if (ctx.state === 'suspended') {
        await ctx.resume();
    }

    const buffer = soundBuffers[name];
    if (!buffer) return;

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const gainNode = ctx.createGain();
    gainNode.gain.value = soundVolumes[name] ?? 0.3;

    source.connect(gainNode);
    gainNode.connect(ctx.destination);

    source.start(0);
};

export const preloadSounds = async () => {
    const promises = Object.entries(soundFiles).map(async ([key, url]) => {
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const decodedBuffer = await ctx.decodeAudioData(arrayBuffer);
            soundBuffers[key] = decodedBuffer;
        } catch (error) {
            console.error(`failed to load sound: ${key}`, error);
        }
    });

    await Promise.all(promises);
};

export default { playSound, preloadSounds };
