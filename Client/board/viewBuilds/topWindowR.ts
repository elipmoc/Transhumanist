import { BindParams } from "../bindParams";
import { SocketBinder } from "../../socketBinder";
import { Event } from "../../../Share/Yaml/eventYamlData";
import { TopWindowR } from "../views/topWindowR";

//右上のやつ生成
export function build(bindParams: BindParams) {
    bindParams.stage.addChild(new TopWindowR(bindParams.queue));
    const nowEvent = new SocketBinder<Event>("nowEvent", bindParams.socket);
    nowEvent.onUpdate(x => {
        alert(x);
    });
}