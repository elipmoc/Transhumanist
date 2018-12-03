import { global } from "../../boardGlobalData";
import { BindParams } from "../bindParams";
import { WarLine } from "../views/warLine";

export class DeclareWarSelectButton extends createjs.Container {
    private selectButton: WarSelectHitArea[] = [null, null, null];
    private warLine: WarLine[] = [null, null, null];

    //ここの関数型は変更されます。
    private clickEvent: (targetPlayerId: number) => void;
    OnselectedWarTarget(clickEvent: (targetPlayerId: number) => void) {
        this.clickEvent = clickEvent;
    };

    constructor(bindParams: BindParams) {
        super();
        this.selectButton.forEach((x, index) => {
            let current: number = bindParams.playerId;
            let playerId: number = ((index + 1) + current) % 4;

            this.warLine[index] = new WarLine(current, playerId, current);
            this.warLine[index].alpha = 0.3;

            x = new WarSelectHitArea(playerId, index, this.warLine[index]);
            x.addEventListener("click", () => this.clickEvent(playerId));
            this.warLine[index].visible = false;
            x.addEventListener("mouseover", () => {
                this.warLine[index].visible = true;
                bindParams.layerManager.update();

            });
            x.addEventListener("mouseout", () => {
                this.warLine[index].visible = false;
                bindParams.layerManager.update();

            });

            this.addChild(x, this.warLine[index]);
        });
    }
}

class WarSelectHitArea extends createjs.Container {
    playerId: number;
    //warLine: WarLine;
    //playerID:対応するID
    constructor(playerId: number, index: number, warLine: WarLine) {
        super();
        this.playerId = playerId;

        var g = new createjs.Graphics()
            .beginStroke("#000")
            .beginFill("#F00")
            .rect(0, 0,
                index != 1 ? 94 : 448,
                index != 1 ? 279 : 79);
        const rect = new createjs.Shape(g);
        this.hitArea = rect;
        //this.addChild(rect);

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