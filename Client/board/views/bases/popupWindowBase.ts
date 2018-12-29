import { global } from "../../../boardGlobalData";

//なんかポップアップして出てくるウインドウのベースとなるクラス
export class PopupWindowBase extends createjs.Container {

    private width: number;
    private height: number;

    getWidth() { return this.width; }
    getHeight() { return this.height; }

    //引数でWindowの大きさ指定
    constructor(width: number, height: number) {
        super();
        this.width = width;
        this.height = height;
        const background = new createjs.Shape(new createjs.Graphics().beginFill("gray")
            .drawRect(global.canvasWidth / 2 - width / 2, global.canvasHeight / 2 - height / 2, width, height));
        this.addChild(background);
    }
}