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
import * as selectResourceWindow from "./viewBuilds/selectResourceWindow";
import * as unavailableDialog from "./viewBuilds/unavailableDialog";
import * as declareWarButton from "./viewBuilds/declareWarButton";
import * as chatForm from "./viewBuilds/chatForm";
import { LayerTag } from "../board";

//viewを生成してソケットと結びつける関数
export function viewBuild(bindParams: BindParams) {
    topWindowR.build(bindParams);
    warLine.build(bindParams);
    playerWindow.build(bindParams);
    playerResourceArea.build(bindParams);
    logWindow.build(bindParams);
    eventLogWindow.build(bindParams);
    const actionCardHover = new ActionCardHover(bindParams.yamls.resourceHash, 3);
    bindParams.layerManager.add(LayerTag.Hover, actionCardHover);
    playerBuildActionArea.build(actionCardHover, bindParams);
    handActionCardStorageWindow.build(actionCardHover, bindParams);
    turnFinishButton.build(bindParams);
    declareWarButton.build(bindParams);
    selectActionWindow.build(bindParams);
    selectDiceWindow.build(bindParams);
    selectResourceWindow.build(bindParams);
    unavailableDialog.build(bindParams);
    topWindowL.build(bindParams);
    chatForm.build(bindParams);
}