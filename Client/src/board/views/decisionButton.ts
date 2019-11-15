export class DecisionButton extends createjs.Container {
    readonly width = 150;
    readonly height = 50;
    constructor(_text: string) {
        super();
        const background = new createjs.Shape(new createjs.Graphics().beginFill("white").drawRect(-this.width / 2, -this.height / 2, this.width, this.height));
        const text = new createjs.Text(_text);
        text.color = "black";
        text.textAlign = "center";
        text.font = "32px Bold ＭＳ ゴシック";
        text.y = -20;
        this.addChild(background);
        this.addChild(text);
        
        this.alpha = 0.7;
        this.addEventListener("mouseover", () => { this.alpha = 1.0; this.stage.update(); });
        this.addEventListener("mouseout", () => { this.alpha = 0.7; this.stage.update(); });
    }
}