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

const audioCache: Record<string, HTMLAudioElement> = {}

const getAudio = (name: string) => {
    if (audioCache[name]) return audioCache[name]

    if (soundFiles[name]) {
        audioCache[name] = new Audio(soundFiles[name])
    }

    return audioCache[name]
}

export const playSound = (name: string) => {
    try {
        const base = getAudio(name)
        if (!base) return

        const audio = base.cloneNode() as HTMLAudioElement
        audio.volume = soundVolumes[name] ?? 0.3

        audio.play().catch(() => {
        })
    } catch (err) {
        console.error('play error:', name, err)
    }
}

export const preloadSounds = () => {
    if (!window.Worker) {
        Object.keys(soundFiles).forEach(key => {
            const audio = getAudio(key)
            if (audio) audio.load()
        })
        return
    }

    const worker = new Worker(new URL('./audioWorker.ts', import.meta.url), { type: 'module' })

    worker.onmessage = ({ data }) => {
        const { key, blob } = data
        const audio = new Audio(URL.createObjectURL(blob))
        audioCache[key] = audio
        audio.load()
    }

    worker.postMessage(soundFiles)
}

export default { playSound, preloadSounds }
