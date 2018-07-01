import { SocketBinder } from "./socketBinder";
import { GamePlayerState } from "../Share/gamePlayerState";
import { PlayerData } from "./playerData";
import { ResourceKind } from "../Share/resourceKind";
import { SocketBinderList } from "./socketBinderList";
import { BuildActionKind } from "../Share/buildActionKind";
import { DiceNumber } from "../Share/diceNumber";

export class GamePlayer {
    private playerId: number;
    private uuid: string;
    private state: SocketBinder<GamePlayerState>;
    private resourceList: SocketBinderList<ResourceKind>;
    private buildActionList: SocketBinderList<BuildActionKind>;
    private diceList: SocketBinder<DiceNumber[]>;

    get Uuid() { return this.uuid; }
    get PlayerId() { return this.playerId; }

    constructor(
        playerData: PlayerData,
        playerId: number,
        state: SocketBinder<GamePlayerState>,
        resourceList: SocketBinderList<ResourceKind>,
        buildActionList: SocketBinderList<BuildActionKind>,
        diceList: SocketBinder<DiceNumber[]>
    ) {
        this.diceList = diceList;
        this.diceList.Value = [0, 1, 2];
        this.playerId = playerId;
        this.uuid = playerData.getUuid();
        this.state = state;
        this.resourceList = resourceList;
        this.buildActionList = buildActionList;
        this.state.Value = {
            playerName: playerData.getName(),
            negative: 0, positive: 0,
            uncertainty: 0, resource: 0,
            activityRange: 0, speed: 0
        };
        this.buildActionList.Value = [
            BuildActionKind.mining_facility,
            BuildActionKind.church,
            BuildActionKind.church,
            BuildActionKind.church,
            BuildActionKind.church,
            BuildActionKind.church,
            BuildActionKind.church,
            BuildActionKind.church,
            BuildActionKind.church,
            BuildActionKind.church,
            BuildActionKind.church,
            BuildActionKind.church,
            BuildActionKind.church,
            BuildActionKind.church,
            BuildActionKind.church,
            BuildActionKind.fusion_reactor,
            BuildActionKind.robot_factory,
        ];
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

    //ユーザーにsocketBinderの値を送信する
    sendToSocket(socket: SocketIO.Socket) {
        this.state.updateAt(socket);
        this.resourceList.updateAt(socket);
        this.buildActionList.updateAt(socket);
        this.diceList.updateAt(socket);
    }
}