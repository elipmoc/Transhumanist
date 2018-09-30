import { BindParams } from "./bindParams";
import { SocketBinder } from "../socketBinder";
import { SoundManager } from "../soundManager";
import { Event } from "../../Share/Yaml/eventYamlData";

export class BgmChanger{
    constructor(bindParams: BindParams) {
        const nowEvent = new SocketBinder<Event>("nowEvent", bindParams.socket);
        nowEvent.onUpdate(x => {
            if (x == null) return;
            SoundManager.bgmPlay("bgm_level" + x.level);
        });
    }
}