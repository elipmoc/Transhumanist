
import { global } from "../../boardGlobalData";
import { createMyShadow } from "../../utility";
import { DecisionButton } from "./decisionButton";
import { PopupWindowBase } from "./bases/popupWindowBase";

//未来予想装置のイベント選択用のviwe
export class SelectEventWindow extends PopupWindowBase {

    private cardName = new createjs.Text();
    private callback: () => void;
    private selectEvent: SelectEvent[] = [new SelectEvent(""), new SelectEvent(""), new SelectEvent("")];

    constructor() {
        super(700, 400);

        const description = new createjs.Text("1 2 3の順でイベントは発生します。/n順番を入れ替える場合、入れ替える対象をクリックして下さい。");
        description.textAlign = "center";
        description.shadow = createMyShadow();

        this.selectEvent.forEach((e, i) => {
            e.y = global.canvasHeight / 2;
            e.x = global.canvasWidth / 2;

            e.x = e.x + (140 * (i - 1));
            e.addEventListener("click", () => { this.eventButtonClick(i) });
        });
    }

    eventButtonClick(index: number) {
        this.selectEvent[index].Selected =
            !this.selectEvent[index].Selected;

        if (this.selectEvent.filter((x) => {
            x.Selected
        }).length == 2) {
            //swap!

            this.selectEvent.forEach((x) => {
                x.Selected = false;
            });
        }
    };
}

class SelectEvent extends createjs.Container {
    private cardName: createjs.Text;
    private selected: boolean;
    readonly size = 100;

    constructor(name: string) {
        super();

        const base = new createjs.Shape();
        base.graphics.beginFill("white").drawRect(- this.size / 2, - this.size / 2, this.size, this.size);
        this.addChild(base);

        this.cardName = new createjs.Text(name);
        this.cardName.textAlign = "center";
        this.cardName.color = "black";
        this.cardName.font = "28px ＭＳ ゴシック";
        this.addChild(this.cardName);
    }

    setName(name: string) {
        this.cardName.text = name;
    }
    get Selected() { return this.selected; }
    set Selected(val: boolean) { this.selected = val; }
}