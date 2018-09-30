import { global } from "../../boardGlobalData";
import { ImageQueue } from "../imageQueue";
import { Event } from "../../../Share/Yaml/eventYamlData";

export class TopWindowR extends createjs.Container {

    private eventTitle: createjs.Text;
    private eventLevel: createjs.Text;
    private textEvent: createjs.Text;
    private currentNum: createjs.Text;

    private levelColor: string[] = ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#a4c2f4"];

    constructor(queue: ImageQueue) {
        super();
        //イベント枠
        let topWindowsRFrame = queue.getImage("topWindows");
        topWindowsRFrame.scaleX = -1;
        topWindowsRFrame.x = global.canvasWidth;
        this.addChild(topWindowsRFrame);

        //現在のイベントテキスト
        this.eventTitle = new createjs.Text("", "28px Arial");
        this.eventLevel = new createjs.Text("", "18px Arial");
        this.textEvent = new createjs.Text("EVENT", "18px Arial");
        this.textEvent.color = "white";

        this.currentNum = new createjs.Text("", "18px Arial");
        this.currentNum.color = "white";

        //this.eventTitle.textAlign = "center";
        //this.eventTitle.regY = this.eventTitle.getMeasuredHeight() / 2;
        this.eventTitle.x = topWindowsRFrame.x - topWindowsRFrame.image.width / 2 - 15;
        this.eventTitle.y = topWindowsRFrame.y + topWindowsRFrame.image.height / 2 - 5;
        this.eventLevel.x = topWindowsRFrame.x - topWindowsRFrame.image.width / 2 - 80;
        this.eventLevel.y = topWindowsRFrame.y + topWindowsRFrame.image.height / 2 + 5;
        this.textEvent.x = topWindowsRFrame.x - topWindowsRFrame.image.width / 2 - 90;
        this.textEvent.y = topWindowsRFrame.y + topWindowsRFrame.image.height / 2 - 25;
        this.currentNum.x = topWindowsRFrame.x - topWindowsRFrame.image.width / 2 - 20;
        this.currentNum.y = topWindowsRFrame.y + topWindowsRFrame.image.height / 2 - 25;

        this.addChild(this.eventTitle);
        this.addChild(this.eventLevel);
        this.addChild(this.textEvent);
        this.addChild(this.currentNum);
    }
    setEventNum(num: string){
        this.currentNum.text = num;
    }
    setEventName(event: Event) {
        this.eventTitle.text = event.name;
        this.eventLevel.text = "Level." + event.level;

        this.eventTitle.color = this.levelColor[event.level - 1];
        this.eventLevel.color = this.levelColor[event.level - 1];
    }

}