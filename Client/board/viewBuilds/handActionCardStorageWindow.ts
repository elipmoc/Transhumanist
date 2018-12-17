import { HandActionCardStorageWindow } from "../views/handActionCard/handActionStorageWindow";
import { ActionCardHover } from "../views/actionCardHover";
import { ActionCardName } from "../../../Share/Yaml/actionCardYamlData";
import { ActionCardUseDecisionWindow, DialogResult } from "../views/handActionCard/actionCardUseDecisionWindow";
import { BindParams } from "../bindParams";
import { SocketBinderList } from "../../socketBinderList";
import { LayerTag } from "../../board";
import { GamePlayerCondition } from "../../../Share/gamePlayerCondition";
import { SocketBinder } from "../../socketBinder";

//手札ウインドウの生成
export function build(actionCardHover: ActionCardHover, bindParams: BindParams) {
    const decision = new ActionCardUseDecisionWindow(); //siyousimasuka
    const actionCardList = new SocketBinderList<ActionCardName | null>("actionCardList", bindParams.socket); //tehudanorisuto
    const actionStorageWindow = new HandActionCardStorageWindow(actionCardHover, bindParams.imgQueue); //tehudanobyouga saidai5
    const gamePlayerCondition = new SocketBinder<GamePlayerCondition>("gamePlayerCondition", bindParams.socket);

    actionCardList.onUpdate(list => { //zenbukousin
        list.forEach((actionCardName, index) =>
            actionStorageWindow.setActionCard(index, bindParams.yamls.actionCardHash[actionCardName])
        );
        bindParams.layerManager.update();
    });
    actionCardList.onSetAt((index, actionCardName) => { //hitotunokousin
        actionStorageWindow.setActionCard(index, bindParams.yamls.actionCardHash[actionCardName]);
        bindParams.layerManager.update();
    });
    decision.visible = false;
    decision.onClicked((r) => { //osaretatoki
        if (r == DialogResult.Yes) {
            bindParams.socket.emit("useActionCardIndex", decision.CardIndex);
        }
        decision.visible = false;
        bindParams.layerManager.update();
    });
    actionStorageWindow.onSelectedCard((index, name) => {
        if (gamePlayerCondition.Value == GamePlayerCondition.MyTurn) {
          decision.CardName = name;
          decision.CardIndex = index;
          decision.visible = true;
          bindParams.layerManager.update(); //gamennobyougakousin
        }
    });

    bindParams.layerManager.add(LayerTag.PopUp, decision);
    bindParams.layerManager.add(LayerTag.Ui, actionStorageWindow);
}