import { GamePlayer } from "./gamePlayer";
import { PlayerData } from "../playerData";
import { StartStatusYamlData } from "../../Share/Yaml/startStatusYamlData";
import { arrayshuffle } from "../../Share/utility";
import { TurnManager } from "./turnManager";
import { SocketBinder } from "../socketBinder";
import { EventCardDrawer } from "./eventCardDrawer";
import { ActionCardStacks } from "./drawCard/actionCardStacks";
import { LeaveRoom } from "./leaveRoom";


export class GamePlayers {
    private gamePlayerList: GamePlayer[] = new Array();
    private gameMasterPlayerId: SocketBinder.Binder<number | null>;
    private turnManager: TurnManager;
    private leaveRoomCallback: (player: GamePlayer) => void;

    constructor(boardSocketManager: SocketBinder.Namespace, eventCardDrawer: EventCardDrawer) {
        this.gameMasterPlayerId = new SocketBinder.Binder<number | null>("gameMasterPlayerId")
        boardSocketManager.addSocketBinder(this.gameMasterPlayerId);
        this.turnManager = new TurnManager(this.gamePlayerList, eventCardDrawer, boardSocketManager);
        new LeaveRoom(boardSocketManager)
            .onLeaveRoom(id => {
                this.leaveRoomCallback(this.gamePlayerList[id]);
            });
    }

    onLeaveRoom(callback: (player: GamePlayer) => void) {
        this.leaveRoomCallback = callback;
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
        boardSocketManager: SocketBinder.Namespace,
        actionCardStacks: ActionCardStacks
    ) {
        const player = new GamePlayer(playerData, playerId, boardSocketManager, actionCardStacks);
        if (this.gameMasterPlayerId.Value == null) {
            this.gameMasterPlayerId.Value = playerId;
            player.IsGameMaster = true;
        }
        this.gamePlayerList.push(player);
        return player;
    }

    initCard(startStatusList: StartStatusYamlData[], actionCardStacks: ActionCardStacks) {
        arrayshuffle(startStatusList);
        this.gamePlayerList.forEach((x, idx) => {
            x.setAICard(startStatusList[idx]);
            x.drawActionCard(actionCardStacks.draw(1));
            for (let i = 0; i < 4; i++) {
                x.drawActionCard(actionCardStacks.draw(Math.floor(Math.random() * 2) + 2));
                x.setResourceList();
            }
        });
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

    winWar(playerId: number) {
        this.gamePlayerList.find(x => x.PlayerId == playerId)!.winWar();
    }
    loseWar(playerId: number) {
        this.gamePlayerList.find(x => x.PlayerId == playerId)!.loseWar();
    }
    startWar(playerId: number) {
        this.gamePlayerList.find(x => x.PlayerId == playerId)!.startWar();
    }

}