import { BoardGameStatus } from "./boardGameStatus";

export class BoardGameStatusChanger {
    private state: BoardGameStatus;
    constructor() {
        this.state = BoardGameStatus.wait;
    }

    start() {
        if (this.state != BoardGameStatus.playing) {
            this.state = BoardGameStatus.playing;
            return true;
        } else {
            return false;
        }
    }

}