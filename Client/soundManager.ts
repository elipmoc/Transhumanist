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
        }
        SoundManager.bgmInstance = createjs.Sound.play(id, SoundManager.bgmprops);
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