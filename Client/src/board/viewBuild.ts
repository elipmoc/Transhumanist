import { ActionCardHover } from "./views/actionCardHover";
import { BindParams } from "./bindParams";
import * as warLine from "./viewBuilds/warLine";
import * as playerWindow from "./viewBuilds/playerWindow";
import * as topWindowL from "./viewBuilds/topWindowL";
import * as topWindowR from "./viewBuilds/topWindowR";
import * as handActionCardStorageWindow from "./viewBuilds/handActionCardStorageWindow";
import * as eventLogWindow from "./viewBuilds/eventLogWindow";
import * as playerResourceArea from "./viewBuilds/playerResourceArea";
import * as playerBuildActionArea from "./viewBuilds/playerBuildActionArea";
import * as turnFinishButton from "./viewBuilds/turnFinishButton";
import * as selectActionWindow from "./viewBuilds/selectActionWindow";
import * as logWindow from "./viewBuilds/logWindow";
import * as selectDiceWindow from "./viewBuilds/selectDiceWindow";
import * as selectResourceWindowBuild from "./viewBuilds/selectResourceWindow";
import * as unavailableDialog from "./viewBuilds/unavailableDialog";
import * as declareWarButton from "./viewBuilds/declareWarButton";
import * as chatForm from "./viewBuilds/chatForm";
import * as nowEventDialog from "./viewBuilds/nowEventDialog";
import * as selectEventWindow from "./viewBuilds/selectEventWindow";

import { LayerTag } from "../board";
import { ResourceHover } from "./views/resourceHover";
import { SelectResourceWindow } from "./views/selectResourceWindow";

//viewを生成してソケットと結びつける関数
export function viewBuild(bindParams: BindParams) {
    topWindowR.build(bindParams);
    warLine.build(bindParams);
    playerWindow.build(bindParams);
    const resourceHover = new ResourceHover();
    bindParams.layerManager.add(LayerTag.Hover, resourceHover);
    resourceHover.visible = false;
    const myPlayerResourceArea = playerResourceArea.build(bindParams, resourceHover);
    logWindow.build(bindParams);
    eventLogWindow.build(bindParams);
    const actionCardHover = new ActionCardHover(bindParams.yamls.resourceHash, 3);
    bindParams.layerManager.add(LayerTag.Hover, actionCardHover);
    selectResourceWindowBuild.build(bindParams, resourceHover);
    playerBuildActionArea.build(actionCardHover, myPlayerResourceArea, resourceHover, bindParams);
    handActionCardStorageWindow.build(actionCardHover, bindParams);
    turnFinishButton.build(bindParams);
    declareWarButton.build(bindParams);
    selectActionWindow.build(actionCardHover, bindParams);
    selectDiceWindow.build(bindParams);
    unavailableDialog.build(bindParams);
    topWindowL.build(bindParams);
    chatForm.build(bindParams);
    nowEventDialog.build(bindParams);
    selectEventWindow.build(bindParams);
}