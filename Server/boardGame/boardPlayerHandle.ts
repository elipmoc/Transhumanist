import { SelectResourceData } from "../../Share/selectResourceData";
import { NumberOfActionCard } from "../../Share/numberOfActionCard";
import { SelectBuildActionData } from "../../Share/selectBuildActionData";
import { GamePlayer } from "./gamePlayer";
import { BoardGameStarter } from "./boardGameStarter";
import { GamePlayerCondition } from "../../Share/gamePlayerCondition";
import { BoardGameTurnRotation } from "./boardGameTurnRotation";

export class BoardPlayerHandle {

    private socket: SocketIO.Socket;
    private player: GamePlayer;
    private boardGameStarter: BoardGameStarter;
    private boardGameTurnRotation: BoardGameTurnRotation;

    turnFinishButtonClick() {
        switch (this.player.Condition) {
            case GamePlayerCondition.Start:
                if (this.player.IsGameMaster)
                    this.boardGameStarter.Init();
                break;
            case GamePlayerCondition.MyTurn:
                this.boardGameTurnRotation.next();
                break;
        }
    }

    declareWarButtonClick() { console.log("declareWarButtonClick"); }

    selectLevel(level: number) {
        console.log("level" + level);
        this.setSelectActionWindowVisible(false);
    }

    selectResource(data: SelectResourceData) {
        console.log(`selectResource player${this.player.PlayerId} iconId${data.iconId}`);
    }
    selectBuildAction(data: SelectBuildActionData) {
        console.log(`selectBuildAction player${this.player.PlayerId} iconId${data.iconId}`);
    }

    //アクションカード選択ウインドウの表示非表示する
    setSelectActionWindowVisible(flag: boolean) {
        //  this.socket.emit("setSelectActionWindowVisible", JSON.stringify(flag));
    }

    //アクションカードの現在枚数、総山札数、捨て札数を変更する
    setNumberOfActionCard(numberOfActionCardList: NumberOfActionCard[]) {
        this.socket.emit("setNumberOfActionCard",
            JSON.stringify(numberOfActionCardList)
        )
    }

    constructor(socket: SocketIO.Socket, player: GamePlayer, boardGameStarter: BoardGameStarter, boardGameTurnRotation: BoardGameTurnRotation) {
        this.socket = socket;
        this.player = player;
        this.boardGameStarter = boardGameStarter;
        this.boardGameTurnRotation = boardGameTurnRotation;
        socket.on("turnFinishButtonClick", () => this.turnFinishButtonClick());

        socket.on("declareWarButtonClick", () => this.declareWarButtonClick());
        socket.on("selectLevel", (level) =>
            this.selectLevel(level));
        setTimeout(() => this.setSelectActionWindowVisible(true), 3000);
        socket.on("SelectResource", str =>
            this.selectResource(JSON.parse(str)));
        socket.on("SelectBuildAction", str =>
            this.selectBuildAction(JSON.parse(str)));
        socket.on("selectDice", diceIndex => console.log(`diceIndex:${diceIndex}`));
    }
}