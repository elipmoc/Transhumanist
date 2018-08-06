import * as view from "../boardView/view";
import { OptionWindow } from "./optionWindow";

//左上のやーつ
export class TopWindowL extends createjs.Container {
    //ターン表示テキスト
    private text: createjs.Text;

    constructor(queue: createjs.LoadQueue, optionWindow: OptionWindow) {
        super();
        //設定枠
        let topWindowsL = new createjs.Bitmap(queue.getResult("topWindows"));
        this.addChild(topWindowsL);
        //設定ボタン
        const settingButton = new view.SettingButton(() => { optionWindow.visible = true; this.stage.update(); }, queue);
        settingButton.x = (topWindowsL.image.height - settingButton.getHeight()) / 2 - 10;
        settingButton.y = (topWindowsL.image.height - settingButton.getHeight()) / 2 - 10;
        this.addChild(settingButton);
        this.text = new createjs.Text("ターン", "32px Arial");
        this.text.color = "white";
        this.text.textAlign = "center";
        this.text.regY = this.text.getMeasuredHeight() / 2;
        this.text.x = topWindowsL.x + topWindowsL.image.width / 2 + 20;
        this.text.y = topWindowsL.y + topWindowsL.image.height / 2 - 10;
        this.addChild(this.text);
    }
    setTern(tern: number) {
        this.text.text = `ターン${tern}`;
    }
}