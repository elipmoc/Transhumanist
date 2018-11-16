import { BoardGameStatusKind } from "./boardGameStatusKind";

export class BoardGameStatus {
    private state: BoardGameStatusKind;
    private changeCallback: (state: BoardGameStatusKind) => void;
    constructor() {
        this.state = BoardGameStatusKind.wait;
    }

    onChangeCallback(f: (state: BoardGameStatusKind) => void) {
        this.changeCallback = f;
    }

    start() {
        if (this.state != BoardGameStatusKind.playing) {
            this.state = BoardGameStatusKind.playing;
            this.changeCallback(this.state);
            return true;
        } else
            return false;
    }
    reset() {
        if (this.state != BoardGameStatusKind.wait) {
            this.state = BoardGameStatusKind.wait;
            this.changeCallback(this.state);
        }
    }

    isWait() {
        return this.state == BoardGameStatusKind.wait;
    }

}