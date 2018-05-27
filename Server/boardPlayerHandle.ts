import { GamePlayerState } from "../Share/gamePlayerState"
import { ResourceKind } from "../Share/resourceKind"
import { SelectResourceData } from "../Share/selectResourceData";
import { NumberOfActionCard } from "../Share/numberOfActionCard";

export interface BoardPlayerHandleEvents {
    turnFinishButtonClickCallBack: () => void;
    declareWarButtonClickCallBack: () => void;
    selectLevelCallBack: (level: number) => void;
    selectResourceCallBack: (selectResourceData: SelectResourceData) => void
}

export class BoardPlayerHandle {

    private socket: SocketIO.Socket;
    private events: BoardPlayerHandleEvents;
    //アクションカード選択ウインドウの表示非表示する
    setSelectActionWindowVisible(flag: boolean) {
        this.socket.emit("setSelectActionWindowVisible", JSON.stringify(flag));
    }

    //アクションカードの現在枚数、総山札数、捨て札数を変更する
    setNumberOfActionCard(numberOfActionCardList: NumberOfActionCard[]) {
        this.socket.emit("setNumberOfActionCard",
            JSON.stringify(numberOfActionCardList)
        )
    }

    constructor(socket: SocketIO.Socket, events: BoardPlayerHandleEvents) {
        this.socket = socket;
        this.events = events;
        socket.on("turnFinishButtonClick", () => this.events.turnFinishButtonClickCallBack());

        socket.on("declareWarButtonClick", () => this.events.declareWarButtonClickCallBack());
        socket.on("selectLevel", (level) =>
            this.events.selectLevelCallBack(level));
        setTimeout(() => this.setSelectActionWindowVisible(true), 3000);
        const numberOfActionCardList: NumberOfActionCard[] =
            [
                { currentNumber: 50, maxNumber: 99, dustNumber: 5 },
                { currentNumber: 50, maxNumber: 99, dustNumber: 5 },
                { currentNumber: 5, maxNumber: 99, dustNumber: 2 },
                { currentNumber: 2, maxNumber: 67, dustNumber: 44 },
                { currentNumber: 5, maxNumber: 99, dustNumber: 66 },
                { currentNumber: 78, maxNumber: 99, dustNumber: 7 },
            ]
        setTimeout(() => this.setNumberOfActionCard(numberOfActionCardList), 2000);
        socket.on("SelectResource", str =>
            this.events.selectResourceCallBack(JSON.parse(str)));
    }
}