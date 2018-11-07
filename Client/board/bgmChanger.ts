import { BindParams } from "./bindParams";
import { SocketBinder } from "../socketBinder";
import { SoundManager } from "../soundManager";
import { Event } from "../../Share/Yaml/eventYamlData";

export class BgmChanger {
    private nowLevel: number = 0;
    constructor(bindParams: BindParams) {
        const nowEvent = new SocketBinder<Event>("nowEvent", bindParams.socket);
        nowEvent.onUpdate(x => {
            if (x == null) {
                SoundManager.bgmStop();
                this.nowLevel = 0;
                return;
            };
            if (this.nowLevel != x.level) {
                this.nowLevel = x.level;
                SoundManager.bgmPlay(x.level, x.level == 1 ? 0 : SoundManager.BgmPosition);
            }
        });
    }
}