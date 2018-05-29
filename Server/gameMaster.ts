import { GamePlayer } from "./gamePlayer";
import { PlayerData } from "./playerData";
import { SocketBinder } from "./socketBinder";
import { GamePlayerState } from "../Share/gamePlayerState";
import { ResourceKind } from "../Share/resourceKind";
import { SocketBinderList } from "./socketBinderList";

export class GameMaster {
    private gamePlayerList: GamePlayer[] = new Array();

    getGamePlayer(uuid: string) {
        return this.gamePlayerList.find(x => x.Uuid == uuid);
    }

    addMember(playerData: PlayerData, playerId: number, state: SocketBinder<GamePlayerState>, resourceList: SocketBinderList<ResourceKind>) {
        this.gamePlayerList.push(new GamePlayer(playerData, playerId, state, resourceList));
    }

    sendToSocket(socket: SocketIO.Socket) {
        this.gamePlayerList.forEach(x => x.sendToSocket(socket));
    }
}