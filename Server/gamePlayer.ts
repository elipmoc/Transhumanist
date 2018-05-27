import { SocketBinder } from "./socketBinder";
import { GamePlayerState } from "../Share/gamePlayerState";
import { PlayerData } from "./playerData";
import { ResourceKind } from "../Share/resourceKind";
import { SocketBinderList } from "./socketBinderList";

export class GamePlayer {
    private playerId: number;
    private uuid: string;
    private state: SocketBinder<GamePlayerState>;
    private resourceList: SocketBinderList<ResourceKind>;

    get Uuid() { return this.uuid; }
    get PlayerId() { return this.playerId; }

    constructor(playerData: PlayerData, playerId: number, boardSocket: SocketIO.Namespace) {
        this.playerId = playerId;
        this.uuid = playerData.getUuid();
        this.state = new SocketBinder<GamePlayerState>("GamePlayerState" + playerId, boardSocket);
        this.resourceList = new SocketBinderList<ResourceKind>("ResourceKindList" + playerId, boardSocket);
        this.state.Value = {
            playerName: playerData.getName(),
            negative: 0, positive: 0,
            uncertainty: 0, resource: 0,
            activityRange: 0, speed: 0
        };
        this.resourceList.Value = [
            ResourceKind.human,
            ResourceKind.human,
            ResourceKind.human,
            ResourceKind.human,
            ResourceKind.human,
            ResourceKind.bible,
            ResourceKind.bible,
            ResourceKind.cpu,
            ResourceKind.cpu,
            ResourceKind.cpu,
            ResourceKind.cpu,
            ResourceKind.cpu,
            ResourceKind.cpu,
            ResourceKind.cpu,
            ResourceKind.extended_human,
            ResourceKind.extended_human,
            ResourceKind.extended_human,
            ResourceKind.extended_human,
            ResourceKind.extended_human,
            ResourceKind.extended_human,
        ];
    }
}