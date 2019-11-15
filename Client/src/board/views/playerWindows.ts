import { global } from "../../boardGlobalData"
import { PlayerWindowBase } from "./bases/playerWindowBase"
import { createMyShadow } from "../../utility";
import { ImageQueue } from "../imageQueue";

export class Player1Window extends PlayerWindowBase {
    constructor(queue: ImageQueue) {
        super(queue, "evenPlayerFrame", "evenPlayerFrame2");

        this.playerFrame.regX = this.playerFrame.image.width / 2;
        this.playerFrame.regY = 0;

        this.x = global.canvasWidth / 2;
        this.y = global.canvasHeight - this.playerFrame.image.height;

        this.playerNameText.color = "#00c6db";
        this.playerNameText.font = "20px Arial";
        this.playerNameText.textAlign = "center";
        this.playerNameText.y = 5;
        this.playerNameText.shadow = createMyShadow();

        this.speedText.textAlign = "center";
        this.speedText.x = (-3.5) * (this.playerFrame.image.width / 10);
        this.speedText.y = 35;
        this.speedText.color = "#f3f3f3";
        this.speedText.font = "15px Arial";
        this.speedText.shadow = createMyShadow();

        this.resourceText.textAlign = "center";
        this.resourceText.x = (-1.2) * (this.playerFrame.image.width / 10);
        this.resourceText.y = 35;
        this.resourceText.color = "#f3f3f3";
        this.resourceText.font = "15px Arial";
        this.resourceText.shadow = createMyShadow();

        this.activityRangeText.textAlign = "center";
        this.activityRangeText.x = (1.2) * (this.playerFrame.image.width / 10);
        this.activityRangeText.y = 35;
        this.activityRangeText.color = "#f3f3f3";
        this.activityRangeText.font = "15px Arial";
        this.activityRangeText.shadow = createMyShadow();

        this.uncertaintyText.textAlign = "center";
        this.uncertaintyText.x = (3.5) * (this.playerFrame.image.width / 10);
        this.uncertaintyText.y = 35;
        this.uncertaintyText.color = "#f3f3f3";
        this.uncertaintyText.font = "15px Arial";
        this.uncertaintyText.shadow = createMyShadow();

        this.positiveText.textAlign = "center";
        this.positiveText.x = (-1) * (this.playerFrame.image.width / 8);
        this.positiveText.y = 60;
        this.positiveText.color = "#00ee00";
        this.positiveText.font = "15px Arial";
        this.positiveText.shadow = createMyShadow();

        this.negativeText.textAlign = "center";
        this.negativeText.x = (1) * (this.playerFrame.image.width / 8);
        this.negativeText.y = 60;
        this.negativeText.color = "#ff0000";
        this.negativeText.font = "15px Arial";
        this.negativeText.shadow = createMyShadow();

        this.gmIcon.x = -100;
        this.gmIcon.y = 5;
        this.gmIcon.scaleX = 0.4;
        this.gmIcon.scaleY = 0.4;
    }

}

export class Player2Window extends PlayerWindowBase {
    constructor(queue: ImageQueue) {
        super(queue, "oddPlayerFrame", "oddPlayerFrame2");

        this.playerFrame.regY = this.playerFrame.image.height / 2;

        this.y = global.canvasHeight / 2;

        this.playerNameText.textAlign = "center";
        this.playerNameText.color = "#00dd00";
        this.playerNameText.font = "14px Arial";
        this.playerNameText.x = (this.playerFrame.image.width / 2);
        this.playerNameText.y = -60;
        this.playerNameText.shadow = createMyShadow();

        this.speedText.textAlign = "center";
        this.speedText.x = (this.playerFrame.image.width / 2);
        this.speedText.y = -30;
        this.speedText.color = "#f3f3f3";
        this.speedText.font = "12px Arial";
        this.speedText.shadow = createMyShadow();

        this.resourceText.textAlign = "center";
        this.resourceText.x = (this.playerFrame.image.width / 2);
        this.resourceText.y = -15;
        this.resourceText.color = "#f3f3f3";
        this.resourceText.font = "12px Arial";
        this.resourceText.shadow = createMyShadow();

        this.activityRangeText.textAlign = "center";
        this.activityRangeText.x = (this.playerFrame.image.width / 2);
        this.activityRangeText.y = 0;
        this.activityRangeText.color = "#f3f3f3";
        this.activityRangeText.font = "12px Arial";
        this.activityRangeText.shadow = createMyShadow();

        this.uncertaintyText.textAlign = "center";
        this.uncertaintyText.x = (this.playerFrame.image.width / 2);
        this.uncertaintyText.y = 15;
        this.uncertaintyText.color = "#f3f3f3";
        this.uncertaintyText.font = "12px Arial";
        this.uncertaintyText.shadow = createMyShadow();

        this.positiveText.textAlign = "center";
        this.positiveText.x = (this.playerFrame.image.width / 2);
        this.positiveText.y = 45;
        this.positiveText.color = "#00ee00";
        this.positiveText.font = "12px Arial";
        this.positiveText.shadow = createMyShadow();

        this.negativeText.textAlign = "center";
        this.negativeText.x = (this.playerFrame.image.width / 2);
        this.negativeText.y = 60;
        this.negativeText.color = "#ff0000";
        this.negativeText.font = "12px Arial";
        this.negativeText.shadow = createMyShadow();

        this.gmIcon.x = (this.playerFrame.image.width / 2) - 12;
        this.gmIcon.y = -90;
        this.gmIcon.scaleX = 0.4;
        this.gmIcon.scaleY = 0.4;
    }
}


export class Player3Window extends PlayerWindowBase {
    constructor(queue: ImageQueue) {
        super(queue, "evenPlayerFrame", "evenPlayerFrame2");

        this.playerFrame.regX = this.playerFrame.image.width / 2;
        this.playerFrame.regY = this.playerFrame.image.height;
        this.playerFrame.rotation = 180;

        this.x = global.canvasWidth / 2;

        this.playerNameText.color = "#ddab40";
        this.playerNameText.font = "20px Arial";
        this.playerNameText.textAlign = "center";
        this.playerNameText.y = 5;
        this.playerNameText.shadow = createMyShadow();

        this.speedText.textAlign = "center";
        this.speedText.x = (-3.5) * (this.playerFrame.image.width / 10);
        this.speedText.y = 35;
        this.speedText.color = "#f3f3f3";
        this.speedText.font = "15px Arial";
        this.speedText.shadow = createMyShadow();

        this.resourceText.textAlign = "center";
        this.resourceText.x = (-1.2) * (this.playerFrame.image.width / 10);
        this.resourceText.y = 35;
        this.resourceText.color = "#f3f3f3";
        this.resourceText.font = "15px Arial";
        this.resourceText.shadow = createMyShadow();

        this.activityRangeText.textAlign = "center";
        this.activityRangeText.x = (1.2) * (this.playerFrame.image.width / 10);
        this.activityRangeText.y = 35;
        this.activityRangeText.color = "#f3f3f3";
        this.activityRangeText.font = "15px Arial";
        this.activityRangeText.shadow = createMyShadow();

        this.uncertaintyText.textAlign = "center";
        this.uncertaintyText.x = (3.5) * (this.playerFrame.image.width / 10);
        this.uncertaintyText.y = 35;
        this.uncertaintyText.color = "#f3f3f3";
        this.uncertaintyText.font = "15px Arial";
        this.uncertaintyText.shadow = createMyShadow();

        this.positiveText.textAlign = "center";
        this.positiveText.x = (-1) * (this.playerFrame.image.width / 8);
        this.positiveText.y = 60;
        this.positiveText.color = "#00ee00";
        this.positiveText.font = "15px Arial";
        this.positiveText.shadow = createMyShadow();

        this.negativeText.textAlign = "center";
        this.negativeText.x = (1) * (this.playerFrame.image.width / 8);
        this.negativeText.y = 60;
        this.negativeText.color = "red";
        this.negativeText.font = "15px Arial";
        this.negativeText.shadow = createMyShadow();

        this.gmIcon.x = -100;
        this.gmIcon.y = 5;
        this.gmIcon.scaleX = 0.4;
        this.gmIcon.scaleY = 0.4;

    }
}

export class Player4Window extends PlayerWindowBase {
    constructor(queue: ImageQueue) {
        super(queue, "oddPlayerFrame", "oddPlayerFrame2");

        this.playerFrame.regY = this.playerFrame.image.height / 2;
        this.playerFrame.regX = this.playerFrame.image.width;
        this.playerFrame.rotation = 180;
        this.y = global.canvasHeight / 2;
        this.x = global.canvasWidth - this.playerFrame.image.width;

        this.playerNameText.textAlign = "center";
        this.playerNameText.x = (this.playerFrame.image.width / 2);
        this.playerNameText.color = "#ddee41";
        this.playerNameText.font = "14px Arial";
        this.playerNameText.y = -60;
        this.playerNameText.shadow = createMyShadow();

        this.speedText.textAlign = "center";
        this.speedText.x = (this.playerFrame.image.width / 2);
        this.speedText.y = -30;
        this.speedText.color = "#f3f3f3";
        this.speedText.font = "12px Arial";
        this.speedText.shadow = createMyShadow();

        this.resourceText.textAlign = "center";
        this.resourceText.x = (this.playerFrame.image.width / 2);
        this.resourceText.y = -15;
        this.resourceText.color = "#f3f3f3";
        this.resourceText.font = "12px Arial";
        this.resourceText.shadow = createMyShadow();

        this.activityRangeText.textAlign = "center";
        this.activityRangeText.x = (this.playerFrame.image.width / 2);
        this.activityRangeText.y = 0;
        this.activityRangeText.color = "#f3f3f3";
        this.activityRangeText.font = "12px Arial";
        this.activityRangeText.shadow = createMyShadow();

        this.uncertaintyText.textAlign = "center";
        this.uncertaintyText.x = (this.playerFrame.image.width / 2);
        this.uncertaintyText.y = 15;
        this.uncertaintyText.color = "#f3f3f3";
        this.uncertaintyText.font = "12px Arial";
        this.uncertaintyText.shadow = createMyShadow();

        this.positiveText.textAlign = "center";
        this.positiveText.x = (this.playerFrame.image.width / 2);
        this.positiveText.y = 45;
        this.positiveText.color = "#00ee00";
        this.positiveText.font = "12px Arial";
        this.positiveText.shadow = createMyShadow();

        this.negativeText.textAlign = "center";
        this.negativeText.x = (this.playerFrame.image.width / 2);
        this.negativeText.y = 60;
        this.negativeText.color = "red";
        this.negativeText.font = "12px Arial";
        this.negativeText.shadow = createMyShadow();

        this.gmIcon.x = (this.playerFrame.image.width / 2) - 12;
        this.gmIcon.y = -90;
        this.gmIcon.scaleX = 0.4;
        this.gmIcon.scaleY = 0.4;
    }
}