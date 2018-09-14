import { HandActionCardStorageWindow } from "../views/handActionCard/handActionStorageWindow";
import { ActionCardHover } from "../views/actionCardHover";
import { ActionCardName } from "../../../Share/Yaml/actionCardYamlData";
import { ActionCardUseDecisionWindow, DialogResult } from "../views/handActionCard/actionCardUseDecisionWindow";
import { BindParams } from "../bindParams";
import { SocketBinderList } from "../../socketBinderList";

//手札ウインドウの生成
export function build(actionCardHover: ActionCardHover, decision: ActionCardUseDecisionWindow, bindParams: BindParams) {
    const actionCardList = new SocketBinderList<ActionCardName | null>("actionCardList" + bindParams.playerId, bindParams.socket);
    const actionStorageWindow = new HandActionCardStorageWindow(actionCardHover, bindParams.imgQueue);
    actionCardList.onUpdate(list => {
        list.forEach((actionCardName, index) =>
            actionStorageWindow.setActionCard(index, bindParams.yamls.actionCardHash[actionCardName])
        );
        bindParams.stage.update();
    });
    actionCardList.onSetAt((index, actionCardName) => {
        actionStorageWindow.setActionCard(index, bindParams.yamls.actionCardHash[actionCardName]);
        bindParams.stage.update();
    });
    decision.visible = false;
    decision.onClicked((r) => {
        if (r == DialogResult.Yes) {
            bindParams.socket.emit("useActionCardIndex", decision.CardIndex);
        }
        decision.visible = false;
        bindParams.stage.update();
    });
    actionStorageWindow.onSelectedCard((index, name) => {
        decision.CardName = name;
        decision.CardIndex = index;
        decision.visible = true;
        bindParams.stage.update();
    });

    bindParams.stage.addChild(actionStorageWindow);
}