import { ButtonBase } from "./bases/buttonBase";
import { Bar } from "./bar";
import { SoundManager } from "../../soundManager";

//オプション罰ボタン
export class OptionCrossButton extends ButtonBase {
    constructor(onClickCallback: () => void, queue: createjs.LoadQueue) {
        const crossButton = new createjs.Bitmap(queue.getResult("optionCross"));
        var g = new createjs.Graphics()
            .beginStroke("#000")
            .beginFill("#000")
            .rect(0, 0, crossButton.image.width, crossButton.image.height);
        const rect = new createjs.Shape(g);
        crossButton.hitArea = rect;
        super(crossButton, onClickCallback);
    }
}

//オプションウインドウ
export class OptionWindow extends createjs.Container {
    constructor(queue: createjs.LoadQueue) {
        super();

        const optionFrame = new createjs.Bitmap(queue.getResult("optionWindow"));
        optionFrame.regX = optionFrame.image.width / 2;
        optionFrame.regY = optionFrame.image.height / 2;
        this.addChild(optionFrame);

        const optionCrossButton = new OptionCrossButton(() => { this.visible = false; this.stage.update(); }, queue);
        optionCrossButton.x = 200;
        optionCrossButton.y = - 270;
        this.addChild(optionCrossButton);

        const optionText = new createjs.Text();
        optionText.x = -180;
        optionText.y = -260;
        optionText.text = "オプション";
        optionText.color = "white";
        optionText.font = "45px Arial";
        this.addChild(optionText);

        const optionIcon = new createjs.Bitmap(queue.getResult("setting"));
        optionIcon.scaleX = 1;
        optionIcon.scaleY = 1;
        optionIcon.x = -280;
        optionIcon.y = -280;
        this.addChild(optionIcon);

        const volumeText = new createjs.Text();
        volumeText.x = -270;
        volumeText.y = -180;
        volumeText.text = "Volume";
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
        developerText.text = "開発スタッフ";
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