import { global } from "../../boardGlobalData";
import { createMyShadow } from "../../utility";
import { DecisionButton } from "./decisionButton";
import { ActionCardYamlData,CreateGet } from "../../../Share/Yaml/actionCardYamlData";
import { ImageQueue } from "../imageQueue";
import { SelectButton } from "./buildActionSelect/selectButton";
import { ResourceHash } from "../../../Share/Yaml/resourceYamlData";
import { Yamls } from "../../getYaml";

export class BuildActionSelectWindow extends createjs.Container {
    private cardName = new createjs.Text();
    private callBack: () => void;
    private selectButton: SelectButton[] = [new SelectButton(),new SelectButton(),new SelectButton()];
    private cardIndex: number;

    constructor() {
        super();

        const frame = new createjs.Shape();
        const frameX = 700;
        const frameY = 400;
        frame.graphics.beginFill("gray").
            drawRect(0, 0, frameX, frameY);
        frame.x = global.canvasWidth / 2 - frameX / 2;
        frame.y = global.canvasHeight / 2 - frameY / 2;

        this.cardName.textAlign = "center";
        this.cardName.text = "";
        this.cardName.font = "20px Bold ＭＳ ゴシック";
        this.cardName.color = "white";
        this.cardName.shadow = createMyShadow();
        this.cardName.x = global.canvasWidth / 2;
        this.cardName.y = global.canvasHeight / 2 - 180;

        const description = new createjs.Text("効果を選択してください。");
        description.textAlign = "center";
        description.x = global.canvasWidth / 2;
        description.y = global.canvasHeight / 2 - 130;
        description.font = "20px ＭＳゴシック";
        description.color = "white";
        description.shadow = createMyShadow();

        const button = new DecisionButton("やめる");
        button.x = global.canvasWidth / 2;
        button.y = global.canvasHeight / 2 + 120;
        button.addEventListener("click", () => this.callBack());

        this.addChild(frame);
        this.addChild(description);
        this.addChild(this.cardName, button);

        for (let i = 0; this.selectButton.length > i; i++){
            this.selectButton[i].x = global.canvasWidth / 2 - 260 + (200*i);
            this.selectButton[i].y = global.canvasHeight / 2 - 70;
            this.addChild(this.selectButton[i]);
        }
    }

    private setName(text: string) {
        this.cardName.text = text;
    }
    get CardIndex(){
        return this.cardIndex;
    }
        
    closeOnClick(callBack: () => void) {
        this.callBack = callBack;
    }

    setYaml(yaml: ActionCardYamlData | null, queue: ImageQueue, resourceHash:ResourceHash) {
        this.setName(yaml.name);
        
        this.selectButton.forEach((button, index) => {
            button.setCommandData(<CreateGet>yaml.commands[index].body, queue, resourceHash);
        });
    }
    set CardIndex(id:number) {
        this.cardIndex = id;
    }
    selectOnClick(callback:(num:number)=>void) {
        this.selectButton.forEach((button, index) => {
            button.onClickCallback(()=>{callback(index)});
        });
    }
}