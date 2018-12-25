import { ResourceHash } from "../../../../Share/Yaml/resourceYamlData";
import { CreateGet } from "../../../../Share/Yaml/actionCardYamlData";
import { getIconResource } from "../../../utility";
import { global } from "../../../boardGlobalData";
import { ImageQueue } from "../../imageQueue";

export class SelectButton extends createjs.Container {
    private costIcons: createjs.Bitmap[] = [new createjs.Bitmap(null), new createjs.Bitmap(null)];
    private costNums: createjs.Text[] = [new createjs.Text(null), new createjs.Text(null)];
    private getIcons: createjs.Bitmap[] = [new createjs.Bitmap(null)];
    private getNums: createjs.Text[] = [new createjs.Text(null)];
    private backGround: createjs.Shape;
    private callback: () => void;
    onClickCallback(f:() => void) {
        this.callback = f;
    }

    constructor() {
        super();
        this.backGround = new createjs.Shape();
        this.backGround.graphics.beginFill("#fcfcfc").drawRect(0, 0, (108) + (7 * 2), (14 + (global.cardIconSize/2 * 4)));
        this.addChild(this.backGround);

        this.costIcons.forEach((icon, i) => {
            icon.x = 7 + ((global.cardIconSize / 2 + 30) * i);
            icon.y = 7;
            this.addChild(icon);
        });
        this.costNums.forEach((num, i) => {
            num.x = 7 + 3 + (global.cardIconSize / 2) + ((global.cardIconSize / 2 + 30) * i);
            num.y = 7 + 5;
            num.font = "22px Arial";
            this.addChild(num);
        });

        const useCostText = new createjs.Text("を消費して");
        useCostText.color = "#111";
        useCostText.font = "20px Arial";
        useCostText.x = 7 + 5;
        useCostText.y = 7 + 32;
        this.addChild(useCostText);

        this.getIcons.forEach((icon, i) => {
            icon.x = 7 + ((global.cardIconSize / 2 + 30) * i);
            icon.y = 7 + 59;
            this.addChild(icon);
        });
        this.getNums.forEach((num, i) => {
            num.x = 7 + 3 + (global.cardIconSize / 2) + ((global.cardIconSize / 2 + 30) * i);
            num.y = 7 + 59;
            num.font = "22px Arial";
            this.addChild(num);
        });

        const useGetText = new createjs.Text("を得る");
        useGetText.color = "#111";
        useGetText.font = "20px Arial";
        useGetText.x = 7 + 5;
        useGetText.y = 7 + 90;
        this.addChild(useGetText);

        this.addEventListener("click", () => this.callback());
        
    }
    setCommandData(data: CreateGet, queue: ImageQueue, resourceHash: ResourceHash) {
        this.resetData();
        console.log(data,data.cost.length);
        for (let i = 0; i < data.cost.length; i++) {
            this.costIcons[i].image = getIconResource(resourceHash[data.cost[i].name].index, "resource", queue);
            console.log(data.cost[i].name);
            this.costIcons[i].scaleX = 0.5;
            this.costIcons[i].scaleY = 0.5;
            this.costNums[i].text = data.cost[i].number.toString();
        }

        for (let i = 0; i < data.get.length; i++) {
            this.getIcons[i].image = getIconResource(resourceHash[data.get[i].name].index, "resource", queue);
            this.getIcons[i].scaleX = 0.5;
            this.getIcons[i].scaleY = 0.5;
            this.getNums[i].text = data.get[i].number.toString();
        }
    }
    private resetData() {
        for (let i = 0; i < this.costIcons.length; i++){
            this.costIcons[i].image = null;
        }
        for (let i = 0; i < this.costNums.length; i++) {
            this.costNums[i].text = null;
        }
        for (let i = 0; i < this.getIcons.length; i++) {
            this.getIcons[i].image = null;
        }
        for (let i = 0; i < this.getNums.length; i++) {
            this.getNums[i].text = null;
        }
    }
}