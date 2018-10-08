import { BindParams } from "../bindParams";
import { SocketBinder } from "../../socketBinder";
import { Event } from "../../../Share/Yaml/eventYamlData";
import { NumberOfEventCard } from "../../../Share/numberOfEventCard";
import { TopWindowR } from "../views/topWindowR";
import { LayerTag } from "../../board";

//右上のやつ生成
export function build(bindParams: BindParams) {
    const topWindowR = new TopWindowR(bindParams.imgQueue);
    bindParams.layerManager.add(LayerTag.Ui, topWindowR);
    const numberOfEventCard = new SocketBinder<NumberOfEventCard>("numberOfEventCard", bindParams.socket);
    numberOfEventCard.onUpdate(x => {
        topWindowR.setEventNum(`${x.maxNumber - x.currentNumber} / ${x.maxNumber}`);
    });
    const nowEvent = new SocketBinder<Event>("nowEvent", bindParams.socket);
    nowEvent.onUpdate(x => {
        if (x == null) return;
        topWindowR.setEventName(x);
        bindParams.layerManager.update();
    });
}