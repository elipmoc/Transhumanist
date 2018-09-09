import { BindParams } from "../bindParams";
import { PlayerResourceAreaBase } from "../views/bases/playerResourceAreaBase";
import { ResourceHover } from "../views/resourceHover";
import { ResourceName } from "../../../Share/Yaml/resourceYamlData";
import { SelectResourceData } from "../../../Share/selectResourceData";
import { SocketBinderList } from "../../socketBinderList";
import * as playerResourceAreas from "../views/playerResourceAreas";

//プレイヤーのリソース欄生成
export function build(resourceHover: ResourceHover, bindParams: BindParams) {
    bindParams.stage.addChild(resourceHover);
    resourceHover.visible = false;

    const playerResourceAreaList: PlayerResourceAreaBase[] = [
        new playerResourceAreas.Player1ResourceArea(bindParams.queue),
        new playerResourceAreas.Player2ResourceArea(bindParams.queue),
        new playerResourceAreas.Player3ResourceArea(bindParams.queue),
        new playerResourceAreas.Player4ResourceArea(bindParams.queue)
    ];
    for (let i = 0; i < 4; i++) {
        const resourceKindList = new SocketBinderList<ResourceName | null>("ResourceKindList" + (i + bindParams.playerId) % 4, bindParams.socket);
        resourceKindList.onUpdate((list) => {
            list.forEach((resourceName, iconId) =>
                playerResourceAreaList[i].setResource(
                    iconId,
                    resourceName,
                    resourceName != null ? bindParams.yamls.resourceHash[resourceName].index : -1,
                    bindParams.queue));
            bindParams.stage.update();
        });
        resourceKindList.onSetAt((iconId: number, resourceName: ResourceName) => {
            playerResourceAreaList[i].setResource(
                iconId,
                resourceName,
                bindParams.yamls.resourceHash[resourceName].index,
                bindParams.queue);
        });
        bindParams.stage.addChild(playerResourceAreaList[i]);
        playerResourceAreaList[i].onMouseOveredIcon(cardName => {
            resourceHover.visible = true;
            resourceHover.setYamlData(bindParams.yamls.resourceHash[cardName], bindParams.queue);
            bindParams.stage.update();
        });
        playerResourceAreaList[i].onMouseOutedIcon(() => {
            resourceHover.visible = false;
            resourceHover.setYamlData(null, bindParams.queue);
            bindParams.stage.update();
        });
    }
    playerResourceAreaList[0].onClickIcon((iconId, _) => {
        const selectResourceData: SelectResourceData = { iconId };
        bindParams.socket.emit("SelectResource", JSON.stringify(selectResourceData));
    });
}