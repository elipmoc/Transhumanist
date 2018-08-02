import * as global from "../../boardGlobalData";
import { ActionIndex, ActionCardYamlData } from "../../../Share/Yaml/actionCardYamlData";
import { ActionStorageCard } from "./actionStorageCard";

//アクションカード置き場のウィンドウ
export class ActionStorageWindow extends createjs.Container {
    private callBack: (index: number, cardName: string) => void;
    private frame: createjs.Bitmap;
    private queue: createjs.LoadQueue;
    private cardImageList: ActionStorageCard[];

    constructor(queue: createjs.LoadQueue) {
        super();
        this.queue = queue;
        this.frame = new createjs.Bitmap(queue.getResult("actionStorageFrame"));
        this.frame.x = global.canvasWidth / 2 - this.frame.image.width / 2;
        this.frame.y = global.canvasHeight / 2 + this.frame.image.height - 35;
        this.addChild(this.frame);
        this.cardImageList = [];
        [...Array(5).keys()].forEach(index => {
            const card = new ActionStorageCard(index);
            this.cardImageList.push(card);
            card.x = this.frame.x + index * (card.width + 1);
            card.y = this.frame.y;
            card.setClickCallBack((index, cardName) => this.callBack(index, cardName));
            this.addChild(card);
        });
    }

    setActionCard(index: number, actionCardYaml: ActionCardYamlData) {
        this.cardImageList[index].setYamlData(actionCardYaml, this.queue);
    }

    onSelectedCard(callBack: (index: number, cardName: string) => void) {
        this.callBack = callBack;
    }
}