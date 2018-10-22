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
        if (this.gamePlayers.canStart() && this.boardGameStatus.start()) {
            const startStatusYamlData = yamlGet("./Resource/Yaml/startStatus.yaml");
            this.gamePlayers.initCard(startStatusYamlData, this.actionCardStacks);
            this.gamePlayers.initTurnSet();
        }
    }
}