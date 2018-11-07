import { global } from "../../boardGlobalData";
import { createMyShadow } from "../../utility";
import { ResourceCardIcon, CardIconBase } from "./cardIcon";
import { ResourceName, ResourceIndex } from "../../../Share/Yaml/resourceYamlData";
import { IconList } from "./bases/iconList";
import { ImageQueue } from "../imageQueue";

export class SelectResourceWindow extends createjs.Container {
    private resourceNumber: number;
    private maxLength: number;
    private descriptionText = new createjs.Text();
    protected resourceList: IconList<ResourceCardIcon, ResourceName>;
    
    constructor(maxNum:number) {
        super();
        this.maxLength = maxNum;
        this.resourceList = new IconList<ResourceCardIcon, ResourceName>(this.maxLength, this.maxLength, ResourceCardIcon)
        this.resourceList.x = global.canvasWidth / 2 - (global.cardIconSize * this.maxLength / 2) / 2;
        this.resourceList.y = global.canvasHeight / 2 - global.cardIconSize / 2;
 
        const frame = new createjs.Shape();
        const frameX = 700;
        const frameY = 290;
        frame.graphics.beginFill("gray").
            drawRect(0, 0, frameX, frameY);
        frame.x = global.canvasWidth / 2 - frameX / 2;
        frame.y = global.canvasHeight / 2 - frameY / 2;

        
        this.descriptionText.textAlign = "center";
        this.descriptionText.text = "";
        this.descriptionText.font = "20px Bold ＭＳ ゴシック";
        this.descriptionText.color = "white";
        this.descriptionText.shadow = createMyShadow();
        this.descriptionText.x = global.canvasWidth / 2;
        this.descriptionText.y = global.canvasHeight / 2 - 130;

        this.addChild(frame);
        this.addChild(this.resourceList);
        this.addChild(this.descriptionText);
    }

    //リソースを選択する回数設定
    setNumber(number: number){
        this.resourceNumber = number;
        this.descriptionText.text = "欲しいリソースを" + this.resourceNumber + "つ選択してください";
    }
    getNumber(){
        return this.resourceNumber;
    }
    //numberの減算
    decreaseNumber() {
        this.resourceNumber--;
        this.descriptionText.text = "欲しいリソースを" + this.resourceNumber + "つ選択してください";
    }

    //リソースアイコンがクリックされた時に呼ばれる関数をセットする
    onClickIcon(onClickIconCallBack: (cardIcon: CardIconBase<ResourceName>) => void) {
        this.resourceList.onClickedIcon(onClickIconCallBack);
    }
    
    //リソースのセット
    setResource(iconId: number, resourceName: ResourceName, resourceIndex: ResourceIndex, queue: ImageQueue) {
        this.resourceList.setResource(iconId, resourceName, resourceIndex, queue);
    }
    
    //リソースの全削除
    resetResource(queue: ImageQueue) {
        for (let i = 0; this.maxLength > i; i++){
            this.resourceList.setResource(i, "", -1, queue);
        }
    }
}