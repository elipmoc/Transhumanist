import { SelectEventWindow } from "../views/selectEventWindow";
import { BindParams } from "../bindParams";
import { FutureForecastEventData } from "../../Share/futureForecastEventData";
import { SocketBinder } from "../../socketBinder";
import { LayerTag } from "../../board";
import { GamePlayerCondition } from "../../Share/gamePlayerCondition";

//イベントカードウインドウの生成
export function build(bindParams: BindParams) {
    const futureForecastGetEvents = new SocketBinder<FutureForecastEventData>("futureForecastGetEvents", bindParams.socket);
    const selectEventWindow = new SelectEventWindow(() => { bindParams.layerManager.update() });
    bindParams.layerManager.add(LayerTag.PopUp, selectEventWindow);
    selectEventWindow.visible = false;
    futureForecastGetEvents.onUpdate(data => {
        if (data == undefined) return;
        selectEventWindow.setData(data.eventNameList);
        selectEventWindow.visible = true;
        bindParams.layerManager.update();
    });

    selectEventWindow.submitOnClick((list: string[]) => {
        bindParams.socket.emit("futureForecastSwapEvents", JSON.stringify({ eventNameList: list }));
        selectEventWindow.visible = false;
        bindParams.layerManager.update();
    });

    const gamePlayerCondition =
        new SocketBinder<GamePlayerCondition>("gamePlayerCondition", bindParams.socket);
    gamePlayerCondition.onUpdate(cond => {
        selectEventWindow.visible = false;
        bindParams.layerManager.update();
    });
}