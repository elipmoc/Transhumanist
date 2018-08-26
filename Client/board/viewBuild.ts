import { ActionCardHover } from "./views/actionCardHover";
import { ResourceHover } from "./views/resourceHover";
import { BindParams } from "./bindParams";
import * as warLine from "./viewBuilds/warLine";
import * as playerWindow from "./viewBuilds/playerWindow";
import * as topWindowL from "./viewBuilds/topWindowL";
import * as actionStorageWindow from "./viewBuilds/actionStorageWindow";
import * as eventLogWindow from "./viewBuilds/eventLogWindow";
import * as playerResourceArea from "./viewBuilds/playerResourceArea";
import * as playerBuildActionArea from "./viewBuilds/playerBuildActionArea";
import * as turnFinishButton from "./viewBuilds/turnFinishButton";
import * as selectActionWindow from "./viewBuilds/selectActionWindow";
import * as logWindow from "./viewBuilds/logWindow";
import * as selectDiceWindow from "./viewBuilds/selectDiceWindow";
import * as declareWarButton from "./viewBuilds/declareWarButton";

//viewを生成してソケットと結びつける関数
export function viewBuild(bindParams: BindParams) {
    warLine.build(bindParams);
    playerWindow.build(bindParams);
    const resourceHover = new ResourceHover(null, bindParams.queue);
    playerResourceArea.build(resourceHover, bindParams);
    logWindow.build(bindParams);
    eventLogWindow.build(bindParams);
    const actionCardHover = new ActionCardHover(bindParams.yamls.resourceHash, bindParams.queue, 3);
    playerBuildActionArea.build(actionCardHover, bindParams);
    actionStorageWindow.build(actionCardHover, bindParams);
    bindParams.stage.addChild(actionCardHover, resourceHover);
    turnFinishButton.build(bindParams);
    declareWarButton.build(bindParams);
    selectActionWindow.build(bindParams);
    selectDiceWindow.build(bindParams);
    topWindowL.build(bindParams);
}
