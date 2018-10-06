import { SelectActionWindow } from "../views/selectActionWindow";
import { BindParams } from "../bindParams";
import { NumberOfActionCard } from "../../../Share/numberOfActionCard";
import { SocketBinder } from "../../socketBinder";

//ドローするアクションカードのレベル選択ウインドウの生成
export function build(bindParams: BindParams) {
    const selectActionWindow = new SelectActionWindow(bindParams.imgQueue);
    selectActionWindow.onSelectedLevel(level => bindParams.socket.emit("selectActionCardLevel", level));
    bindParams.stage.addChild(selectActionWindow);
    selectActionWindow.visible = false;
    const actionCardDrawPhase = new SocketBinder<boolean>("actionCardDrawPhase", bindParams.socket);
    actionCardDrawPhase.onUpdate(flag => {
        selectActionWindow.visible = flag;
        bindParams.stage.update();
    });
    const numberOfActionCard = new SocketBinder<NumberOfActionCard[]>("numberOfActionCard", bindParams.socket);
    numberOfActionCard.onUpdate(numberOfActionCardList => {
        selectActionWindow.setNumberOfActionCard(numberOfActionCardList);
        bindParams.stage.update();
    });
}