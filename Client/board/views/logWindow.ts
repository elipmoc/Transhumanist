import { global } from "../../boardGlobalData";
import { LogMessageForClient, LogMessageType } from "../../../Share/logMessageForClient";
import { createMyShadow } from "../../utility";
import { MessageBox, Message } from "./messageBox";
import { ImageQueue } from "../imageQueue";


//ログウインドウ
export class LogWindow extends createjs.Container {
    private logMessageBox: MessageBox<LogMessage>;
    constructor(queue: ImageQueue) {
        super();
        const logFrame = queue.getImage("logFrame");
        logFrame.x = global.canvasWidth / 2 - logFrame.image.width / 2;
        logFrame.y = global.canvasHeight / 2 - logFrame.image.height / 2 - 100;
        this.logMessageBox = new MessageBox<LogMessage>(logFrame.image.height);
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
    addMessaage(msg: LogMessage, playerId: number) {
        this.logMessageBox.addMessage(msg, playerId);
    }
}

const logMessageColorList: string[] = ["white", "#00c6db", "#00dd00", "#ddab40", "#ddee41", "#ee0eee"];

const MaxOneLineCharWidth = 220;

export class LogMessage implements Message {
    private msg: LogMessageForClient;
    constructor(msg: LogMessageForClient) {
        this.msg = msg;
    }
    msgToText(playerId: number) {
        const text = new createjs.Text();
        let msg = "";
        text.text = "";
        for (let i = 0; i < this.msg.msg.length; i++) {
            text.text += this.msg.msg[i];
            msg += this.msg.msg[i];
            if (text.getMeasuredWidth() > MaxOneLineCharWidth) {
                msg += "\n";
                text.text = "";
            }
        }
        text.text = msg;

        const colorId = this.msg.msgType == LogMessageType.EventMsg || this.msg.msgType == LogMessageType.OtherMsg ? this.msg.msgType : (4 + this.msg.msgType - 1 - playerId) % 4 + 1;
        text.color = logMessageColorList[colorId];
        text.font = "16px Arial";
        text.shadow = createMyShadow();
        return text;
    }
}