import * as global from "./boardGlobalData";
import { LogMessageType, LogMessage } from "../Share/logMessage";
import { createMyShadow } from "./utility";

//ログウインドウ
export class LogWindow extends createjs.Container {
    private logMessageBox: LogMessageBox;
    constructor(queue: createjs.LoadQueue) {
        super();
        const logFrame = new createjs.Bitmap(queue.getResult("logFrame"));
        logFrame.x = global.canvasWidth / 2 - logFrame.image.width / 2;
        logFrame.y = global.canvasHeight / 2 - logFrame.image.height / 2;
        this.logMessageBox = new LogMessageBox(logFrame.image.height);
        this.logMessageBox.regX = -logFrame.x - 15;
        this.logMessageBox.regY = -logFrame.y;
        const shape = new createjs.Shape(new createjs.Graphics().beginFill("DarkRed").drawRoundRect(0, 0, 386, 142, 26));
        shape.x = logFrame.x;
        shape.y = logFrame.y;
        logFrame.addEventListener("mouseover", () => this.logMessageBox.MouseInFlag = true);
        logFrame.addEventListener("mouseout", () => this.logMessageBox.MouseInFlag = false);
        this.addChild(logFrame);
        this.addChild(this.logMessageBox);
        this.mask = shape;
    }
    addMessaage(msg: LogMessage) {
        this.logMessageBox.addMessage(msg);
    }
}

class LogMessageBox extends createjs.Container {
    private bottomY = 0;
    private mouseInFlag = false;
    set MouseInFlag(x: boolean) { this.mouseInFlag = x; }
    private logMessageColorList: string[] = ["white", "#00c6db", "#00dd00", "#ddab40", "#ddee41"];

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

    addMessage(logmsg: LogMessage) {
        const text = new createjs.Text();
        text.x = 0;
        text.y = this.bottomY;
        text.text = logmsg.msg;
        text.color = this.logMessageColorList[logmsg.msgType];
        text.font = "16px Arial";
        text.shadow = createMyShadow();
        this.bottomY += text.getMeasuredHeight();
        this.addChild(text);
    }
}