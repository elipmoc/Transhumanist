import { SelectDiceWindow } from "../views/selectDiceWindow";
import { BindParams } from "../bindParams";
import { DiceData } from "../../../Share/diceData";
import { SocketBinder } from "../../socketBinder";
import { LayerTag } from "../../board";
import { GamePlayerCondition } from "../../../Share/gamePlayerCondition";

//ダイス選択ウインドウの生成
export function build(bindParams: BindParams) {
    const diceData = new SocketBinder<DiceData>("diceList" + bindParams.playerId, bindParams.socket);
    const selectDiceWindow = new SelectDiceWindow();
    selectDiceWindow.visible = false;
    selectDiceWindow.onSelectedDise((index: number) => {
        bindParams.socket.emit("selectDice", index);
    });
    diceData.onUpdate(diceData => {
        if (!diceData) return;
        selectDiceWindow.setDiceList(diceData.diceNumber);
        selectDiceWindow.setText(diceData.text);
    });
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