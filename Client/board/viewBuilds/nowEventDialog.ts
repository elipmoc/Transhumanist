import { GamePlayerCondition } from "../../../Share/gamePlayerCondition";
import { BindParams } from "../bindParams";
import { SocketBinder } from "../../socketBinder";
import { NowEventDialog } from "../views/nowEventDialog";
import { LayerTag } from "../../board";

//ターン終了ボタン生成
export function build(bindParams: BindParams) {

    const nowEventDialog = new NowEventDialog();
    bindParams.layerManager.add(LayerTag.Ui, nowEventDialog);

    const gamePlayerCondition =
        new SocketBinder<GamePlayerCondition>("gamePlayerCondition", bindParams.socket);

    gamePlayerCondition.onUpdate(cond => {
        switch (cond) {
            case GamePlayerCondition.EventClear:
                nowEventDialog.visible = true;
                break;
            default:
                nowEventDialog.visible = false;
                break;
        }
        bindParams.layerManager.update();
    })
}