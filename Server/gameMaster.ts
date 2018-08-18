import { GamePlayer } from "./gamePlayer";
import { PlayerData } from "./playerData";
import { SocketBinder } from "./socketBinder";
import { GamePlayerState } from "../Share/gamePlayerState";
import { SocketBinderList } from "./socketBinderList";
import { DiceNumber } from "../Share/diceNumber";
import { ResourceName } from "../Share/Yaml/resourceYamlData";
import { ActionCardName } from "../Share/Yaml/actionCardYamlData";
import { GamePlayerCondition } from "../Share/gamePlayerCondition";

export class GameMaster {
    private gamePlayerList: GamePlayer[] = new Array();
    private gameMasterPlayerId: SocketBinder<number | null>;

    constructor(gameMasterPlayerId: SocketBinder<number | null>) {
        this.gameMasterPlayerId = gameMasterPlayerId;
    }

    getGamePlayer(uuid: string) {
        return this.gamePlayerList.find(x => x.Uuid == uuid);
    }

    addMember(
        playerData: PlayerData, playerId: number,
        state: SocketBinder<GamePlayerState>, resourceList: SocketBinderList<ResourceName>
        , buildActionList: SocketBinderList<ActionCardName>, diceList: SocketBinder<DiceNumber[]>
        , actionCardList: SocketBinderList<string | null>
        , playerCond: SocketBinder<GamePlayerCondition>
    ) {
        if (this.gameMasterPlayerId.Value == null)
            this.gameMasterPlayerId.Value = playerId;
        this.gamePlayerList.push(new GamePlayer(playerData, playerId, state, resourceList, buildActionList, diceList, actionCardList, playerCond));
    }

    sendToSocket(socket: SocketIO.Socket) {
        this.gamePlayerList.forEach(x => x.sendToSocket(socket));
        this.gameMasterPlayerId.updateAt(socket);
    }
}