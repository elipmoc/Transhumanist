import { PlayerResourceAreaBase } from "./bases/playerResourceAreaBase";
import { PlayerBuildAreaBase } from "./bases/playerBuildAreaBase";

export class ResourceReserveArea extends PlayerResourceAreaBase {
    constructor() {
        super(6, 12);
        this.resourceList.x = 480 + 280;
        this.resourceList.y = 730;
    }
}

export class BuildReserveArea extends PlayerBuildAreaBase {
    constructor() {
        super(6, 12);
        this.buildList.x = 480 + 280;
        this.buildList.y = 665;
    }
}