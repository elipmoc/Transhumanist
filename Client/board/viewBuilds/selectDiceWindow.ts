import { SelectDiceWindow } from "../views/selectDiceWindow";
import { BindParams } from "../bindParams";
import { DiceNumber } from "../../../Share/diceNumber";
import { SocketBinder } from "../../socketBinder";
import { LayerTag } from "../../board";
import { GamePlayerCondition } from "../../../Share/gamePlayerCondition";

//ダイス選択ウインドウの生成
export function build(bindParams: BindParams) {
    const diceIconList = new SocketBinder<DiceNumber[]>("diceList" + bindParams.playerId, bindParams.socket);
    const selectDiceWindow = new SelectDiceWindow();
    selectDiceWindow.onSelectedDise((index: number) => {
        bindParams.socket.emit("selectDice", index);
    });
    diceIconList.onUpdate(diceList => selectDiceWindow.setDiceList(diceList));
    bindParams.layerManager.add(LayerTag.PopUp, selectDiceWindow);
    const gamePlayerCondition =
        new SocketBinder<GamePlayerCondition>("gamePlayerCondition", bindParams.socket);
    gamePlayerCondition.onUpdate(cond => {
        if (cond == GamePlayerCondition.Dice)
            selectDiceWindow.visible = true;
        else
            selectDiceWindow.visible = false;
        selectDiceWindow.stage.update();

    });
}