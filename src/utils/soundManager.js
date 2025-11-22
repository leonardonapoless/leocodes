const soundFiles = {
    wopn: () => import('../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/wopn.mp3'),
    wcls: () => import('../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/wcls.mp3'),
    mnuo: () => import('../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/mnuo.mp3'),
    mnuc: () => import('../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/mnuc.mp3'),
    mnui: () => import('../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/mnui.mp3'),
    btnp: () => import('../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/btnp.mp3'),
    btnr: () => import('../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/btnr.mp3'),
    fsel: () => import('../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/fsel.mp3'),
    flap: () => import('../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/flap.mp3'),
    sbap: () => import('../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/sbap.mp3'),
    sbar: () => import('../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/sbar.mp3'),
    sbth: () => import('../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/sbth.mp3'),
    sbtp: () => import('../assets/audio/Mac-OS-9-Platinum-Sounds-main/mp3/sbtp.mp3'),
};

// volume settings for each sound 0.0 = silent, 1.0 = full volume
const soundVolumes = {
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

const audioCache = {};

export const playSound = async (soundName) => {
    try {
        if (!soundFiles[soundName]) {
            console.warn(`sound not found: ${soundName}`);
            return;
        }

        const volume = soundVolumes[soundName] ?? 0.3; // default to 0.3 

        // check cache first
        if (!audioCache[soundName]) {
            const module = await soundFiles[soundName]();
            audioCache[soundName] = new Audio(module.default);
            audioCache[soundName].volume = volume;
        }

        const audio = audioCache[soundName].cloneNode();
        audio.volume = volume;
        audio.play().catch(e => {
            console.debug(`sound play blocked: ${soundName}`, e);
        });
    } catch (error) {
        console.error(`error playing sound ${soundName}:`, error);
    }
};

export default { playSound };
