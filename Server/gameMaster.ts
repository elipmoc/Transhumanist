import { GamePlayer } from "./gamePlayer";
import { PlayerData } from "./playerData";

export class GameMaster {
    private gamePlayerList: GamePlayer[] = new Array();
    addMember(playerData: PlayerData, playerId: number, boardSocket: SocketIO.Namespace) {
        this.gamePlayerList.push(new GamePlayer(playerData, playerId, boardSocket));
    }
}