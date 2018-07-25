import * as global from "../boardGlobalData";
import { ActionIndex, ActionCardYamlData } from "../../Share/Yaml/actionCardYamlData";

//アクションカード置き場のウィンドウ
export class ActionStorageWindow extends createjs.Container {
    private callBack: (cardName: string) => void;
    private frame: createjs.Bitmap;
    private queue: createjs.LoadQueue;
    private cardImageList: createjs.Bitmap[];

    constructor(queue: createjs.LoadQueue) {
        super();
        this.cardImageList = [];
        this.queue = queue;
        this.frame = new createjs.Bitmap(queue.getResult("actionStorageFrame"));
        this.frame.x = global.canvasWidth / 2 - this.frame.image.width / 2;
        this.frame.y = global.canvasHeight / 2 + this.frame.image.height - 35;
        this.addChild(this.frame);
    }

    setActionCardList(actionCardList: ActionCardYamlData[]) {
        this.cardImageList.forEach(x => this.removeChild(x));
        let x = this.frame.x;
        actionCardList.forEach(actionCard => {
            const card = new createjs.Bitmap(this.queue.getResult("miningAction"));
            card.scaleX = 0.5;
            card.scaleY = 0.5;
            card.x = x;
            card.y = this.frame.y;
            this.addChild(card);
            this.cardImageList.push(card);
            x += card.image.width / 2 + 1;
            card.addEventListener("click", () => this.callBack(actionCard.name));
        });
    }

    onSelectedCard(callBack: (cardName: string) => void) {
        this.callBack = callBack;
    }
}