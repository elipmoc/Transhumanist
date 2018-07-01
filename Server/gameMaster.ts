import { GamePlayer } from "./gamePlayer";
import { PlayerData } from "./playerData";
import { SocketBinder } from "./socketBinder";
import { GamePlayerState } from "../Share/gamePlayerState";
import { ResourceKind } from "../Share/resourceKind";
import { SocketBinderList } from "./socketBinderList";
import { BuildActionKind } from "../Share/buildActionKind";
import { DiceNumber } from "../Share/diceNumber";

export class GameMaster {
    private gamePlayerList: GamePlayer[] = new Array();

    getGamePlayer(uuid: string) {
        return this.gamePlayerList.find(x => x.Uuid == uuid);
    }

    addMember(
        playerData: PlayerData, playerId: number,
        state: SocketBinder<GamePlayerState>, resourceList: SocketBinderList<ResourceKind>
        , buildActionList: SocketBinderList<BuildActionKind>, diceList: SocketBinder<DiceNumber[]>
    ) {
        this.gamePlayerList.push(new GamePlayer(playerData, playerId, state, resourceList, buildActionList, diceList));
    }

    sendToSocket(socket: SocketIO.Socket) {
        this.gamePlayerList.forEach(x => x.sendToSocket(socket));
    }
}