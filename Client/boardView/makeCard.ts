export class MakeCard extends createjs.Container {
    cardFrame: createjs.Bitmap;
    cardImage: createjs.Bitmap;
    cardName: createjs.Text;
    cardCap: createjs.Text;
    cardLevel: createjs.Text;
    cardType: createjs.Text;
    private size: number;
    
    constructor(size: number) {
        super();
        this.size = size;
        this.cardFrame = new createjs.Bitmap(null);
        this.cardFrame.scaleX = this.size / 3;
        this.cardFrame.scaleY = this.size / 3;
        this.cardImage = new createjs.Bitmap(null);
        this.cardImage.x = this.size * 2.5;
        this.cardImage.y = this.size * 26;
        this.cardImage.scaleX = this.size * 0.25;
        this.cardImage.scaleY = this.size * 0.25;
        this.cardName = new createjs.Text(null);
        this.cardName.textAlign = "center";
        this.cardName.font = (this.size * 8.5)+"px Arial";
        this.cardName.x = this.size * 42;
        this.cardName.y = this.size * 5;
        this.cardCap = new createjs.Text(null);
        this.cardCap.x = this.size * 4;
        this.cardCap.y = this.size * 69;
        this.cardCap.font = (this.size * 5.4) + "px Arial";
        this.cardCap.lineHeight = this.size * 5.4;
        this.cardLevel = new createjs.Text(null);
        this.cardLevel.font = (this.size * 7) + "px Arial";
        this.cardLevel.x = this.size * 3.5;
        this.cardLevel.y = this.size * 16.5;
        this.cardType = new createjs.Text(null);
        this.cardType.font = (this.size * 6.4) + "px Arial";
        this.cardType.x = this.size * 56;
        this.cardType.y = this.size * 17;

        this.addChild(this.cardFrame);
        this.addChild(this.cardImage);
        this.addChild(this.cardName);
        this.addChild(this.cardCap);
        this.addChild(this.cardLevel);
        this.addChild(this.cardType);
    }
}