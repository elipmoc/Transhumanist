import { GamePlayers } from "./gamePlayers";
import { yamlGet } from "./yamlGet";
import { BoardGameStatusChanger } from "./boardGameStatusChanger";
import { ActionCardStacks } from "./drawCard/actionCardStacks";

export class BoardGameStarter {
    private gamePlayers: GamePlayers;
    private boardGameStatusChanger: BoardGameStatusChanger;
    private actionCardStacks: ActionCardStacks;

    constructor(gamePlayers: GamePlayers, boardGameStatusChanger: BoardGameStatusChanger, actionCardStacks: ActionCardStacks) {
        this.gamePlayers = gamePlayers;
        this.boardGameStatusChanger = boardGameStatusChanger;
        this.actionCardStacks = actionCardStacks;
    }
    Init() {
        if (this.gamePlayers.canStart() && this.boardGameStatusChanger.start()) {
            const startStatusYamlData = yamlGet("./Resource/Yaml/startStatus.yaml");
            this.gamePlayers.setAICard(startStatusYamlData);
            this.gamePlayers.initTurnSet();
            this.gamePlayers.getPlayerAll(x => {
                x.drawActionCard(this.actionCardStacks.draw(1));
                for (let i = 0; i < 4; i++)
                    x.drawActionCard(this.actionCardStacks.draw(Math.floor(Math.random() * 2) + 2));
            });
        }
    }
}