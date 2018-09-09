import { global } from "../../boardGlobalData";

export class TopWindowR extends createjs.Container {

    constructor(queue: createjs.LoadQueue) {
        super();
        //イベント枠
        let topWindowsRFrame = new createjs.Bitmap(queue.getResult("topWindows"));
        topWindowsRFrame.scaleX = -1;
        topWindowsRFrame.x = global.canvasWidth;
        this.addChild(topWindowsRFrame);
    }

}