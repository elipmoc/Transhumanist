const mapping: { [index: string]: string } = {
    "bgm_level1": "https://elipmoc.github.io/audio/transhumanist_level1.mp3",
    "bgm_level2": "https://elipmoc.github.io/audio/transhumanist_level2.1.mp3",
    "bgm_level3": "https://elipmoc.github.io/audio/transhumanist_level3.1.mp3",
    "bgm_level4": "https://elipmoc.github.io/audio/transhumanist_level4.1.mp3",
    "bgm_level5": "https://elipmoc.github.io/audio/transhumanist_level5.1.mp3",
    "bgm_level6": "https://elipmoc.github.io/audio/transhumanist_level6.2.mp3"
};


export class SoundManager {


    static get SeVolume() { return this.seprops.volume; }
    static get BgmVolume() { return this.bgmprops.volume; }
    static set SeVolume(value) { this.seprops.volume = value; }
    static set BgmVolume(value) {
        this.bgmprops.volume = value;
        if (SoundManager.bgmInstance != null) {
            SoundManager.bgmInstance.volume = value;
        }
    }

    private static seprops: createjs.PlayPropsConfig = new createjs.PlayPropsConfig().set({ volume: 0.1 });
    private static bgmprops: createjs.PlayPropsConfig = new createjs.PlayPropsConfig().set({ volume: 0.1, loop: -1 });

    private static bgmInstance: createjs.AbstractSoundInstance = null;

    static bgmPlay(id: string) {
        if (SoundManager.bgmInstance != null) {
            SoundManager.bgmInstance.destroy();
            createjs.Sound.removeAllEventListeners();
        }
        createjs.Sound.registerSound(mapping[id], id);
        createjs.Sound.addEventListener("fileload", (e) => {
            SoundManager.bgmInstance = createjs.Sound.play(id, SoundManager.bgmprops);
        });
    }

    static sePlay(id: string) {
        createjs.Sound.play(id, SoundManager.seprops);
    }

    static bgmStop() {
        if (SoundManager.bgmInstance != null) {
            SoundManager.bgmInstance.destroy();
            SoundManager.bgmInstance = null;
        }
    }

}