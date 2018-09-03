import { SelectDiceWindow } from "../views/selectDiceWindow";
import { BindParams } from "../bindParams";
import { DiceNumber } from "../../../Share/diceNumber";
import { SocketBinder } from "../../socketBinder";

//ダイス選択ウインドウの生成
export function build(bindParams: BindParams) {
    const diceIconList = new SocketBinder<DiceNumber[]>("diceList" + bindParams.playerId, bindParams.socket);
    const selectDiceWindow = new SelectDiceWindow();
    selectDiceWindow.onSelectedDise((index: number) => {
        bindParams.socket.emit("selectDice", index);
    });
    diceIconList.onUpdate(diceList => selectDiceWindow.setDiceList(diceList));
    bindParams.stage.addChild(selectDiceWindow);
    selectDiceWindow.visible = false;
}