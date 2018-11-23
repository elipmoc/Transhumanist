import { BindParams } from "../bindParams";
import { PlayerResourceAreaBase } from "../views/bases/playerResourceAreaBase";
import { ResourceHover } from "../views/resourceHover";
import { ResourceName } from "../../../Share/Yaml/resourceYamlData";
import { SelectResourceData } from "../../../Share/selectResourceData";
import { SocketBinderList } from "../../socketBinderList";
import * as playerResourceAreas from "../views/playerResourceAreas";
import { ResourceDialog } from "../views/resourceDialog";
import { SocketBinder } from "../../socketBinder";
import { ResourceReserveArea } from "../views/resourceReserveArea";
import { ThrowResource } from "../../../Share/throwResource";
import { ResourceOver } from "../../../Share/elementOver";
import { LayerTag } from "../../board";

//プレイヤーのリソース欄生成
export function build(bindParams: BindParams) {
    const resourceHover = new ResourceHover();
    const resourceDialog = new ResourceDialog();
    bindParams.layerManager.add(LayerTag.PopUp, resourceDialog);
    bindParams.layerManager.add(LayerTag.Hover, resourceHover);
    resourceHover.visible = false;
    const resourceOver = new SocketBinder<ResourceOver | null>("ResourceOver", bindParams.socket);

    const playerResourceAreaList: PlayerResourceAreaBase[] = [
        new playerResourceAreas.Player1ResourceArea(bindParams.imgQueue),
        new playerResourceAreas.Player2ResourceArea(bindParams.imgQueue),
        new playerResourceAreas.Player3ResourceArea(bindParams.imgQueue),
        new playerResourceAreas.Player4ResourceArea(bindParams.imgQueue)
    ];
    for (let i = 0; i < 4; i++) {
        const resourceKindList = new SocketBinderList<ResourceName | null>("ResourceKindList" + (i + bindParams.playerId) % 4, bindParams.socket);
        resourceKindList.onUpdate((list) => {
            list.forEach((resourceName, iconId) =>
                playerResourceAreaList[i].setResource(
                    iconId,
                    resourceName,
                    resourceName != null ? bindParams.yamls.resourceHash[resourceName].index : -1,
                    bindParams.imgQueue));
            bindParams.layerManager.update();
        });
        resourceKindList.onSetAt((iconId: number, resourceName: ResourceName) => {
            playerResourceAreaList[i].setResource(
                iconId,
                resourceName,
                bindParams.yamls.resourceHash[resourceName].index,
                bindParams.imgQueue);
            bindParams.layerManager.update();
        });
        bindParams.layerManager.add(LayerTag.Ui, playerResourceAreaList[i]);
        playerResourceAreaList[i].onMouseOveredIcon(cardName => {
            resourceHover.visible = true;
            resourceHover.setYamlData(bindParams.yamls.resourceHash[cardName], bindParams.imgQueue);
            bindParams.layerManager.update();
        });
        playerResourceAreaList[i].onMouseOutedIcon(() => {
            resourceHover.visible = false;
            resourceHover.setYamlData(null, bindParams.imgQueue);
            bindParams.layerManager.update();
        });
    }
    playerResourceAreaList[0].onClickIcon((cardIcon) => {
        if (resourceOver.Value.overCount != 0)
            cardIcon.selectFrameVisible = !cardIcon.selectFrameVisible;
        bindParams.layerManager.update();
        const selectResourceData: SelectResourceData = { iconId: cardIcon.IconId };
        bindParams.socket.emit("SelectResource", JSON.stringify(selectResourceData));
    });

    const resourceReserveKindList = new SocketBinderList<ResourceName | null>("ResourceReserveKindList", bindParams.socket);
    const resourceReserveArea = new ResourceReserveArea();
    resourceReserveKindList.onUpdate((list) => {
        list.forEach((resourceName, iconId) =>
            resourceReserveArea.setResource(
                iconId,
                resourceName,
                resourceName != null ? bindParams.yamls.resourceHash[resourceName].index : -1,
                bindParams.imgQueue));
        bindParams.layerManager.update();
    });
    resourceReserveKindList.onSetAt((iconId: number, resourceName: ResourceName) => {
        resourceReserveArea.setResource(
            iconId,
            resourceName,
            bindParams.yamls.resourceHash[resourceName].index,
            bindParams.imgQueue);
        bindParams.layerManager.update();
    });
    resourceReserveArea.onMouseOveredIcon(cardName => {
        resourceHover.visible = true;
        resourceHover.setYamlData(bindParams.yamls.resourceHash[cardName], bindParams.imgQueue);
        bindParams.layerManager.update();
    });
    resourceReserveArea.onMouseOutedIcon(() => {
        resourceHover.visible = false;
        resourceHover.setYamlData(null, bindParams.imgQueue);
        bindParams.layerManager.update();
    });
    resourceReserveArea.onClickIcon((cardIcon) => {
        if (resourceOver.Value.overCount != 0)
            cardIcon.selectFrameVisible = !cardIcon.selectFrameVisible;
        bindParams.layerManager.update();
    });
    bindParams.layerManager.add(LayerTag.Ui, resourceReserveArea);

    resourceOver.onUpdate(x => {
        if (x.overCount != 0) {
            resourceDialog.setThrowResourceNum(x.overCount,x.causeText);
            resourceDialog.visible = true;
        } else {
            resourceReserveArea.unSelectFrameVisible();
            playerResourceAreaList[0].unSelectFrameVisible();
            resourceDialog.visible = false;
        }
        bindParams.layerManager.update();
    })
    resourceDialog.visible = false;
    resourceDialog.onClick(() => {
        const throwResource: ThrowResource = {
            resourceList: playerResourceAreaList[0].getSelectedAllIconId(),
            resourceReserveList: resourceReserveArea.getSelectedAllIconId()
        };
        bindParams.socket
            .emit("ThrowResource", JSON.stringify(throwResource));
    });
}