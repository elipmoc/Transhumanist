import { PlayerResourceAreaBase } from "./bases/playerResourceAreaBase";

export class ResourceReserveArea extends PlayerResourceAreaBase {
    constructor() {
        super(6, 12);
        this.resourceList.x = 480 + 280;
        this.resourceList.y = 730;
    }
}