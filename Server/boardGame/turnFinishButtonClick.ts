import { SocketBinder } from "../socketBinder";
import { GamePlayer } from "./gamePlayer";
import { GamePlayerCondition } from "../../Share/gamePlayerCondition";
import { BoardGameStarter } from "./boardGameStarter";
import { BoardGameTurnRotation } from "./boardGameTurnRotation";

export class TurnFinishButtonClick {
    constructor(player: GamePlayer, boardGameStarter: BoardGameStarter, boardGameTurnRotation: BoardGameTurnRotation, boardSocketManager: SocketBinder.Namespace) {
        console.log("id" + player.PlayerId);
        const turnFinishButtonClick =
            new SocketBinder.EmitReceiveBinder("turnFinishButtonClick", true, [`player${player.PlayerId}`]);
        turnFinishButtonClick.OnReceive(() => {
            console.log("loglog");
            switch (player.Condition) {
                case GamePlayerCondition.Start:
                    if (player.IsGameMaster)
                        boardGameStarter.Init();
                    break;
                case GamePlayerCondition.MyTurn:
                    boardGameTurnRotation.next();
                    break;
            }
        });
        boardSocketManager.addSocketBinder(turnFinishButtonClick);
    }
}