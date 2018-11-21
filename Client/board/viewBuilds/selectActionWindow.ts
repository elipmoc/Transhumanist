import { SelectActionWindow } from "../views/selectActionWindow";
import { BindParams } from "../bindParams";
import { NumberOfActionCard } from "../../../Share/numberOfActionCard";
import { SocketBinder } from "../../socketBinder";
import { LayerTag } from "../../board";

//ドローするアクションカードのレベル選択ウインドウの生成
export function build(bindParams: BindParams) {
    const selectActionWindow = new SelectActionWindow(bindParams.imgQueue);
    selectActionWindow.onSelectedLevel(level => bindParams.socket.emit("selectActionCardLevel", level));
    bindParams.layerManager.add(LayerTag.PopUp, selectActionWindow);
    selectActionWindow.visible = false;
    const actionCardDrawPhase = new SocketBinder<boolean>("actionCardDrawPhase", bindParams.socket);
    actionCardDrawPhase.onUpdate(flag => {
        selectActionWindow.visible = flag;
        selectActionWindow.stage.update();
    });
    const numberOfActionCard = new SocketBinder<NumberOfActionCard[]>("numberOfActionCard", bindParams.socket);
    numberOfActionCard.onUpdate(numberOfActionCardList => {
        selectActionWindow.setNumberOfActionCard(numberOfActionCardList);
        selectActionWindow.stage.update();
    });
}