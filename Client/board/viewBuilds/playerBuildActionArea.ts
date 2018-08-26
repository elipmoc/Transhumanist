import { ActionCardHover } from "../views/actionCardHover";
import { ActionCardName } from "../../../Share/Yaml/actionCardYamlData";
import { BindParams } from "../bindParams";
import { SocketBinderList } from "../../socketBinderList";
import { SelectBuildActionData } from "../../../Share/selectBuildActionData";
import { PlayerBuildBase } from "../views/viewBase";
import * as view from "../views/view";

//プレイヤーの設置アクション欄生成
export function build(actionCardHover: ActionCardHover, bindParams: BindParams) {
    const playerBuildActionAreaList: PlayerBuildBase[] = [
        new view.Player1Build(bindParams.queue),
        new view.Player2Build(bindParams.queue),
        new view.Player3Build(bindParams.queue),
        new view.Player4Build(bindParams.queue)
    ];
    for (let i = 0; i < 4; i++) {
        const buildActionKindList = new SocketBinderList<ActionCardName>("BuildActionKindList" + (i + bindParams.playerId) % 4, bindParams.socket);
        buildActionKindList.onUpdate((list) => {
            list.forEach((cardName, iconId) =>
                playerBuildActionAreaList[i].setResource(
                    iconId, cardName,
                    bindParams.yamls.buildActionCardHash[cardName].index,
                    bindParams.queue
                ));
            bindParams.stage.update();
        });
        buildActionKindList.onSetAt((iconId: number, cardName: ActionCardName) => {
            playerBuildActionAreaList[i].setResource(
                iconId, cardName, bindParams.yamls.buildActionCardHash[cardName].index, bindParams.queue);
            bindParams.stage.update();
        });
        bindParams.stage.addChild(playerBuildActionAreaList[i]);
        playerBuildActionAreaList[i].onMouseOveredIcon(cardName => {
            actionCardHover.visible = true;
            actionCardHover.setYamlData(bindParams.yamls.buildActionCardHash[cardName], bindParams.queue);
            bindParams.stage.update();
        });
        playerBuildActionAreaList[i].onMouseOutedIcon(() => {
            actionCardHover.visible = false;
            actionCardHover.setYamlData(null, bindParams.queue);
            bindParams.stage.update();
        });
    }
    playerBuildActionAreaList[0].onClickedIcon((iconId, actionCardName) => {
        const selectBuildActionData: SelectBuildActionData = { iconId };
        bindParams.socket.emit("SelectBuildAction", JSON.stringify(selectBuildActionData));
    });
}