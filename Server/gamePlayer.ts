import { SocketBinder } from "./socketBinder";
import { GamePlayerState } from "../Share/gamePlayerState";
import { PlayerData } from "./playerData";

export class GamePlayer {
    private uuid: string;
    private state: SocketBinder<GamePlayerState>;
    constructor(playerData: PlayerData, socket: SocketIO.Namespace) {
        this.uuid = playerData.getUuid();
        this.state = new SocketBinder<GamePlayerState>("GamePlayerState", socket);
        this.state.Value.playerName = playerData.getName();
    }
}