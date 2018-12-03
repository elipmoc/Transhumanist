import { SelectResourceWindow } from "../views/selectResourceWindow";
import { BindParams } from "../bindParams";
import { LayerTag } from "../../board";
import { SocketBinder } from "../../socketBinder";
import { CandidateResources } from "../../../Share/candidateResources";

export function build(bindParams: BindParams) {
    //選択可能なリソースの最大数
    const maxLength: number = 6;
    const selectResourceWindow = new SelectResourceWindow(maxLength);
    selectResourceWindow.visible = false;

    //onClickの設定
    selectResourceWindow.onClickIcon((cardIcon) => {
        bindParams.socket.emit("selectedGetResourceId" + bindParams.playerId, JSON.stringify({ id: cardIcon.IconId }));
        bindParams.layerManager.update();
    });

    const candidateResources = new SocketBinder<CandidateResources>("candidateResources" + bindParams.playerId, bindParams.socket);
    candidateResources.onUpdate(data => {
        if (!data) return;
        if (data.number > 0) {
            selectResourceWindow.setResource(data, bindParams.yamls.resourceHash, bindParams.imgQueue);
            selectResourceWindow.visible = true;
        }
        else selectResourceWindow.visible = false;
        bindParams.layerManager.update();
    });
    bindParams.layerManager.add(LayerTag.PopUp, selectResourceWindow);
}