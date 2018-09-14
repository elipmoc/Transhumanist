import { global } from "../../boardGlobalData"
import { PlayerResourceAreaBase } from "./bases/playerResourceAreaBase"
import { ImageQueue } from "../imageQueue";


export class Player1ResourceArea extends PlayerResourceAreaBase {
    constructor(queue: ImageQueue) {
        super(15);
        this.resourceArea.image = queue.getImage("oddPlayerRBArea").image;
        this.resourceArea.regX = this.resourceArea.image.width / 2;
        this.resourceArea.regY = this.resourceArea.image.height;
        this.resourceArea.x = global.canvasWidth / 2;
        this.resourceArea.y = global.canvasHeight - 85;

        this.resourceList.x = global.canvasWidth / 2 - this.resourceArea.image.width / 2;
        this.resourceList.y = global.canvasHeight - this.resourceArea.image.height - 85;

    }
}

export class Player2ResourceArea extends PlayerResourceAreaBase {
    constructor(queue: ImageQueue) {
        super(5);
        this.resourceArea.image = queue.getImage("evenPlayerRBArea").image;
        this.resourceArea.regX = 0;
        this.resourceArea.regY = this.resourceArea.image.height / 2;
        this.resourceArea.x = 100;
        this.resourceArea.y = global.canvasHeight / 2 - (this.resourceArea.image.height / 2) - 2;
        this.resourceList.x = 100;
        this.resourceList.y = global.canvasHeight / 2 - (this.resourceArea.image.height) - 2;
    }
}

export class Player3ResourceArea extends PlayerResourceAreaBase {
    constructor(queue: ImageQueue) {
        super(15);
        this.resourceArea.image = queue.getImage("oddPlayerRBArea").image;
        this.resourceArea.regX = this.resourceArea.image.width / 2;
        this.resourceArea.regY = 0;
        this.resourceArea.x = global.canvasWidth / 2;
        this.resourceArea.y = 85;
        this.resourceList.x = global.canvasWidth / 2 - this.resourceArea.image.width / 2;
        this.resourceList.y = 85;
    }
}

export class Player4ResourceArea extends PlayerResourceAreaBase {
    constructor(queue: ImageQueue) {
        super(5);
        this.resourceArea.image = queue.getImage("evenPlayerRBArea").image;
        this.resourceArea.regX = this.resourceArea.image.width;
        this.resourceArea.regY = this.resourceArea.image.height / 2;
        this.resourceArea.x = global.canvasWidth - 100;
        this.resourceArea.y = global.canvasHeight / 2 - (this.resourceArea.image.height / 2) - 2;
        this.resourceList.x = global.canvasWidth - 100 - this.resourceArea.image.width;
        this.resourceList.y = global.canvasHeight / 2 - (this.resourceArea.image.height) - 2;
    }
}