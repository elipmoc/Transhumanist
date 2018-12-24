import { ActionCardHover } from "../views/actionCardHover";
import { RandGet } from "../../../Share/Yaml/actionCardYamlData";
import { BindParams } from "../bindParams";
import { SocketBinder } from "../../socketBinder";
import { SocketBinderList } from "../../socketBinderList";
import { SelectBuildActionData } from "../../../Share/selectBuildActionData";
import { PlayerBuildAreaBase } from "../views/bases/playerBuildAreaBase";
import * as playerBuildAreas from "../views/playerBuildActionAreas";
import { ConfirmDialog } from "../views/confirmDialog";
import { BuildOver } from "../../../Share/elementOver";
import { BuildActionSelectWindow } from "../views/buildActionUseSelectWindow";
import { GamePlayerCondition } from "../../../Share/gamePlayerCondition";
import { ThrowBuildAction } from "../../../Share/throwBuildAction";
import { ActionCardUseDecisionWindow, DialogResult } from "../views/handActionCard/actionCardUseDecisionWindow";
import { SelectResourceWindow } from "../views/selectResourceWindow";
import { CandidateResources } from "../../../Share/candidateResources";
import { HaveBuildActionCard } from "../../../Share/haveBuildActionCard";

import { LayerTag } from "../../board";
import { PlayerResourceAreaBase } from "../views/bases/playerResourceAreaBase";
//プレイヤーの設置アクション欄生成
export function build(actionCardHover: ActionCardHover, myResourceArea: PlayerResourceAreaBase, bindParams: BindParams) {
    const buildOver = new SocketBinder<BuildOver | null>("BuildOver", bindParams.socket);
    const buildthrowDialog = new ConfirmDialog();
    const resourceDialog = new ConfirmDialog();
    const gamePlayerCondition =
        new SocketBinder<GamePlayerCondition>("gamePlayerCondition", bindParams.socket);

    //使用しようとしている設置アクションカードのインデックス記録用
    let usingCardIndex: number;

    const buildActionUseDecision = new ActionCardUseDecisionWindow();
    buildActionUseDecision.visible = false;

    const selectResourceWindow = new SelectResourceWindow(4);
    selectResourceWindow.visible = false;

    const buildActionSelectWindow = new BuildActionSelectWindow();
    buildActionSelectWindow.visible = false;
    bindParams.layerManager.add(LayerTag.PopUp, buildActionSelectWindow);
    bindParams.layerManager.add(LayerTag.PopUp, buildthrowDialog);
    bindParams.layerManager.add(LayerTag.PopUp, resourceDialog);
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
                    card != null ? bindParams.yamls.buildActionCardHash[card.actionCardName].index : -1,
                    bindParams.imgQueue
                ));
            bindParams.layerManager.update();
        });
        buildActionKindList.onSetAt((iconId, card) => {
            const cardIndex =
                card != null ? bindParams.yamls.buildActionCardHash[card.actionCardName].index : -1;
            playerBuildActionAreaList[i].setResource(
                iconId, card, cardIndex, bindParams.imgQueue);
            bindParams.layerManager.update();
        });
        bindParams.layerManager.add(LayerTag.Ui, playerBuildActionAreaList[i]);
        playerBuildActionAreaList[i].onMouseOveredIcon(card => {
            actionCardHover.visible = true;
            actionCardHover.setYamlData(bindParams.yamls.buildActionCardHash[card.actionCardName], bindParams.imgQueue);
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
                buildActionUseDecision.visible = false;
                buildActionSelectWindow.visible = false;
                selectResourceWindow.visible = false;
                const cardData = bindParams.yamls.actionCardHash[cardIcon.Kind.actionCardName];
                usingCardIndex = cardIcon.IconId;
                switch (cardIcon.Kind.actionCardName) {
                    case "採掘施設":
                        const yamlData: RandGet = <RandGet>cardData.commands[0].body;
                        const selectResource: CandidateResources = {
                            number: yamlData.select_number,
                            resource_names: [yamlData.items[0].name, yamlData.items[1].name, yamlData.items[2].name, yamlData.items[3].name]
                        };
                        selectResourceWindow.setResource(selectResource, bindParams.yamls.resourceHash, bindParams.imgQueue);
                        selectResourceWindow.visible = true;
                        break;
                    case "加工施設": case "研究施設":
                        buildActionSelectWindow.setYaml(cardData, bindParams.imgQueue, bindParams.yamls.resourceHash);
                        buildActionSelectWindow.visible = true;
                        break;
                    case "印刷所":
                    case "治療施設":
                    case "ロボット工場":
                        buildActionUseDecision.CardName = cardIcon.Kind.actionCardName;
                        buildActionUseDecision.visible = true;
                        break;
                    case "地下シェルター":
                        resourceDialog.setMessage("保護対象のリソースを\n5個選んでください");
                        resourceDialog.visible = true;
                        myResourceArea.setSelectEnable();
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
            iconId: usingCardIndex,
            resourceIdList: [cardIcon.IconId],
            selectCommandNum: 0
        };
        bindParams.socket.emit("SelectBuildAction", JSON.stringify(selectBuildActionData));
        selectResourceWindow.visible = false;
        bindParams.layerManager.update();
    });
    selectResourceWindow.closeOnClick(() => {
        selectResourceWindow.visible = false;
        bindParams.layerManager.update();
    });

    buildActionSelectWindow.selectOnClick((index: number) => {
        const selectBuildActionData: SelectBuildActionData = {
            iconId: usingCardIndex,
            resourceIdList: <number[]>[],
            selectCommandNum: index
        };
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
                iconId: usingCardIndex,
                resourceIdList: <number[]>[],
                selectCommandNum: 0
            };
            bindParams.socket.emit("SelectBuildAction", JSON.stringify(selectBuildActionData));
        }
        buildActionUseDecision.visible = false;
        bindParams.layerManager.update();
    });

    gamePlayerCondition.onUpdate(cond => {
        if (cond != GamePlayerCondition.MyTurn) {
            buildActionUseDecision.visible = false;
            buildActionSelectWindow.visible = false;
            selectResourceWindow.visible = false;
            bindParams.layerManager.update();
        }
    });
    buildOver.onUpdate(x => {
        if (x.overCount != 0) {
            buildthrowDialog.setMessage(`${x.causeText} \n捨てる設置済みアクションカードを\n${x.overCount} 個選んでください`);
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
    resourceDialog.visible = false;
    resourceDialog.onClick(() => {
        resourceDialog.visible = false;
        const selectBuildActionData: SelectBuildActionData = {
            iconId: usingCardIndex,
            resourceIdList: myResourceArea.getSelectedAllIconId(),
            selectCommandNum: 0
        };
        myResourceArea.unSelectFrameVisible();
        bindParams.socket.emit("SelectBuildAction", JSON.stringify(selectBuildActionData));

    })
}
