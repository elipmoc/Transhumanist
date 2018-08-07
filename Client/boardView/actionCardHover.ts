import { ActionCardYamlData } from "../../Share/Yaml/actionCardYamlData";
import { MakeCard } from "../../Client/boardView/makeCard";

export class ActionCardHover extends createjs.Container {
    private yamlData: ActionCardYamlData;
    private cardInfo: MakeCard;
    private backGround: createjs.Shape;

    readonly cardWidth: number = 253;
    readonly cardHeight: number = 379;

    constructor(yamlData: ActionCardYamlData, queue: createjs.LoadQueue,size:number) {
        super();
        this.yamlData = yamlData;
        this.cardInfo = new MakeCard(size);
        this.cardInfo.setYamlData(this.yamlData, queue);

        this.backGround = new createjs.Shape();
        this.backGround.graphics.beginFill("#EEE").drawRect(-7,-7,(this.cardWidth)+14,(this.cardHeight)+14);
        
        this.addChild(this.backGround);
        this.addChild(this.cardInfo);
        
    }
}