import { GamePlayer } from "./gamePlayer";
import { PlayerData } from "./playerData";
import { SocketBinder } from "./socketBinder";
import { StartStatusYamlData } from "../Share/Yaml/startStatusYamlData";
import { arrayshuffle } from "../Share/utility";
import { TurnManager } from "./turnManager";
import { SocketNamespace } from "./socketBindManager";


export class GamePlayers {
    private gamePlayerList: GamePlayer[] = new Array();
    private gameMasterPlayerId: SocketBinder<number | null>;
    private turnManager: TurnManager;

    constructor(boardSocketManager: SocketNamespace) {
        this.gameMasterPlayerId = new SocketBinder<number | null>("gameMasterPlayerId")
        const turn = new SocketBinder<number>("turn");
        boardSocketManager.addSocketBinder(this.gameMasterPlayerId, turn);
        this.turnManager = new TurnManager(this.gamePlayerList, turn);
    }

    getPlayerAll(func: (x: GamePlayer) => void) {
        this.gamePlayerList.forEach(func);
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
        boardSocketManager: SocketNamespace
    ) {
        const player = new GamePlayer(playerData, playerId, boardSocketManager);
        if (this.gameMasterPlayerId.Value == null) {
            this.gameMasterPlayerId.Value = playerId;
            player.IsGameMaster = true;
        }
        this.gamePlayerList.push(player);
    }

    setAICard(startStatusList: StartStatusYamlData[]) {
        arrayshuffle(startStatusList);
        this.gamePlayerList.forEach((player, index) => player.setAICard(startStatusList[index]));
    }

    initTurnSet() {
        const firstTurnPlayerId = this.turnManager.nextTurnPlayerId()!;
        this.gamePlayerList.forEach(player => {
            if (player.PlayerId != firstTurnPlayerId) player.setWait();
            else player.setMyTurn();
        });
    }

    rotateTurn() {
        const currentPlayerId = this.turnManager.nextTurnPlayerId();
        this.gamePlayerList.forEach(player => {
            if (player.PlayerId != currentPlayerId) player.setWait();
            else player.setMyTurn();
        })
    }
}