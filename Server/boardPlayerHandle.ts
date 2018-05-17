import { PlayerViewState } from "../Share/playerViewState"
import { ResourceKind } from "../Share/resourceKind"
import { SelectResourceData } from "../Share/selectResourceData";
import { NumberOfActionCard } from "../Share/numberOfActionCard";

export class BoardPlayerHandle {
    constructor(socket: SocketIO.Socket) {
        const playerViewState1: PlayerViewState
            = {
                playerName: "hoge",
                speed: 3,
                activityRange: 67,
                uncertainty: 7,
                positive: 8,
                negative: 44,
                resource: 77
            };
        const playerViewState2: PlayerViewState
            = {
                playerName: "スーパーひとし",
                speed: 34,
                activityRange: 67,
                uncertainty: 7,
                positive: 8,
                negative: 5,
                resource: 7
            };
        const playerViewState3: PlayerViewState
            = {
                playerName: "シロ",
                speed: 8,
                activityRange: 7,
                uncertainty: 7,
                positive: 8,
                negative: 23,
                resource: 4
            };
        const playerViewState4: PlayerViewState
            = {
                playerName: "OOP",
                speed: 3,
                activityRange: 9,
                uncertainty: 7,
                positive: 8,
                negative: 1,
                resource: 9
            };

        setTimeout(() => socket.emit("setPlayerViewState1", JSON.stringify(playerViewState1)), 1000);
        setTimeout(() => socket.emit("setPlayerViewState2", JSON.stringify(playerViewState2)), 1000);
        setTimeout(() => socket.emit("setPlayerViewState3", JSON.stringify(playerViewState3)), 1000);
        setTimeout(() => socket.emit("setPlayerViewState4", JSON.stringify(playerViewState4)), 1000);
        const playerViewState1_2 = Object.assign({}, playerViewState1);
        playerViewState1_2.playerName = "歯ブラシ";
        setTimeout(() => socket.emit("setPlayerViewState1", JSON.stringify(playerViewState1_2)), 2000);

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
            setTimeout(() => {
                const resourceKindList: ResourceKind[] = [
                    ResourceKind.human,
                    ResourceKind.human,
                    ResourceKind.human,
                    ResourceKind.human,
                    ResourceKind.human,
                    ResourceKind.bible,
                    ResourceKind.bible,
                    ResourceKind.cpu,
                    ResourceKind.cpu,
                    ResourceKind.cpu,
                    ResourceKind.cpu,
                    ResourceKind.cpu,
                    ResourceKind.cpu,
                    ResourceKind.cpu,
                    ResourceKind.extended_human,
                    ResourceKind.extended_human,
                    ResourceKind.extended_human,
                    ResourceKind.extended_human,
                    ResourceKind.extended_human,
                    ResourceKind.extended_human,
                ]
                socket.emit("player" + String(i) + "AddResource", JSON.stringify(resourceKindList));
                socket.emit("player" + String(i) + "DeleteResource", JSON.stringify([0, 2]));

            }, 1000);
        }
    }
}