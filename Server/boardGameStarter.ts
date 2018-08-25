import { GamePlayers } from "./gamePlayers";
import { yamlGet } from "./yamlGet";

export class BoardGameStarter {
    private gamePlayers: GamePlayers;
    constructor(gamePlayers: GamePlayers) {
        this.gamePlayers = gamePlayers;
    }
    Init() {
        const startStatusYamlData = yamlGet("./Resource/Yaml/startStatus.yaml");
        this.gamePlayers.setAICard(startStatusYamlData);
    }
}