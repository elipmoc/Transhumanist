import { SelectWinCardWindow } from "../views/selectWinCardWindow";
import { BindParams } from "../bindParams";
import { LayerTag } from "../../board";
import { SocketBinderList } from "../../socketBinderList";
import { WinActionCardData } from "../../../Share/winActionCardData";
import { ActionCardHover } from "../views/actionCardHover";

export function build(actionCardHover: ActionCardHover, bindParams: BindParams) {
    const selectWinCardWindow = new SelectWinCardWindow(bindParams.yamls.actionCardHash, bindParams.imgQueue);
    selectWinCardWindow.visible = false;
    //カードをクリックしたら発火
    selectWinCardWindow.onClickCard(cardName => {
        bindParams.socket.emit("selectWinCard", JSON.stringify(cardName));
        selectWinCardWindow.visible = false;
        bindParams.layerManager.update();
    });
    //カードがホバーされたら発火
    selectWinCardWindow.onMouseOveredCard(cardName => {
        actionCardHover.visible = true;
        actionCardHover.setYamlData(bindParams.yamls.actionCardHash[cardName], bindParams.imgQueue);
        bindParams.layerManager.update();
    });
    //カードのホバーが解除されたら発火
    selectWinCardWindow.onMouseOutedCard(_ => {
        actionCardHover.visible = false;
        actionCardHover.setYamlData(null, bindParams.imgQueue);
        bindParams.layerManager.update();
    });

    const winActionCardDataList = new SocketBinderList<WinActionCardData>("winActionCardDataList", bindParams.socket);
    winActionCardDataList.onUpdate(x => x.forEach(x =>
        selectWinCardWindow.setCardNumber(x)
    ));
    winActionCardDataList.onSetAt((_, x) =>
        selectWinCardWindow.setCardNumber(x)
    );

    bindParams.layerManager.add(LayerTag.PopUp2, selectWinCardWindow);
    return selectWinCardWindow;
}