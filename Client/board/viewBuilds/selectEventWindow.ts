import { SelectEventWindow } from "../views/selectEventWindow";
import { BindParams } from "../bindParams";
import { DiceData } from "../../../Share/diceData";
import { SocketBinder } from "../../socketBinder";
import { LayerTag } from "../../board";
import { GamePlayerCondition } from "../../../Share/gamePlayerCondition";

//イベントカードウインドウの生成
export function build(bindParams: BindParams) {
    const diceData = new SocketBinder<DiceData>("diceList" + bindParams.playerId, bindParams.socket);
    const selectEventWindow = new SelectEventWindow(()=>{bindParams.layerManager.update()});
    bindParams.layerManager.add(LayerTag.PopUp, selectEventWindow);

    const gamePlayerCondition =
        new SocketBinder<GamePlayerCondition>("gamePlayerCondition", bindParams.socket);
    gamePlayerCondition.onUpdate(cond => {
        if (cond != GamePlayerCondition.MyTurn)
            selectEventWindow.visible = true;
        else
            selectEventWindow.visible = false;
        bindParams.layerManager.update();
    });
}