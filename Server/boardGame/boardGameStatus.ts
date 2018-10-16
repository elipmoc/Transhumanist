import { BoardGameStatusKind } from "./boardGameStatusKind";

export class BoardGameStatus {
    private state: BoardGameStatusKind;
    constructor() {
        this.state = BoardGameStatusKind.wait;
    }

    start() {
        if (this.state != BoardGameStatusKind.playing) {
            this.state = BoardGameStatusKind.playing;
            return true;
        } else {
            return false;
        }
    }

    isWait() {
        return this.state == BoardGameStatusKind.wait;
    }

}