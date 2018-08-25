import { GamePlayer } from "./gamePlayer";
import { PlayerData } from "./playerData";
import { SocketBinder } from "./socketBinder";
import { ResponseGamePlayerState } from "../Share/responseGamePlayerState";
import { SocketBinderList } from "./socketBinderList";
import { DiceNumber } from "../Share/diceNumber";
import { ResourceName } from "../Share/Yaml/resourceYamlData";
import { ActionCardName } from "../Share/Yaml/actionCardYamlData";
import { GamePlayerCondition } from "../Share/gamePlayerCondition";
import { StartStatusYamlData } from "../Share/Yaml/startStatusYamlData";
import { arrayshuffle } from "../Share/utility";


export class GamePlayers {
    private gamePlayerList: GamePlayer[] = new Array();
    private gameMasterPlayerId: SocketBinder<number | null>;

    constructor(gameMasterPlayerId: SocketBinder<number | null>) {
        this.gameMasterPlayerId = gameMasterPlayerId;
    }

    canStart() {
        //プレイヤーが二人以上でゲーム開始できる
        return this.gamePlayerList.length > 1;
    }

    getGamePlayer(uuid: string) {
        return this.gamePlayerList.find(x => x.Uuid == uuid);
    }

    addMember(
        playerData: PlayerData, playerId: number,
        state: SocketBinder<ResponseGamePlayerState>, resourceList: SocketBinderList<ResourceName>
        , buildActionList: SocketBinderList<ActionCardName>, diceList: SocketBinder<DiceNumber[]>
        , actionCardList: SocketBinderList<string | null>
        , playerCond: SocketBinder<GamePlayerCondition>
    ) {
        const player = new GamePlayer(playerData, playerId, state, resourceList, buildActionList, diceList, actionCardList, playerCond);
        if (this.gameMasterPlayerId.Value == null) {
            this.gameMasterPlayerId.Value = playerId;
            player.IsGameMaster = true;
        }
        this.gamePlayerList.push(player);
    }

    setAICard(startStatusList: StartStatusYamlData[]) {
        arrayshuffle(startStatusList);
        this.gamePlayerList.forEach((player, index) => player.setAICard(startStatusList[index]));
        this.initTurnSet();
    }

    private initTurnSet() {
        const firstTurnPlayerId = Math.floor(Math.random() * this.gamePlayerList.length);
        this.gamePlayerList[firstTurnPlayerId].setMyTurn();
        this.gamePlayerList.forEach((player, id) => {
            if (id != firstTurnPlayerId) player.setWait();
        });
    }

    sendToSocket(socket: SocketIO.Socket) {
        this.gamePlayerList.forEach(x => x.sendToSocket(socket));
        this.gameMasterPlayerId.updateAt(socket);
    }
}