import { SelectWinCardWindow } from "../views/selectWinCardWindow";
import { BindParams } from "../bindParams";
import { LayerTag } from "../../board";
import { NumberOfActionCard } from "../../../Share/numberOfActionCard";

export function build(bindParams: BindParams) {
    const selectWinCardWindow = new SelectWinCardWindow(bindParams.yamls.actionCardHash, bindParams.imgQueue);
    selectWinCardWindow.visible = false;
    //カードをクリックしたら発火
    selectWinCardWindow.cardOnClick((index) => {
        bindParams.socket.emit("selectedWinCard", index);
        selectWinCardWindow.visible = false;
        bindParams.layerManager.update();
    });

    //serverから来たとする-------------
    const numberOFActionCard: NumberOfActionCard[] = [
        { currentNumber: 4, maxNumber: 4, dustNumber: 0 },
        { currentNumber: 4, maxNumber: 4, dustNumber: 0 },
        { currentNumber: 2, maxNumber: 2, dustNumber: 0 }
    ];
    selectWinCardWindow.setCardNumber(numberOFActionCard);

    bindParams.layerManager.add(LayerTag.PopUp, selectWinCardWindow);
    return selectWinCardWindow;
}