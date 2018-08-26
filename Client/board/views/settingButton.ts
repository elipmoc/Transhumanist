import { ButtonBase } from "./bases/buttonBase"

//設定ボタン
export class SettingButton extends ButtonBase {
    private height: number;
    constructor(onClickCallback: () => void, queue: createjs.LoadQueue) {
        const settingButton = new createjs.Bitmap(queue.getResult("setting"));

        settingButton.scaleX = 0.6;
        settingButton.scaleY = 0.6;
        settingButton.x = settingButton.image.width / 4;
        settingButton.y = settingButton.image.height / 4;

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