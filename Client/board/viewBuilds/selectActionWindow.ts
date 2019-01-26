import { SelectActionWindow } from "../views/selectActionWindow";
import { BindParams } from "../bindParams";
import { NumberOfActionCard } from "../../../Share/numberOfActionCard";
import { SocketBinder } from "../../socketBinder";
import { LayerTag } from "../../board";
import { build as buildSelectWinCardWindow } from "./selectWinCardWindow";
import { GamePlayerCondition } from "../../../Share/gamePlayerCondition";
import { DrawCardLimit } from "../../../Share/drawCardLimit";

//ドローするアクションカードのレベル選択ウインドウの生成
export function build(bindParams: BindParams) {
    const selectActionWindow = new SelectActionWindow(bindParams.imgQueue);
    const selectWinCardWindow = buildSelectWinCardWindow(bindParams);
    //ボタンをクリックしたら発火
    selectWinCardWindow.buttonOnClick(() => {
        selectWinCardWindow.visible = false;
        selectActionWindow.visible = true;
        bindParams.layerManager.update();
    });

    selectActionWindow.onSelectedLevel(level => {
        if (level == 6) {
            selectWinCardWindow.visible = true;
            bindParams.layerManager.update();
            return;
        }
        bindParams.socket.emit("selectActionCardLevel", level);
    });
    bindParams.layerManager.add(LayerTag.PopUp, selectActionWindow);
    selectActionWindow.visible = false;
    const gamePlayerCondition =
        new SocketBinder<GamePlayerCondition>("gamePlayerCondition", bindParams.socket);
    gamePlayerCondition.onUpdate(cond => {
        if (cond === GamePlayerCondition.DrawCard) {
            bindParams.socket.emit("drawCardLimit");
        } else
            selectActionWindow.visible = false;
        selectActionWindow.stage.update();
    });

    bindParams.socket.on("drawCardLimit", (data: any) => {
        data = <DrawCardLimit>JSON.parse(data);
        selectActionWindow.setDrawCardLevelLimit(data.isLimit);
        selectActionWindow.visible = true;
        selectActionWindow.stage.update();
    });
    const numberOfActionCard = new SocketBinder<NumberOfActionCard[]>("numberOfActionCard", bindParams.socket);
    numberOfActionCard.onUpdate(numberOfActionCardList => {
        selectActionWindow.setNumberOfActionCard(numberOfActionCardList);
        selectActionWindow.stage.update();
    });
}