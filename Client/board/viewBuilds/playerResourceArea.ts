import { BindParams } from "../bindParams";
import { PlayerResourceAreaBase } from "../views/bases/playerResourceAreaBase";
import { ResourceHover } from "../views/resourceHover";
import { ResourceName } from "../../../Share/Yaml/resourceYamlData";
import { SelectResourceData } from "../../../Share/selectResourceData";
import { SocketBinderList } from "../../socketBinderList";
import * as playerResourceAreas from "../views/playerResourceAreas";
import { ConfirmDialog } from "../views/confirmDialog";
import { SocketBinder } from "../../socketBinder";
import { ResourceReserveArea } from "../views/resourceReserveArea";
import { ThrowResource } from "../../../Share/throwResource";
import { ResourceOver } from "../../../Share/elementOver";
import { LayerTag } from "../../board";
import { HaveResourceCard } from "../../..//Share/haveResourceCard";
import { SelectBelieverWindow } from "../views/selectBelieverWindow";
import { PnChangeData } from "../../../Share/pnChangeData";

//プレイヤーのリソース欄生成
export function build(bindParams: BindParams) {
    const resourceHover = new ResourceHover();
    const resourceDialog = new ConfirmDialog();
    bindParams.layerManager.add(LayerTag.PopUp, resourceDialog);
    bindParams.layerManager.add(LayerTag.Hover, resourceHover);
    resourceHover.visible = false;
    const resourceOver = new SocketBinder<ResourceOver | null>("ResourceOver", bindParams.socket);
    const churchAction = new SocketBinder<boolean>("churchAction", bindParams.socket);

    const playerResourceAreaList: PlayerResourceAreaBase[] = [
        new playerResourceAreas.Player1ResourceArea(bindParams.imgQueue),
        new playerResourceAreas.Player2ResourceArea(bindParams.imgQueue),
        new playerResourceAreas.Player3ResourceArea(bindParams.imgQueue),
        new playerResourceAreas.Player4ResourceArea(bindParams.imgQueue)
    ];
    for (let i = 0; i < 4; i++) {
        const resourceKindList = new SocketBinderList<HaveResourceCard | null>("ResourceKindList" + (i + bindParams.playerId) % 4, bindParams.socket);
        resourceKindList.onUpdate((list) => {
            list.forEach((resourceData, iconId) =>
                playerResourceAreaList[i].setResource(
                    iconId,
                    resourceData,
                    resourceData != null ? bindParams.yamls.resourceHash[resourceData.resourceCardName].index : -1,
                    bindParams.imgQueue));
            bindParams.layerManager.update();
        });
        resourceKindList.onSetAt((iconId: number, resourceData) => {
            playerResourceAreaList[i].setResource(
                iconId,
                resourceData,
                resourceData != null ? bindParams.yamls.resourceHash[resourceData.resourceCardName].index : -1,
                bindParams.imgQueue);
            bindParams.layerManager.update();
        });
        bindParams.layerManager.add(LayerTag.Ui, playerResourceAreaList[i]);
        playerResourceAreaList[i].onMouseOveredIcon(cardData => {
            resourceHover.visible = true;
            resourceHover.setYamlData(bindParams.yamls.resourceHash[cardData.resourceCardName], bindParams.imgQueue);
            bindParams.layerManager.update();
        });
        playerResourceAreaList[i].onMouseOutedIcon(() => {
            resourceHover.visible = false;
            resourceHover.setYamlData(null, bindParams.imgQueue);
            bindParams.layerManager.update();
        });
    }
    playerResourceAreaList[0].onClickIcon((cardIcon) => {
        bindParams.layerManager.update();
        const selectResourceData: SelectResourceData = { iconId: cardIcon.IconId };
        bindParams.socket.emit("SelectResource", JSON.stringify(selectResourceData));
    });

    const resourceReserveKindList = new SocketBinderList<ResourceName | null>("ResourceReserveKindList", bindParams.socket);
    const resourceReserveArea = new ResourceReserveArea();
    resourceReserveKindList.onUpdate((list) => {
        list.forEach((resourceCardName, iconId) =>
            resourceReserveArea.setResource(
                iconId,
                { resourceCardName, guardFlag: false },
                resourceCardName != null ? bindParams.yamls.resourceHash[resourceCardName].index : -1,
                bindParams.imgQueue));
        bindParams.layerManager.update();
    });
    resourceReserveKindList.onSetAt((iconId: number, resourceCardName: ResourceName) => {
        resourceReserveArea.setResource(
            iconId,
            { resourceCardName, guardFlag: false },
            bindParams.yamls.resourceHash[resourceCardName].index,
            bindParams.imgQueue);
        bindParams.layerManager.update();
    });
    resourceReserveArea.onMouseOveredIcon(cardData => {
        resourceHover.visible = true;
        resourceHover.setYamlData(bindParams.yamls.resourceHash[cardData.resourceCardName], bindParams.imgQueue);
        bindParams.layerManager.update();
    });
    resourceReserveArea.onMouseOutedIcon(() => {
        resourceHover.visible = false;
        resourceHover.setYamlData(null, bindParams.imgQueue);
        bindParams.layerManager.update();
    });
    resourceReserveArea.onClickIcon((cardIcon) => {
        bindParams.layerManager.update();
    });
    bindParams.layerManager.add(LayerTag.Ui, resourceReserveArea);

    resourceOver.onUpdate(x => {
        if (x.overCount != 0) {
            resourceDialog.setMessage(`${x.causeText}\n捨てるリソースを\n${x.overCount}個選んでください`);
            resourceDialog.visible = true;
            resourceReserveArea.setSelectEnable();
            playerResourceAreaList[0].setSelectEnable();
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

    churchAction.onUpdate(x => {
        if (x) {
            playerResourceAreaList[0].setSelectEnable();
        } else {
            playerResourceAreaList[0].unSelectFrameVisible();
        }
        selectBelieverWindow.visible = x;
        bindParams.layerManager.update();
    });

    const selectBelieverWindow = new SelectBelieverWindow();
    selectBelieverWindow.commandOnClick((pnId: number, adId: number) => {
        const pnChangeData: PnChangeData = {
            selected: playerResourceAreaList[0].getSelectedAllIconId(),
            pnId: pnId,
            adId: adId
        }
        bindParams.socket.emit("PnChangeData", JSON.stringify(pnChangeData));
    });
    selectBelieverWindow.visible = false;
    bindParams.layerManager.add(LayerTag.PopUp, selectBelieverWindow);

    return playerResourceAreaList[0];
}