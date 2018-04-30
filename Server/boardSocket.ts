import { BoardControler } from "../Server/boardControler";
import { PlayerViewState } from "../Share/playerViewState"
import { setTimeout } from "timers";
import { NumberOfActionCard } from "../Share/numberOfActionCard";

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
                socket.on("selectLevel", (level) => {
                    console.log("level" + level);
                    socket.emit("setSelectActionWindowVisible", JSON.stringify(false));
                    setTimeout(() => socket.emit("setSelectActionWindowVisible", JSON.stringify(true)), 3000);
                });
                setTimeout(() => socket.emit("setSelectActionWindowVisible", JSON.stringify(true)), 3000);
                const numberOfActionCardList: NumberOfActionCard[] =
                    [
                        { currentNumber: 50, maxNumber: 99, dustNumber: 5 },
                        { currentNumber: 50, maxNumber: 99, dustNumber: 5 },
                        { currentNumber: 5, maxNumber: 99, dustNumber: 2 },
                        { currentNumber: 2, maxNumber: 67, dustNumber: 44 },
                        { currentNumber: 5, maxNumber: 99, dustNumber: 66 },
                        { currentNumber: 78, maxNumber: 99, dustNumber: 7 },
                    ]
                setTimeout(() => socket.emit("setNumberOfActionCard",
                    JSON.stringify(numberOfActionCardList)
                ), 2000)
            }
        );
    }
}