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

//プレイヤーのリソース欄生成
export function build(resourceHover: ResourceHover, resourceDialog: ResourceDialog, bindParams: BindParams) {
    bindParams.stage.addChild(resourceHover);
    resourceHover.visible = false;
    const resourceOver = new SocketBinder<number | null>("ResourceOver", bindParams.socket);

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
            bindParams.stage.update();
        });
        resourceKindList.onSetAt((iconId: number, resourceName: ResourceName) => {
            playerResourceAreaList[i].setResource(
                iconId,
                resourceName,
                bindParams.yamls.resourceHash[resourceName].index,
                bindParams.imgQueue);
            bindParams.stage.update();
        });
        bindParams.stage.addChild(playerResourceAreaList[i]);
        playerResourceAreaList[i].onMouseOveredIcon(cardName => {
            resourceHover.visible = true;
            resourceHover.setYamlData(bindParams.yamls.resourceHash[cardName], bindParams.imgQueue);
            bindParams.stage.update();
        });
        playerResourceAreaList[i].onMouseOutedIcon(() => {
            resourceHover.visible = false;
            resourceHover.setYamlData(null, bindParams.imgQueue);
            bindParams.stage.update();
        });
    }
    playerResourceAreaList[0].onClickIcon((cardIcon) => {
        if (resourceOver.Value != 0)
            cardIcon.selectFrameVisible = !cardIcon.selectFrameVisible;
        bindParams.stage.update();
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
        bindParams.stage.update();
    });
    resourceReserveKindList.onSetAt((iconId: number, resourceName: ResourceName) => {
        resourceReserveArea.setResource(
            iconId,
            resourceName,
            bindParams.yamls.resourceHash[resourceName].index,
            bindParams.imgQueue);
        bindParams.stage.update();
    });
    resourceReserveArea.onMouseOveredIcon(cardName => {
        resourceHover.visible = true;
        resourceHover.setYamlData(bindParams.yamls.resourceHash[cardName], bindParams.imgQueue);
        bindParams.stage.update();
    });
    resourceReserveArea.onMouseOutedIcon(() => {
        resourceHover.visible = false;
        resourceHover.setYamlData(null, bindParams.imgQueue);
        bindParams.stage.update();
    });
    resourceReserveArea.onClickIcon((cardIcon) => {
        if (resourceOver.Value != 0)
            cardIcon.selectFrameVisible = !cardIcon.selectFrameVisible;
        bindParams.stage.update();
    });
    bindParams.stage.addChild(resourceReserveArea);

    resourceOver.onUpdate(x => {
        if (x != 0) {
            resourceDialog.setThrowResourceNum(x);
            resourceDialog.visible = true;
        } else {
            resourceReserveArea.unSelectFrameVisible();
            playerResourceAreaList[0].unSelectFrameVisible();
            resourceDialog.visible = false;
        }
        bindParams.stage.update();
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