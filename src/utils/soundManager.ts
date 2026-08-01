import wopn from '../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/wopn.mp3';
import wcls from '../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/wcls.mp3';
import wact from '../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/wact.mp3';
import wcol from '../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/wcol.mp3';
import wexp from '../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/wexp.mp3';
import mnuo from '../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/mnuo.mp3';
import mnuc from '../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/mnuc.mp3';
import mnui from '../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/mnui.mp3';
import mnus from '../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/mnus.mp3';
import btnp from '../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/btnp.mp3';
import btnr from '../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/btnr.mp3';
import fsel from '../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/fsel.mp3';
import flap from '../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/flap.mp3';
import fdrp from '../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/fdrp.mp3';
import sbap from '../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/sbap.mp3';
import sbar from '../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/sbar.mp3';
import sbth from '../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/sbth.mp3';
import sbth_attack from '../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/sbth attack.mp3';
import sbth_decay from '../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/sbth decay.mp3';
import sbtp from '../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/sbtp.mp3';
import popp from '../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/popp.mp3';
import ftrs from '../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/ftrs.mp3';

const soundFiles: Record<string, string> = {
    wopn, wcls, wact, wcol, wexp, mnuo, mnuc, mnui, mnus, btnp, btnr, fsel, flap, fdrp, sbap, sbar, sbth, sbth_attack, sbth_decay, sbtp, popp, ftrs
};

const soundVolumes: Record<string, number> = {
    wopn: 0.2,
    wcls: 0.2,
    wact: 0.15,
    wcol: 0.2,
    wexp: 0.2,
    mnuo: 0.2,
    mnuc: 0.2,
    mnui: 0.1,
    mnus: 0.2,
    btnp: 0.3,
    btnr: 0.3,
    fsel: 0.3,
    flap: 0.3,
    fdrp: 0.2,
    sbap: 0.15,
    sbar: 0.15,
    sbth: 0.15,
    sbth_attack: 0.15,
    sbth_decay: 0.09,
    sbtp: 0.15,
    popp: 0.3,
    ftrs: 0.15,
};

let ctx: AudioContext | null = null;
const soundBuffers: Record<string, AudioBuffer> = {};
const rawBuffers: Record<string, ArrayBuffer> = {};
const activeSources: Record<string, { source: AudioBufferSourceNode; gain: GainNode }> = {};

const getCtx = () => {
    if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    return ctx;
};

export const initAudioContext = () => {
    const ac = getCtx();
    if (ac.state === 'suspended') {
        ac.resume().catch(() => {});
    }
};

const ensureDecoded = async (ac: AudioContext, name: string) => {
    if (!soundBuffers[name] && rawBuffers[name]) {
        const bufferCopy = rawBuffers[name].slice(0);
        soundBuffers[name] = await ac.decodeAudioData(bufferCopy);
        delete rawBuffers[name];
    }
};

export const stopSound = (name: string) => {
    const active = activeSources[name];
    if (active) {
        try { active.source.stop(); } catch (_) { }
        delete activeSources[name];
    }
};

const lastPlayed: Record<string, number> = {};

export const playSound = async (name: string, { exclusive = false, loop = false, loopEnd = 0 } = {}) => {
    const now = Date.now();
    if (lastPlayed[name] && now - lastPlayed[name] < 50) return;
    
    if (name === 'wact') {
        const suppressors = ['btnp', 'sbap', 'sbtp', 'sbth_attack', 'mnuo', 'mnus'];
        if (suppressors.some(s => lastPlayed[s] && now - lastPlayed[s] < 150)) {
            return;
        }
    }
    
    lastPlayed[name] = now;

    const ac = getCtx();
    if (ac.state === 'suspended') await ac.resume();

    await ensureDecoded(ac, name);

    const buffer = soundBuffers[name];
    if (!buffer) return;

    if (exclusive) stopSound(name);

    const source = ac.createBufferSource();
    source.buffer = buffer;
    source.loop = loop;
    if (loop && loopEnd > 0) source.loopEnd = loopEnd;

    const gain = ac.createGain();
    gain.gain.value = soundVolumes[name] ?? 0.3;

    source.connect(gain);
    gain.connect(ac.destination);

    let ended = false;
    const handleEnded = () => {
        if (ended) return;
        ended = true;
        if (exclusive && activeSources[name]?.source === source) {
            delete activeSources[name];
        }
    };
    source.onended = handleEnded;

    source.start(0);

    if (exclusive) {
        activeSources[name] = { source, gain };
    }
};

export const preloadSounds = async () => {
    await Promise.all(
        Object.entries(soundFiles).map(async ([key, url]) => {
            try {
                const res = await fetch(url);
                rawBuffers[key] = await res.arrayBuffer();
            } catch (e) {
                console.error(`failed to load sound: ${key}`, e);
            }
        })
    );
};

export const cleanup = async () => {
    for (const name of Object.keys(activeSources)) {
        stopSound(name);
    }
    if (ctx) {
        try {
            await ctx.close();
        } catch (_) {}
        ctx = null;
    }
    for (const key in soundBuffers) {
        delete soundBuffers[key];
    }
    for (const key in rawBuffers) {
        delete rawBuffers[key];
    }
};

export default { playSound, stopSound, preloadSounds, cleanup };
