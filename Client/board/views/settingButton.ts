import { ButtonBase } from "./bases/buttonBase"
import { ImageQueue } from "../imageQueue";

//設定ボタン
export class SettingButton extends ButtonBase {
    private height: number;
    constructor(onClickCallback: () => void, queue: ImageQueue) {
        const settingButton = queue.getImage("setting");

        settingButton.scaleX = 0.6;
        settingButton.scaleY = 0.6;
        settingButton.x = settingButton.image.width / 4;
        settingButton.y = settingButton.image.height / 4;
        settingButton.alpha = 0.5;
        settingButton.addEventListener("mouseover", () => { settingButton.alpha = 1.0; this.stage.update(); });
        settingButton.addEventListener("mouseout", () => { settingButton.alpha = 0.5; this.stage.update(); });


        //Graphicsオブジェクトを作成する
        var g = new createjs.Graphics()
            .beginStroke("#000")
            .beginFill("#000")
            .rect(0, 0, settingButton.image.width, settingButton.image.height);
        const rect = new createjs.Shape(g);
        settingButton.hitArea = rect;
        super(settingButton, onClickCallback);
        this.height = settingButton.image.height;
    }

    public getHeight() { return this.height; }

}