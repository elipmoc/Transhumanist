import { ActionCardHover } from "./views/actionCardHover";
import { ResourceHover } from "./views/resourceHover";
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
import * as declareWarButton from "./viewBuilds/declareWarButton";
import { ActionCardUseDecisionWindow } from "./views/handActionCard/actionCardUseDecisionWindow";
import { ResourceDialog } from "./views/resourceDialog";

//viewを生成してソケットと結びつける関数
export function viewBuild(bindParams: BindParams) {
    topWindowR.build(bindParams);
    warLine.build(bindParams);
    playerWindow.build(bindParams);
    const resourceHover = new ResourceHover();
    const resourceDialog = new ResourceDialog();
    resourceDialog.setThrowResourceNum(5);
    playerResourceArea.build(resourceHover, bindParams);
    logWindow.build(bindParams);
    eventLogWindow.build(bindParams);
    const actionCardHover = new ActionCardHover(bindParams.yamls.resourceHash, 3);
    playerBuildActionArea.build(actionCardHover, bindParams);
    const decision = new ActionCardUseDecisionWindow();
    handActionCardStorageWindow.build(actionCardHover, decision, bindParams);
    bindParams.stage.addChild(
        actionCardHover, resourceHover,
        decision, resourceDialog
    );
    turnFinishButton.build(bindParams);
    declareWarButton.build(bindParams);
    selectActionWindow.build(bindParams);
    selectDiceWindow.build(bindParams);
    topWindowL.build(bindParams);
}
