import * as global from "./boardGlobalData";
import { LogMessageType, LogMessageForClient } from "../Share/logMessageForClient";
import { createMyShadow } from "./utility";
import { MessageBox, Message } from "./messageBox";


//ログウインドウ
export class LogWindow extends createjs.Container {
    private logMessageBox: MessageBox<LogMessage>;
    constructor(queue: createjs.LoadQueue) {
        super();
        const logFrame = new createjs.Bitmap(queue.getResult("logFrame"));
        logFrame.x = global.canvasWidth / 2 - logFrame.image.width / 2;
        logFrame.y = global.canvasHeight / 2 - logFrame.image.height / 2;
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
    addMessaage(msg: LogMessage) {
        this.logMessageBox.addMessage(msg);
    }
}

const logMessageColorList: string[] = ["white", "#00c6db", "#00dd00", "#ddab40", "#ddee41"];

export class LogMessage implements Message {
    private msg: LogMessageForClient;
    constructor(msg: LogMessageForClient) {
        this.msg = msg;
    }
    msgToText() {
        const text = new createjs.Text();
        text.text = this.msg.msg;
        text.color = logMessageColorList[this.msg.msgType];
        text.font = "16px Arial";
        text.shadow = createMyShadow();
        return text;
    }
}