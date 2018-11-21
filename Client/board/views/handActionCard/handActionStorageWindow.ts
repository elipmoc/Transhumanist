import { global } from "../../../boardGlobalData";
import { ActionCardYamlData } from "../../../../Share/Yaml/actionCardYamlData";
import { HandActionCard } from "./handActionCard";
import { ActionCardHover } from "../actionCardHover";
import { ImageQueue } from "../../imageQueue";

//手札のアクションカード置き場のウィンドウ
export class HandActionCardStorageWindow extends createjs.Container {
    private callBack: (index: number, cardName: string) => void;
    private frame: createjs.Bitmap;
    private queue: ImageQueue;
    private cardImageList: HandActionCard[];
    private actionCardHover: ActionCardHover;

    constructor(actionCardHover: ActionCardHover, queue: ImageQueue) {
        super();
        this.actionCardHover = actionCardHover;
        this.queue = queue;
        this.frame = queue.getImage("actionStorageFrame");
        this.frame.x = global.canvasWidth / 2 - this.frame.image.width / 2;
        this.frame.y = global.canvasHeight / 2 + this.frame.image.height - 35;
        this.addChild(this.frame);
        this.cardImageList = [];
        [...Array(5).keys()].forEach(index => {
            const card = new HandActionCard(index, this.actionCardHover, queue);
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