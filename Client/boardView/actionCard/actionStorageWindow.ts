import * as global from "../../boardGlobalData";
import { ActionIndex, ActionCardYamlData } from "../../../Share/Yaml/actionCardYamlData";
import { ActionStorageCard } from "./actionStorageCard";
import { ActionCardHover } from "../actionCardHover";

//アクションカード置き場のウィンドウ
export class ActionStorageWindow extends createjs.Container {
    private callBack: (index: number, cardName: string) => void;
    private frame: createjs.Bitmap;
    private queue: createjs.LoadQueue;
    private cardImageList: ActionStorageCard[];
    private actionCardHover: ActionCardHover;

    constructor(queue: createjs.LoadQueue) {
        super();
        this.actionCardHover = new ActionCardHover(null, queue, 3);
        this.queue = queue;
        this.frame = new createjs.Bitmap(queue.getResult("actionStorageFrame"));
        this.frame.x = global.canvasWidth / 2 - this.frame.image.width / 2;
        this.frame.y = global.canvasHeight / 2 + this.frame.image.height - 35;
        this.addChild(this.frame);
        this.cardImageList = [];
        [...Array(5).keys()].forEach(index => {
            const card = new ActionStorageCard(index, this.actionCardHover, queue);
            this.cardImageList.push(card);
            card.x = this.frame.x + index * (card.width + 1);
            card.y = this.frame.y;
            card.setClickCallBack((index, cardName) => this.callBack(index, cardName));
            this.addChild(card);
        });

        this.actionCardHover.visible = false;
        this.addChild(this.actionCardHover);
    }

    setActionCard(index: number, actionCardYaml: ActionCardYamlData) {
        this.cardImageList[index].setYamlData(actionCardYaml, this.queue);
    }

    onSelectedCard(callBack: (index: number, cardName: string) => void) {
        this.callBack = callBack;
    }
}