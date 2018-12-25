import { GamePlayerCondition } from "../../../Share/gamePlayerCondition";
import { BindParams } from "../bindParams";
import { SocketBinder } from "../../socketBinder";
import { TurnFinishButton } from "../views/turnFinishButton";
import { SoundManager } from "../../soundManager";
import { LayerTag } from "../../board";

//ターン終了ボタン生成
export function build(bindParams: BindParams) {

    const turnFinishButton =
        new TurnFinishButton(
            () => bindParams.socket.emit("turnFinishButtonClick"),
            bindParams.imgQueue
        );
    bindParams.layerManager.add(LayerTag.Ui, turnFinishButton);

    const gamePlayerCondition =
        new SocketBinder<GamePlayerCondition>("gamePlayerCondition", bindParams.socket);

    const gameMasterPlayerId = new SocketBinder<number>("gameMasterPlayerId", bindParams.socket);
    gamePlayerCondition.onUpdate(cond => {
        switch (cond) {
            case GamePlayerCondition.Start:
                if (gameMasterPlayerId.Value == bindParams.playerId) {
                    turnFinishButton.setText("ゲーム開始");
                    turnFinishButton.visible = true;
                }
                else {
                    turnFinishButton.setText("");
                    turnFinishButton.visible = false;
                }
                break;
            case GamePlayerCondition.MyTurn:
                turnFinishButton.setText("ターン終了");
                turnFinishButton.visible = true;
                SoundManager.sePlay("turnStart");
                break;
            case GamePlayerCondition.Wait:
                SoundManager.sePlay("turnStart2");
            default:
                turnFinishButton.setText("");
                turnFinishButton.visible = false;
                break;
        }
        bindParams.layerManager.update();
    })
    gameMasterPlayerId.onUpdate(playerId => {
        if (gamePlayerCondition.Value == GamePlayerCondition.Start && playerId == bindParams.playerId)
            turnFinishButton.setText("ゲーム開始");
        else
            turnFinishButton.setText("");
        bindParams.layerManager.update();
    })
}