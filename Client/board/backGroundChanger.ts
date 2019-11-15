import { BindParams } from "./bindParams";
import { SocketBinder } from "../socketBinder";
import { BackGround } from "./views/backGround";
import { Event } from "../Share/Yaml/eventYamlData";

export class BackGroundChanger extends createjs.Container {
    private background: BackGround;

    constructor(bindParams: BindParams) {
        super();
        this.background = new BackGround();
        this.addChild(this.background);
        this.background.setBg("bg_level1");
        const nowEvent = new SocketBinder<Event>("nowEvent", bindParams.socket);
        nowEvent.onUpdate(x => {
            if (x == null) return;
            this.background.setBg("bg_level" + x.level);
        });
    }
}