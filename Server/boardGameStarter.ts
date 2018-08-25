import { GamePlayers } from "./gamePlayers";
import { yamlGet } from "./yamlGet";
import { BoardGameStatusChanger } from "./boardGameStatusChanger";

export class BoardGameStarter {
    private gamePlayers: GamePlayers;
    private boardGameStatusChanger: BoardGameStatusChanger;

    constructor(gamePlayers: GamePlayers, boardGameStatusChanger: BoardGameStatusChanger) {
        this.gamePlayers = gamePlayers;
        this.boardGameStatusChanger = boardGameStatusChanger;
    }
    Init() {
        if (this.gamePlayers.canStart() && this.boardGameStatusChanger.start()) {
            const startStatusYamlData = yamlGet("./Resource/Yaml/startStatus.yaml");
            this.gamePlayers.setAICard(startStatusYamlData);
        }
    }
}