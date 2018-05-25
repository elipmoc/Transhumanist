import { SocketBinder } from "./socketBinder";
import { GamePlayerState } from "../Share/gamePlayerState";
import { PlayerData } from "./playerData";

export class GamePlayer {
    private uuid: string;
    private state: SocketBinder<GamePlayerState>;
    constructor(playerData: PlayerData, playerId: number, boardSocket: SocketIO.Namespace) {
        this.uuid = playerData.getUuid();
        this.state = new SocketBinder<GamePlayerState>("GamePlayerState" + playerId, boardSocket);
        this.state.Value = {
            playerName: playerData.getName(),
            negative: 0, positive: 0,
            uncertainty: 0, resource: 0,
            activityRange: 0, speed: 0
        };
    }
}