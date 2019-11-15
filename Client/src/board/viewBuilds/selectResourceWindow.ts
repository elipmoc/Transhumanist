import { SelectResourceWindow } from "../views/selectResourceWindow";
import { BindParams } from "../bindParams";
import { LayerTag } from "../../board";
import { SocketBinder } from "../../socketBinder";
import { CandidateResources } from "../../../Share/candidateResources";
import { ResourceHover } from "../views/resourceHover";

export function build(bindParams: BindParams, resourceHover: ResourceHover) {
    //選択可能なリソースの最大数
    const maxLength: number = 6;
    const selectResourceWindow = new SelectResourceWindow(maxLength);
    selectResourceWindow.visible = false;

    //onClickの設定
    selectResourceWindow.onClickIcon((cardIcon) => {
        bindParams.socket.emit("selectedGetResourceId", JSON.stringify({ id: cardIcon.IconId }));
        bindParams.layerManager.update();
    });

    //iconをホバーした時の処理
    selectResourceWindow.onMouseOveredIcon(cardData => {
        resourceHover.visible = true;
        resourceHover.setYamlData(bindParams.yamls.resourceHash[cardData.resourceCardName], bindParams.imgQueue);
        bindParams.layerManager.update();
    });
    selectResourceWindow.onMouseOutedIcon(() => {
        resourceHover.visible = false;
        resourceHover.setYamlData(null, bindParams.imgQueue);
        bindParams.layerManager.update();
    });

    const candidateResources = new SocketBinder<CandidateResources>("candidateResources", bindParams.socket);
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
    return selectResourceWindow;
}