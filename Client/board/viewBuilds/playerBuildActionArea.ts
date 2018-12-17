import { ActionCardHover } from "../views/actionCardHover";
import { RandGet } from "../../../Share/Yaml/actionCardYamlData";
import { BindParams } from "../bindParams";
import { SocketBinder } from "../../socketBinder";
import { SocketBinderList } from "../../socketBinderList";
import { SelectBuildActionData } from "../../../Share/selectBuildActionData";
import { PlayerBuildAreaBase } from "../views/bases/playerBuildAreaBase";
import * as playerBuildAreas from "../views/playerBuildActionAreas";
import { BuildthrowDialog } from "../views/buildthrowDialog";
import { BuildOver } from "../../../Share/elementOver";
import { BuildActionSelectWindow } from "../views/buildActionUseSelectWindow";
import { GamePlayerCondition } from "../../../Share/gamePlayerCondition";
import { ThrowBuildAction } from "../../../Share/throwBuildAction";
import { ActionCardUseDecisionWindow, DialogResult } from "../views/handActionCard/actionCardUseDecisionWindow";
import { SelectResourceWindow } from "../views/selectResourceWindow";
import { CandidateResources } from "../../../Share/candidateResources";
import { HaveBuildActionCard } from "../../../Share/haveBuildActionCard";

import { LayerTag } from "../../board";
//プレイヤーの設置アクション欄生成
export function build(actionCardHover: ActionCardHover, bindParams: BindParams) {

    const buildOver = new SocketBinder<BuildOver | null>("BuildOver", bindParams.socket);
    const buildthrowDialog = new BuildthrowDialog();
    const gamePlayerCondition =
        new SocketBinder<GamePlayerCondition>("gamePlayerCondition", bindParams.socket);

    const buildActionUseDecision = new ActionCardUseDecisionWindow();
    buildActionUseDecision.visible = false;

    const selectResourceWindow = new SelectResourceWindow(4);
    selectResourceWindow.visible = false;

    const buildActionSelectWindow = new BuildActionSelectWindow();
    buildActionSelectWindow.visible = false;
    //const buildActionUseDecision = new BuildActionUseDecision();
    bindParams.layerManager.add(LayerTag.PopUp, buildActionSelectWindow);
    bindParams.layerManager.add(LayerTag.PopUp, buildthrowDialog);
    bindParams.layerManager.add(LayerTag.PopUp, selectResourceWindow);
    bindParams.layerManager.add(LayerTag.PopUp, buildActionUseDecision);

    const playerBuildActionAreaList: PlayerBuildAreaBase[] = [
        new playerBuildAreas.Player1BuildArea(bindParams.imgQueue),
        new playerBuildAreas.Player2BuildArea(bindParams.imgQueue),
        new playerBuildAreas.Player3BuildArea(bindParams.imgQueue),
        new playerBuildAreas.Player4BuildArea(bindParams.imgQueue)
    ];
    for (let i = 0; i < 4; i++) {
        const buildActionKindList = new SocketBinderList<HaveBuildActionCard | null>("BuildActionKindList" + (i + bindParams.playerId) % 4, bindParams.socket);
        buildActionKindList.onUpdate((list) => {
            list.forEach((card, iconId) =>
                playerBuildActionAreaList[i].setResource(
                    iconId, card,
                    card != null ? bindParams.yamls.buildActionCardHash[card.ActionCardName].index : -1,
                    bindParams.imgQueue
                ));
            bindParams.layerManager.update();
        });
        buildActionKindList.onSetAt((iconId, card) => {
            const cardIndex =
                card != null ? bindParams.yamls.buildActionCardHash[card.ActionCardName].index : -1;
            playerBuildActionAreaList[i].setResource(
                iconId, card, cardIndex, bindParams.imgQueue);
            bindParams.layerManager.update();
        });
        bindParams.layerManager.add(LayerTag.Ui, playerBuildActionAreaList[i]);
        playerBuildActionAreaList[i].onMouseOveredIcon(card => {
            actionCardHover.visible = true;
            actionCardHover.setYamlData(bindParams.yamls.buildActionCardHash[card.ActionCardName], bindParams.imgQueue);
            bindParams.layerManager.update();
        });
        playerBuildActionAreaList[i].onMouseOutedIcon(() => {
            actionCardHover.visible = false;
            actionCardHover.setYamlData(null, bindParams.imgQueue);
            bindParams.layerManager.update();
        });
    }
    playerBuildActionAreaList[0].onClickedIcon((cardIcon) => {
        if (gamePlayerCondition.Value == GamePlayerCondition.MyTurn) {
            if (!cardIcon.Kind.usedFlag) {
                switch (cardIcon.Kind.ActionCardName) {
                    case "採掘施設":
                        const yamlData: RandGet = <RandGet>bindParams.yamls.actionCardHash["採掘施設"].commands[0].body;
                        const selectResource: CandidateResources = {
                            number: yamlData.select_number,
                            resource_names: [yamlData.items[0].name, yamlData.items[1].name, yamlData.items[2].name, yamlData.items[3].name]
                        };
                        selectResourceWindow.CardIndex = cardIcon.IconId;
                        selectResourceWindow.setResource(selectResource, bindParams.yamls.resourceHash, bindParams.imgQueue);
                        selectResourceWindow.visible = true;
                        break;
                    case "加工施設": case "研究施設":
                        buildActionSelectWindow.CardIndex = cardIcon.IconId;
                        buildActionSelectWindow.setYaml(bindParams.yamls.actionCardHash["加工施設"], bindParams.imgQueue, bindParams.yamls.resourceHash);
                        buildActionSelectWindow.visible = true;
                        break;
                    case "印刷所":
                    case "治療施設":
                    case "ロボット工場":
                        buildActionUseDecision.CardIndex = cardIcon.IconId;
                        buildActionUseDecision.CardName = cardIcon.Kind.ActionCardName;
                        buildActionUseDecision.visible = true;
                        break;
                }
            }
        }
        else if (buildOver.Value.overCount != 0) cardIcon.selectFrameVisible = !cardIcon.selectFrameVisible;

        bindParams.layerManager.update();
    });

    //onClickの設定
    selectResourceWindow.onClickIcon((cardIcon) => {
        const selectBuildActionData: SelectBuildActionData = {
            iconId: selectResourceWindow.CardIndex,
            resourceId: cardIcon.IconId,
            selectNum: 0
        };
        bindParams.socket.emit("SelectBuildAction", JSON.stringify(selectBuildActionData));
        //playerBuildActionAreaList[0].setUsed(selectResourceWindow.CardIndex);
        selectResourceWindow.visible = false;
        bindParams.layerManager.update();
    });

    buildActionSelectWindow.selectOnClick((index: number) => {
        const selectBuildActionData: SelectBuildActionData = {
            iconId: buildActionSelectWindow.CardIndex,
            resourceId: null,
            selectNum: index
        };
        console.log(selectBuildActionData);
        bindParams.socket.emit("SelectBuildAction", JSON.stringify(selectBuildActionData));
        buildActionSelectWindow.visible = false;
        bindParams.layerManager.update();
    });
    buildActionSelectWindow.closeOnClick(() => {
        buildActionSelectWindow.visible = false;
        bindParams.layerManager.update();
    });


    buildActionUseDecision.onClicked((r) => {
        if (r == DialogResult.Yes) {
            const selectBuildActionData: SelectBuildActionData = {
                iconId: buildActionUseDecision.CardIndex,
                resourceId: null,
                selectNum: 0
            };
            bindParams.socket.emit("SelectBuildAction", JSON.stringify(selectBuildActionData));
        }
        buildActionUseDecision.visible = false;
        bindParams.layerManager.update();
    });

    gamePlayerCondition.onUpdate(cond => {
        if (cond != GamePlayerCondition.MyTurn) {
            buildActionUseDecision.visible = false;
        }
    });
    buildOver.onUpdate(x => {
        if (x.overCount != 0) {
            buildthrowDialog.setThrowBuildNum(x.overCount, x.causeText);
            buildthrowDialog.visible = true;
        } else {
            playerBuildActionAreaList[0].unSelectFrameVisible();
            buildthrowDialog.visible = false;
        }
        bindParams.layerManager.update();
    })
    buildthrowDialog.visible = false;
    buildthrowDialog.onClick(() => {
        const throwBuild: ThrowBuildAction = {
            buildActionList: playerBuildActionAreaList[0].getSelectedAllIconId()
        };
        bindParams.socket
            .emit("ThrowBuild", JSON.stringify(throwBuild));
    });
}
