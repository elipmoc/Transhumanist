//ボタンのベースクラス
export class ButtonBase extends createjs.Container {
    constructor(buttonSource: createjs.DisplayObject, onClickCallback: () => void) {
        super();
        buttonSource.addEventListener("click", () => onClickCallback());
        this.addChild(buttonSource);
        this.alpha = 0.7;
        this.addEventListener("mouseover", () => { this.alpha = 1.0; this.stage.update(); });
        this.addEventListener("mouseout", () => { this.alpha = 0.7; this.stage.update(); });

    }
}