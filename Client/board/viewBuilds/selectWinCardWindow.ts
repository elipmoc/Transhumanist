import { SelectWinCardWindow } from "../views/selectWinCardWindow";
import { BindParams } from "../bindParams";
import { LayerTag } from "../../board";
import { SocketBinderList } from "../../socketBinderList";
import { WinActionCardData } from "../../../Share/winActionCardData";

export function build(bindParams: BindParams) {
    const selectWinCardWindow = new SelectWinCardWindow(bindParams.yamls.actionCardHash, bindParams.imgQueue);
    selectWinCardWindow.visible = false;
    //カードをクリックしたら発火
    selectWinCardWindow.cardOnClick((cardName) => {
        bindParams.socket.emit("selectWinCard", JSON.stringify(cardName));
        selectWinCardWindow.visible = false;
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