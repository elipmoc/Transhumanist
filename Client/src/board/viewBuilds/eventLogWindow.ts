import { EventLogWindow } from "../views/eventLogWindow";
import { BindParams } from "../bindParams";
import { EventLogMessageForClient } from "../../Share/eventLogMessageForClient";
import { SocketBinder } from "../../socketBinder";
import { LayerTag } from "../../board";

//イベントログウインドウの生成
export function build(bindParams: BindParams) {
    const eventLogWindow = new EventLogWindow(bindParams.imgQueue);
    const eventLogMessage = new SocketBinder<EventLogMessageForClient>("eventLogMessage", bindParams.socket);
    eventLogMessage.onUpdate(msg => {
        eventLogWindow.setMessaage(msg);
        bindParams.layerManager.update();
    });
    bindParams.layerManager.add(LayerTag.Ui, eventLogWindow);
}