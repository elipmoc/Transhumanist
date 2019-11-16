import { global } from "../../boardGlobalData";
import { createMyShadow } from "../../utility";
import { EventLogMessageForClient } from "../../Share/eventLogMessageForClient";
import { ImageQueue } from "../imageQueue";


//イベントログウインドウ
export class EventLogWindow extends createjs.Container {
    private titleText: createjs.Text;
    private descriptionText: createjs.Text;

    constructor(queue: ImageQueue) {
        super();
        const eventFrame = queue.getImage("eventFrame");
        eventFrame.x = global.canvasWidth / 2 - eventFrame.image.width / 2;
        eventFrame.y = global.canvasHeight / 2 + eventFrame.image.height - 35 - 100;
        this.titleText = new createjs.Text();
        this.titleText.x = eventFrame.x + 15;
        this.titleText.y = eventFrame.y + 10;
        this.titleText.color = "yellow";
        this.titleText.font = "16px Arial";
        this.titleText.shadow = createMyShadow();

        this.descriptionText = new createjs.Text();
        this.descriptionText.x = eventFrame.x + 15;
        this.descriptionText.y = eventFrame.y + 40;
        this.descriptionText.color = "white";
        this.descriptionText.font = "16px Arial";
        this.descriptionText.shadow = createMyShadow();
        this.addChild(eventFrame);
        this.addChild(this.titleText);
        this.addChild(this.descriptionText);
    }
    setMessaage(msg: EventLogMessageForClient) {
        this.titleText.text = msg.eventTitle;
        this.descriptionText.text = msg.eventDescription;
    }
}
