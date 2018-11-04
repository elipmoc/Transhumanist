import { SelectResourceData } from "../../Share/selectResourceData";
import { NumberOfActionCard } from "../../Share/numberOfActionCard";
import { SelectBuildActionData } from "../../Share/selectBuildActionData";
import { GamePlayer } from "./gamePlayer";

export class BoardPlayerHandle {

    private socket: SocketIO.Socket;
    private player: GamePlayer;

    selectResource(data: SelectResourceData) {
        console.log(`selectResource player${this.player.PlayerId} iconId${data.iconId}`);
    }
    selectBuildAction(data: SelectBuildActionData) {
        console.log(`selectBuildAction player${this.player.PlayerId} iconId${data.iconId}`);
    }

    //アクションカードの現在枚数、総山札数、捨て札数を変更する
    setNumberOfActionCard(numberOfActionCardList: NumberOfActionCard[]) {
        this.socket.emit("setNumberOfActionCard",
            JSON.stringify(numberOfActionCardList)
        )
    }

    constructor(socket: SocketIO.Socket, player: GamePlayer) {
        this.socket = socket;
        this.player = player;

        socket.on("SelectResource", str =>
            this.selectResource(JSON.parse(str)));
        socket.on("SelectBuildAction", str =>
            this.selectBuildAction(JSON.parse(str)));
    }
}