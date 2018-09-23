import { BindParams } from "../bindParams";
import { PlayerResourceAreaBase } from "../views/bases/playerResourceAreaBase";
import { ResourceHover } from "../views/resourceHover";
import { ResourceName } from "../../../Share/Yaml/resourceYamlData";
import { SelectResourceData } from "../../../Share/selectResourceData";
import { SocketBinderList } from "../../socketBinderList";
import * as playerResourceAreas from "../views/playerResourceAreas";
import { ResourceDialog } from "../views/resourceDialog";

//プレイヤーのリソース欄生成
export function build(resourceHover: ResourceHover, resourceDialog: ResourceDialog, bindParams: BindParams) {
    bindParams.stage.addChild(resourceHover);
    resourceHover.visible = false;

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
        cardIcon.selectFrameVisible = !cardIcon.selectFrameVisible;
        bindParams.stage.update();
        const selectResourceData: SelectResourceData = { iconId: cardIcon.IconId };
        bindParams.socket.emit("SelectResource", JSON.stringify(selectResourceData));
    });
    resourceDialog.setThrowResourceNum(5);
    resourceDialog.onClick(() => {
        bindParams.socket
            .emit("ThrowResource", JSON.stringify(playerResourceAreaList[0].getSelectedAllIconId()));
    });
}