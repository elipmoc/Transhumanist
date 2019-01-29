import { ButtonBase } from "./bases/buttonBase";
import { Bar } from "./bar";
import { SoundManager } from "../../soundManager";
import { ImageQueue } from "../imageQueue";

//オプション罰ボタン
export class OptionCrossButton extends ButtonBase {
    constructor(onClickCallback: () => void, queue: ImageQueue) {
        const crossButton = queue.getImage("optionCross");
        var g = new createjs.Graphics()
            .beginStroke("#000")
            .beginFill("#000")
            .rect(0, 0, crossButton.image.width, crossButton.image.height);
        const rect = new createjs.Shape(g);
        crossButton.hitArea = rect;
        super(crossButton, onClickCallback);
    }
}

//汎用ボタン基
class GeneralOptionButton extends ButtonBase {
    private text: createjs.Text;
    constructor(callback: () => void, queue: ImageQueue) {
        const Button = queue.getImage("button");
        super(Button, callback);

        this.text = new createjs.Text("", "20px Arial");
        this.text.textAlign = "center";
        this.text.regY = this.text.getMeasuredHeight() / 2;
        this.text.x = Button.x + Button.image.width / 2;
        this.text.y = Button.y + Button.image.height / 2;
        this.addChild(this.text);
    }
    setText(text: string) {
        this.text.text = text;
    }
}

//オプションウインドウ
export class OptionWindow extends createjs.Container {
    private ruleCallBack: () => void;
    private leaveCallBack: () => void;
    private endCallBack: () => void;

    private gameEndButton: GeneralOptionButton;

    set visibleGameEndButton(val: boolean) {
        this.gameEndButton.visible = val;
    }

    ruleOnClick(callback: () => void) {
        this.ruleCallBack = callback;
    }
    leaveOnClick(callback: () => void) {
        this.leaveCallBack = callback;
    }
    endOnClick(callback: () => void) {
        this.endCallBack = callback;
    }

    constructor(queue: ImageQueue) {
        super();

        const optionFrame = queue.getImage("optionWindow");
        optionFrame.regX = optionFrame.image.width / 2;
        optionFrame.regY = optionFrame.image.height / 2;
        this.addChild(optionFrame);

        const optionCrossButton = new OptionCrossButton(() => { this.visible = false; this.stage.update(); }, queue);
        optionCrossButton.x = 200;
        optionCrossButton.y = - 270;
        this.addChild(optionCrossButton);

        const ruleButton = new GeneralOptionButton(() => this.ruleCallBack(), queue);
        ruleButton.setText("ルール・ヘルプ");
        ruleButton.x = -240;
        ruleButton.y = 0;
        this.addChild(ruleButton);

        const leaveButton = new GeneralOptionButton(() => this.leaveCallBack(), queue);
        leaveButton.setText("部屋を退室");
        leaveButton.x = -240;
        leaveButton.y = +80;
        this.addChild(leaveButton);

        this.gameEndButton = new GeneralOptionButton(() => this.endCallBack(), queue);
        this.gameEndButton.setText("ゲーム終了");
        this.gameEndButton.x = -240;
        this.gameEndButton.y = +160;
        this.addChild(this.gameEndButton);

        const optionText = new createjs.Text();
        optionText.x = -180;
        optionText.y = -260;
        optionText.text = "オプション";
        optionText.color = "white";
        optionText.font = "45px Arial";
        this.addChild(optionText);

        const optionIcon = queue.getImage("setting");
        optionIcon.scaleX = 1;
        optionIcon.scaleY = 1;
        optionIcon.x = -270;
        optionIcon.y = -270;
        this.addChild(optionIcon);

        const volumeText = new createjs.Text();
        volumeText.x = -270;
        volumeText.y = -180;
        volumeText.text = "ボリューム";
        volumeText.color = "white";
        volumeText.font = "45px Arial";
        this.addChild(volumeText);

        const BgmText = new createjs.Text();
        BgmText.x = -270;
        BgmText.y = -130;
        BgmText.text = "BGM";
        BgmText.color = "white";
        BgmText.font = "30px Arial";
        this.addChild(BgmText);

        const SeText = new createjs.Text();
        SeText.x = -270;
        SeText.y = -90;
        SeText.text = "SE";
        SeText.color = "white";
        SeText.font = "30px Arial";
        this.addChild(SeText);

        const developerText = new createjs.Text();
        developerText.x = -40;
        developerText.y = -40;
        developerText.text = "空きスペース";
        developerText.color = "white";
        developerText.font = "30px Arial";
        this.addChild(developerText);

        const BgmBar = new Bar(queue);
        BgmBar.x = -170;
        BgmBar.y = -115;
        BgmBar.onChangedValue((value) => {
            SoundManager.BgmVolume = value;
        });
        BgmBar.setBarValue(0.1);
        this.addChild(BgmBar);

        const SeBar = new Bar(queue);
        SeBar.x = -170;
        SeBar.y = -75;
        SeBar.onChangedValue((value) => {
            SoundManager.SeVolume = value;
        });
        SeBar.setBarValue(0.5);
        this.addChild(SeBar);

    }
}