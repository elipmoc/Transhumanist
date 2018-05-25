import { GamePlayerState } from "../Share/gamePlayerState"
import { ResourceKind } from "../Share/resourceKind"
import { SelectResourceData } from "../Share/selectResourceData";
import { NumberOfActionCard } from "../Share/numberOfActionCard";

export class BoardPlayerHandle {
    constructor(socket: SocketIO.Socket) {

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
        for (let i = 0; i < 4; i++) {
            const j = i;
            socket.on("player" + String(i) + "SelectResource", str => {
                const selectResourceData: SelectResourceData = JSON.parse(str);
                console.log("selectResource " + "player" + String(j) + " iconId " + String(selectResourceData.iconId) + "resource " + String(selectResourceData.resourceKind))
            });
        }
    }
}