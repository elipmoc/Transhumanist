export interface Message {
    msgToText(playerId: number): createjs.Text;
}

export class MessageBox<MsgT extends Message> extends createjs.Container {
    private bottomY = 0;
    private height: number;
    private mouseInFlag = false;
    private wheelCallback: () => void;
    Onwheel(f: () => void) {
        this.wheelCallback = f;
    }

    set MouseInFlag(x: boolean) {
        this.mouseInFlag = x;
    }

    get ChatHeight() {
        return Math.max(this.bottomY, this.height);
    }

    get BaseHeight() {
        return this.height;
    }

    constructor(height: number) {
        super();
        this.height = height;
        const mouseWheel = (e: WheelEvent) => {
            if (this.mouseInFlag) {
                if (e.deltaY) this.y -= e.deltaY / 3;
                else this.y -= e.detail * 4;
                this.setY(this.y);
                this.stage.update();
                e.preventDefault();
            }
        };
        window.addEventListener("mousewheel", mouseWheel, { passive: false });
        window.addEventListener("DOMMouseScroll", mouseWheel, { passive: false });
    }

    setY(y: number) {
        this.y = Math.min(
            5,
            Math.max(-this.bottomY + this.height, y)
        );
        this.wheelCallback();
    }

    addMessage(msg: MsgT, playerId: number) {
        const text = msg.msgToText(playerId);
        text.x = 0;
        text.y = this.bottomY;
        this.bottomY += text.getMeasuredHeight();
        this.y = Math.min(
            -this.bottomY + 140,
            Math.max(-this.bottomY + 20, this.y)
        )
        this.wheelCallback();
        this.addChild(text);
    }
}
