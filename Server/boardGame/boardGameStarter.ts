import { GamePlayers } from "./gamePlayers";
import { yamlGet } from "../yamlGet";
import { BoardGameStatus } from "./boardGameStatus";
import { ActionCardStacks } from "./drawCard/actionCardStacks";

export class BoardGameStarter {
    private gamePlayers: GamePlayers;
    private boardGameStatus: BoardGameStatus;
    private actionCardStacks: ActionCardStacks;

    constructor(gamePlayers: GamePlayers, boardGameStatus: BoardGameStatus, actionCardStacks: ActionCardStacks) {
        this.gamePlayers = gamePlayers;
        this.boardGameStatus = boardGameStatus;
        this.actionCardStacks = actionCardStacks;
    }
    Init() {
        //プレイヤーが二人以上でゲーム開始できる
        if (this.gamePlayers.getPlayerCount() > 1 && this.boardGameStatus.start()) {
            const startStatusYamlData = yamlGet("./Resource/Yaml/startStatus.yaml");
            this.gamePlayers.initCard(startStatusYamlData, this.actionCardStacks);
            this.gamePlayers.initTurnSet();
        }
    }
}