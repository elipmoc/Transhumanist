import * as global from "../boardGlobalData";
import { BuildActionIndex } from "../../Share/Yaml/actionCardYamlData";

//アクションカード置き場のウィンドウ
export class ActionStorageWindow extends createjs.Container {
    private callBack: (index: BuildActionIndex, cardName: string) => void;
    constructor(queue: createjs.LoadQueue) {
        super();
        const actionStorageFrame = new createjs.Bitmap(queue.getResult("actionStorageFrame"));
        actionStorageFrame.x = global.canvasWidth / 2 - actionStorageFrame.image.width / 2;
        actionStorageFrame.y = global.canvasHeight / 2 + actionStorageFrame.image.height - 35;
        this.addChild(actionStorageFrame);
        let x = actionStorageFrame.x;
        for (let i = 0; i < 5; i++) {
            const card = new createjs.Bitmap(queue.getResult("miningAction"));
            card.scaleX = 0.5;
            card.scaleY = 0.5;
            card.x = x;
            card.y = actionStorageFrame.y;
            this.addChild(card);
            x += card.image.width / 2 + 1;
            card.addEventListener("click", () => this.callBack(0, "採掘施設"));
        }
    }

    onSelectedCard(callBack: (index: BuildActionIndex, cardName: string) => void) {
        this.callBack = callBack;
    }
}