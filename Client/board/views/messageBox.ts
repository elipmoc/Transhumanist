export interface Message {
    msgToText(playerId: number): createjs.Text;
}

export class MessageBox<MsgT extends Message> extends createjs.Container {
    private bottomY = 0;
    private mouseInFlag = false;
    set MouseInFlag(x: boolean) {
        this.mouseInFlag = x;
    }

    constructor(height: number) {
        super();
        const mouseWheel = (e: WheelEvent) => {
            if (this.mouseInFlag) {
                if (e.deltaY) this.y += e.deltaY / 3;
                else this.y -= e.detail * 4;
                this.y = Math.min(
                    height - 20,
                    Math.max(-this.bottomY + 20, this.y)
                );
                this.stage.update();
                e.preventDefault();
            }
        };
        window.addEventListener("mousewheel", mouseWheel, false);
        window.addEventListener("DOMMouseScroll", mouseWheel, false);
    }

    addMessage(msg: MsgT, playerId: number) {
        const text = msg.msgToText(playerId);
        text.x = 0;
        text.y = this.bottomY;
        this.bottomY += text.getMeasuredHeight();
        this.y = Math.min(
            -this.bottomY + 130,
            Math.max(-this.bottomY + 20, this.y)
        )
        this.addChild(text);
    }
}
