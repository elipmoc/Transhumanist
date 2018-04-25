import { BoardControler } from "../Server/boardControler";
import { PlayerViewState } from "../Share/playerViewState"
import { setTimeout } from "timers";

export class BoardSocket {
    private boardControler: BoardControler;
    constructor(socket: SocketIO.Server, boardControler: BoardControler) {
        const boardSocket = socket.of("/board");
        const playerViewState: PlayerViewState
            = {
                playerName: "hoge",
                speed: 3,
                activityRange: 67,
                uncertainty: 7,
                positive: 8,
                negative: 44,
                resource: 77
            };
        boardSocket.on("connection",
            (socket: SocketIO.Socket) => {
                setTimeout(() => socket.emit("setPlayerViewState1", JSON.stringify(playerViewState)), 1000);
                const playerViewState2 = Object.assign({}, playerViewState);
                playerViewState2.playerName = "歯ブラシ";
                setTimeout(() => socket.emit("setPlayerViewState1", JSON.stringify(playerViewState2)), 2000);

                socket.on("turnFinishButtonClick", () => console.log("turnFinishButtonClick"));

                socket.on("declareWarButtonClick", () => console.log("declareWarButtonClick"));
                socket.on("selectLevel", (level) => console.log("level" + level));
            }
        );
    }
}