import { BindParams } from "../bindParams";
import { SocketBinder } from "../../socketBinder";
import { Event } from "../../../Share/Yaml/eventYamlData";
import { TopWindowR } from "../views/topWindowR";

//右上のやつ生成
export function build(bindParams: BindParams) {
    const topWindowR = new TopWindowR(bindParams.imgQueue);
    bindParams.stage.addChild(topWindowR);
    const nowEvent = new SocketBinder<Event>("nowEvent", bindParams.socket);
    nowEvent.onUpdate(x => {
        if (x == null) return;
        topWindowR.setEventName(x.name);
        bindParams.stage.update();
    });
}