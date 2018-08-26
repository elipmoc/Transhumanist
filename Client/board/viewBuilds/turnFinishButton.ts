import { GamePlayerCondition } from "../../../Share/gamePlayerCondition";
import { BindParams } from "../bindParams";
import { SocketBinder } from "../../socketBinder";
import { TurnFinishButton } from "../views/turnFinishButton";

//ターン終了ボタン生成
export function build(bindParams: BindParams) {

    const turnFinishButton =
        new TurnFinishButton(
            () => bindParams.socket.emit("turnFinishButtonClick"),
            bindParams.queue
        );
    bindParams.stage.addChild(turnFinishButton);

    const gamePlayerCondition =
        new SocketBinder<GamePlayerCondition>("gamePlayerCondition", bindParams.socket);

    const gameMasterPlayerId = new SocketBinder<number>("gameMasterPlayerId", bindParams.socket);
    gamePlayerCondition.onUpdate(cond => {
        switch (cond) {
            case GamePlayerCondition.Start:
                if (gameMasterPlayerId.Value == bindParams.playerId)
                    turnFinishButton.setText("ゲーム開始");
                else
                    turnFinishButton.setText("");
                break;
            case GamePlayerCondition.MyTurn:
                turnFinishButton.setText("ターン終了");
                break;
            case GamePlayerCondition.Wait:
                turnFinishButton.setText("");
                break;

        }
        bindParams.stage.update();
    })
    gameMasterPlayerId.onUpdate(playerId => {
        if (gamePlayerCondition.Value == GamePlayerCondition.Start && playerId == bindParams.playerId)
            turnFinishButton.setText("ゲーム開始");
        else
            turnFinishButton.setText("");
        bindParams.stage.update();
    })
}