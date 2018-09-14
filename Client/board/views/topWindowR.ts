import { global } from "../../boardGlobalData";
import { ImageQueue } from "../imageQueue";

export class TopWindowR extends createjs.Container {

    private text: createjs.Text;

    constructor(queue: ImageQueue) {
        super();
        //イベント枠
        let topWindowsRFrame = queue.getImage("topWindows");
        topWindowsRFrame.scaleX = -1;
        topWindowsRFrame.x = global.canvasWidth;
        this.addChild(topWindowsRFrame);

        //現在のイベントテキスト
        this.text = new createjs.Text("", "32px Arial");
        this.text.color = "white";
        this.text.textAlign = "center";
        this.text.regY = this.text.getMeasuredHeight() / 2;
        this.text.x = topWindowsRFrame.x - topWindowsRFrame.image.width / 2 - 20;
        this.text.y = topWindowsRFrame.y + topWindowsRFrame.image.height / 2 - 10;
        this.addChild(this.text);
    }
    setEventName(name: string) {
        this.text.text = name;
    }

}