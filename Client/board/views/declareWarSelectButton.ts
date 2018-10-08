import { global } from "../../boardGlobalData";
import { BindParams } from "../bindParams";

export class DeclareWarSelectButton extends createjs.Container {
    private selectButton: WarSelectHitArea[] = [null, null,null];

    //ここの関数型は変更されます。
    private clickEvent: () => void;
    OnselectedWarTarget(clickEvent:() => void) {
        this.clickEvent = clickEvent;
    };

    constructor(bindParams:BindParams) {
        super();
        this.selectButton.forEach((x,index) => {
            x = new WarSelectHitArea(((index + 1) + bindParams.playerId) % 4,index);
            x.addEventListener("click", () => this.clickEvent());
            this.addChild(x);
            console.log("");
        });
    }
}

class WarSelectHitArea extends createjs.Container{
    playerId: number;
    
    //playerID:対応するID
    constructor(playerId:number,index:number) {
        super();
        this.playerId = playerId;

        var g = new createjs.Graphics()
            .beginStroke("#000")
            .beginFill("#F00")
            .rect(0, 0,
                index != 1 ? 94 : 448,
                index != 1 ? 279 : 79);
        const rect = new createjs.Shape(g);
        //this.hitArea = rect;
        this.addChild(rect);

        switch (index) {
            case 0:
                this.regY = 279 / 2;
                this.y = global.canvasHeight / 2;

                break;
            case 1:
                this.regX = 448 / 2;
                this.regY = 79;
                this.rotation = 180;
                this.x = global.canvasWidth / 2;

                break;
            case 2:
                this.regY = 279 / 2;
                this.regX = 94;
                this.rotation = 180;
                this.y = global.canvasHeight / 2;
                this.x = global.canvasWidth - 94;

                break;
        }
    }
}