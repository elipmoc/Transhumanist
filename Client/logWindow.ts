import * as global from "./boardGlobalData";
import { LogMessageType, LogMessage } from "../Share/logMessage";

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
        logMessageBox.addMessage(new LogMessage("イベント【人口爆発】が発生しました。", LogMessageType.EventMsg));
        logMessageBox.addMessage(new LogMessage("スターは「工場」を設置しました。", LogMessageType.Player1Msg));
        logMessageBox.addMessage(new LogMessage("N.Hのターンです。", LogMessageType.Player2Msg));
        logMessageBox.addMessage(new LogMessage("らいぱん鳥のターンです。", LogMessageType.Player3Msg));
        logMessageBox.addMessage(new LogMessage("戦争状態のため、Positiveが-1されました", LogMessageType.Player3Msg));
        const shape = new createjs.Shape(new createjs.Graphics().beginFill("DarkRed").drawRoundRect(0, 0, 386, 142, 26));
        shape.x = this.logFrame.x;
        shape.y = this.logFrame.y;
        this.logFrame.addEventListener("mouseover", () => logMessageBox.MouseInFlag = true);
        this.logFrame.addEventListener("mouseout", () => logMessageBox.MouseInFlag = false);
        this.addChild(this.logFrame);
        this.addChild(logMessageBox);
        this.mask = shape;
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
        text.text = logmsg.Msg;
        text.color = this.logMessageColorList[logmsg.MsgType];
        text.font = "16px Arial";
        this.bottomY += text.getMeasuredHeight();
        this.addChild(text);
    }
}