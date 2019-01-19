import { global } from "../../boardGlobalData";
import { LogMessageForClient, LogMessageType } from "../../../Share/logMessageForClient";
import { createMyShadow } from "../../utility";
import { MessageBox, Message } from "./messageBox";
import { ImageQueue } from "../imageQueue";

const LogWindowWidth = 386;
const LogWindowHeight = 142;

//ログウインドウ
export class LogWindow extends createjs.Container {
    private logMessageBox: MessageBox<LogMessage>;
    private logSlider: LogSlider;
    constructor(queue: ImageQueue) {
        super();
        const logFrame = queue.getImage("logFrame");
        logFrame.x = global.canvasWidth / 2 - logFrame.image.width / 2;
        logFrame.y = global.canvasHeight / 2 - logFrame.image.height / 2 - 100;
        this.logMessageBox = new MessageBox<LogMessage>(logFrame.image.height);
        this.logMessageBox.regX = -logFrame.x - 15;
        this.logMessageBox.regY = -logFrame.y;
        const shape = new createjs.Shape(new createjs.Graphics().beginFill("DarkRed").drawRoundRect(0, 0, LogWindowWidth, LogWindowHeight, 26));
        shape.x = logFrame.x;
        shape.y = logFrame.y;
        logFrame.addEventListener("mouseover", () => this.logMessageBox.MouseInFlag = true);
        logFrame.addEventListener("mouseout", () => this.logMessageBox.MouseInFlag = false);
        this.logSlider = new LogSlider();
        this.logSlider.x = logFrame.x + LogWindowWidth - 15;
        this.logSlider.y = logFrame.y + 15;
        this.logMessageBox.Onwheel(() => {
            this.logSlider.y = - this.logMessageBox.BaseHeight * this.logMessageBox.y / this.logMessageBox.ChatHeight + logFrame.y;
        });
        this.logSlider.OnMouseMoveCallback(() => {
            this.logMessageBox.setY(-(this.logSlider.y - logFrame.y) * this.logMessageBox.ChatHeight / this.logMessageBox.BaseHeight);
        });
        this.addChild(logFrame);
        this.addChild(this.logMessageBox);
        this.addChild(this.logSlider);
        this.mask = shape;
    }
    addMessaage(msg: LogMessage, playerId: number) {
        this.logMessageBox.addMessage(msg, playerId);
        this.logSlider.setScaleY(this.logMessageBox.BaseHeight / this.logMessageBox.ChatHeight);
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

const BarFixY = 15;
const BarHeight = 110;
const BarWidth = 10;
const BarCircleRadius = 7;

class LogSlider extends createjs.Container {
    private bar: createjs.Shape;
    private bottomCircle: createjs.Shape;
    private mouseDownY: number;
    private mouseMoveCallback: () => void;
    OnMouseMoveCallback(f: () => void) {
        this.mouseMoveCallback = f;
    }

    setScaleY(y: number) {
        this.bar.scaleY = y;
        this.bottomCircle.y = BarHeight * y + BarFixY;
    }

    constructor() {
        super();
        const circle1 = new createjs.Shape(new createjs.Graphics().beginFill("White").drawCircle(0, 0, BarCircleRadius));
        circle1.x = BarWidth / 2;
        circle1.y = BarFixY;
        this.bottomCircle = new createjs.Shape(new createjs.Graphics().beginFill("White").drawCircle(0, 0, BarCircleRadius));
        this.bottomCircle.x = BarWidth / 2;
        this.bottomCircle.y = BarHeight + BarCircleRadius;
        this.bar = new createjs.Shape(new createjs.Graphics().beginFill("White").drawRoundRect(0, 0, BarWidth, BarHeight, 0));
        this.bar.addEventListener("pressmove", _ => this.onPressMove());
        circle1.addEventListener("pressmove", _ => this.onPressMove());
        this.bottomCircle.addEventListener("pressmove", _ => this.onPressMove());
        this.bar.y = BarFixY;
        this.bar.addEventListener("mousedown", _ => this.onMouseDown())
        circle1.addEventListener("mousedown", _ => this.onMouseDown())
        this.bottomCircle.addEventListener("mousedown", _ => this.onMouseDown())
        this.addChild(this.bar);
        this.addChild(circle1);
        this.addChild(this.bottomCircle);
    }
    private onMouseDown() {
        this.mouseDownY = this.stage.mouseY;
    }
    private onPressMove() {
        this.y += this.stage.mouseY - this.mouseDownY;
        this.mouseDownY = this.stage.mouseY;
        this.mouseMoveCallback();
        this.stage.update();
    }
}