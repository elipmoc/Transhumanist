
export interface Message {
    msgToText(playerId: number): createjs.Text;
}

export class MessageBox<MsgT extends Message> extends createjs.Container {
    private bottomY = 0;
    private mouseInFlag = false;
    set MouseInFlag(x: boolean) { this.mouseInFlag = x; }

    constructor(height: number) {
        super();
        const mouseWheel = (e: MouseWheelEvent) => {
            if (this.mouseInFlag) {
                if (e.wheelDelta)
                    this.y += e.wheelDelta / 10;
                else
                    this.y -= e.detail * 2.7;
                this.y = Math.min(height - 10, Math.max(-this.bottomY + 10, this.y));
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
        this.addChild(text);
    }
}