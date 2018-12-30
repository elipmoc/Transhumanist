import { global } from "../../boardGlobalData";
import { createMyShadow } from "../../utility";
import { DecisionButton } from "./decisionButton";
import { PopupWindowBase } from "./bases/popupWindowBase";

export class SelectEventWindow extends PopupWindowBase {
    private layerUpdate: () => void;
    private submitCallback: (array: string[]) => void;
    private selectEvent: SelectEvent[] = [new SelectEvent(""), new SelectEvent(""), new SelectEvent("")];

    constructor(layerUpdate: () => void) {
        super(700, 400);

        this.layerUpdate = layerUpdate;

        const description = new createjs.Text("1 2 3の順でイベントは発生します。\n順番を入れ替える場合、入れ替える対象をクリックして下さい。");
        description.textAlign = "center";
        description.color = "white";
        description.font = "22px Bold ＭＳゴシック";
        description.shadow = createMyShadow();
        description.x = global.canvasWidth / 2;
        description.y = global.canvasHeight / 2 - 160;
        this.addChild(description);
        
        const orderText: createjs.Text[] = [
            new createjs.Text("1"),
            new createjs.Text("2"),
            new createjs.Text("3")];

        orderText.forEach((e, i) => {
            e.y = global.canvasHeight / 2 - 70;
            e.x = global.canvasWidth / 2;
            e.x = e.x + (240 * (i - 1));

            e.textAlign = "center";
            e.color = "white";
            e.font = "30px ＭＳ ゴシック";
            e.shadow = createMyShadow();
            this.addChild(e);
        });
        this.selectEvent.forEach((e, i) => {
            e.y = global.canvasHeight / 2 + 20;
            e.x = global.canvasWidth / 2;
            e.x = e.x + (240 * (i - 1));
            e.addEventListener("click", () => this.eventButtonClick(i));
            e.BeginIndex = i;
            e.NowIndex = i;

            e.Enable = false;
            e.alpha = 0.0;
            this.addChild(e);
        });

        const submit = new DecisionButton("決定");
        submit.x = global.canvasWidth / 2;
        submit.y = global.canvasHeight / 2 + 130;
        submit.addEventListener("click", () => this.submitCallback(this.beginArrayCreate()));
        this.addChild(submit);
    }

    setData(data:string[]) {
        this.selectEvent.forEach((e, i) => {
            if (data.length > i) {
                e.Enable = true;
                e.CardName = data[i];
                e.BeginIndex = i;
                e.NowIndex = i;
                e.alpha = 1.0;
            }
            else {
                e.Enable = false;
                e.alpha = 0.0;
            }
        });
    }
    beginArrayCreate() {
        const enableArray = this.selectEvent.filter((x) => { return x.Enable});
        let beginIdArray = new Array(enableArray.length);
        enableArray.forEach((e,i) => {
            beginIdArray[i] = e.CardName;
        });
        return beginIdArray;
    }
    submitOnClick(f: (array: string[]) => void) {
        this.submitCallback = f;   
    }
    eventButtonClick(index: number) {
        if (this.selectEvent[index].Enable) {
            this.selectEvent[index].Selected = !this.selectEvent[index].Selected;
            this.selectEvent[index].alphaUpdate();
        }

        if(this.selectEvent.filter((x)=>{return x.Selected}).length == 2) {
            //swap!
            const swapData = this.selectEvent.filter((x) => { return x.Selected });
            const tempNumber: number = this.selectEvent[swapData[0].NowIndex].BeginIndex;
            const tempString: string = this.selectEvent[swapData[0].NowIndex].CardName;

            this.selectEvent[swapData[0].NowIndex].BeginIndex = this.selectEvent[swapData[1].NowIndex].BeginIndex;
            this.selectEvent[swapData[0].NowIndex].CardName = this.selectEvent[swapData[1].NowIndex].CardName;
            this.selectEvent[swapData[1].NowIndex].BeginIndex = tempNumber;
            this.selectEvent[swapData[1].NowIndex].CardName = tempString;
            
            this.selectEvent.forEach((x) => {
                x.Selected = false;
                x.alphaUpdate();
            });
        }
        this.layerUpdate();
    };
}

class SelectEvent extends createjs.Container {
    private cardName: createjs.Text;
    private selected = false;
    private enable = false;
    private beginIndex: number;
    private nowIndex: number;
    readonly width = 200;
    readonly height = 100;

    constructor(name: string) {
        super();

        const base = new createjs.Shape();
        base.graphics.beginFill("white").drawRect(- this.width/2,- this.height/2, this.width, this.height);
        this.addChild(base);

        this.cardName = new createjs.Text(name);
        this.cardName.textAlign = "center";
        this.cardName.color = "black";
        this.cardName.font = "19px Bold ＭＳ ゴシック";
        this.cardName.y = -8;
        this.addChild(this.cardName);
    }

    get CardName() { return this.cardName.text;}
    set CardName(name: string) {
        this.cardName.text = name;
    }
    get Enable() { return this.enable; }
    set Enable(val: boolean) {
        this.enable = val;
    } 
    get Selected() {return this.selected;}
    set Selected(val: boolean) {
        this.selected = val;
    }
    get BeginIndex() { return this.beginIndex;}
    set BeginIndex(val: number) {
        this.beginIndex = val;
    }
    get NowIndex() { return this.nowIndex; }
    set NowIndex(val: number) {
        this.nowIndex = val;
    }
    alphaUpdate() {
        if(this.enable) this.alpha = this.selected ? 0.5 : 1.0;
    }
}