import * as global from "./boardGlobalData";

//ログウインドウ
export class LogWindow extends createjs.Container {
    private logFrame: createjs.Bitmap;
    constructor(queue: createjs.LoadQueue) {
        super();
        this.logFrame = new createjs.Bitmap(queue.getResult("logFrame"));
        this.logFrame.x = global.canvasWidth / 2 - this.logFrame.image.width / 2;
        this.logFrame.y = global.canvasHeight / 2 - this.logFrame.image.height / 2;
        const logMessageBox = new LogMessageBox(this.logFrame.image.height);
        logMessageBox.regX = -this.logFrame.x - 15;
        logMessageBox.regY = -this.logFrame.y;
        logMessageBox.addMessage("aabb");
        logMessageBox.addMessage("ggghhhgh");
        logMessageBox.addMessage("L知ってるか");
        logMessageBox.addMessage("死神が");
        logMessageBox.addMessage("りんごが好き");
        const shape = new createjs.Shape(new createjs.Graphics().beginFill("DarkRed").drawRoundRect(0, 0, 386, 142, 26));
        shape.x = this.logFrame.x;
        shape.y = this.logFrame.y;
        this.logFrame.addEventListener("mouseover", () => logMessageBox.MouseInFlag = true);
        this.logFrame.addEventListener("mouseout", () => logMessageBox.MouseInFlag = false);
        this.addChild(logMessageBox);
        this.addChild(this.logFrame);
        this.mask = shape;
    }
}

class LogMessageBox extends createjs.Container {
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

    addMessage(msg: string) {
        const text = new createjs.Text();
        text.x = 0;
        text.y = this.bottomY;
        text.text = msg;
        text.color = "white";
        text.font = "16px Arial";
        this.bottomY += text.getMeasuredHeight();
        this.addChild(text);
    }
}