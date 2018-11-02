import { GamePlayer } from "./gamePlayer";
import { PlayerData } from "../playerData";
import { StartStatusYamlData } from "../../Share/Yaml/startStatusYamlData";
import { arrayshuffle } from "../../Share/utility";
import { TurnManager } from "./turnManager";
import { SocketBinder } from "../socketBinder";
import { EventCardDrawer } from "./eventCardDrawer";
import { ActionCardStacks } from "./drawCard/actionCardStacks";
import { LeaveRoom } from "./leaveRoom";
import { GamePlayerCondition } from "../../Share/gamePlayerCondition";


export class GamePlayers {
    private gamePlayerList: GamePlayer[] = new Array();
    private gameMasterPlayerId: SocketBinder.Binder<number | null>;
    private turnManager: TurnManager;
    private leaveRoomCallback: (player: GamePlayer) => boolean;

    constructor(boardSocketManager: SocketBinder.Namespace, eventCardDrawer: EventCardDrawer, actionCardStacks: ActionCardStacks) {
        this.gameMasterPlayerId = new SocketBinder.Binder<number | null>("gameMasterPlayerId")
        boardSocketManager.addSocketBinder(this.gameMasterPlayerId);
        this.turnManager = new TurnManager(eventCardDrawer, boardSocketManager);
        new LeaveRoom(boardSocketManager)
            .onLeaveRoom(id =>
                this.leaveRoomCallback(this.gamePlayerList[id])
            );
        for (let i = 0; i < 4; i++) {
            const player = new GamePlayer(i, boardSocketManager, actionCardStacks);
            this.gamePlayerList.push(player);
        }
    }

    getNowPlayers() {
        return this.gamePlayerList.filter(x => x.Condition != GamePlayerCondition.Empty);
    }

    onLeaveRoom(callback: (player: GamePlayer) => boolean) {
        this.leaveRoomCallback = callback;
    }

    getPlayerCount() {
        return this.getNowPlayers().length;
    }

    getGamePlayer(uuid: string) {
        return this.getNowPlayers().find(x => x.Uuid == uuid);
    }

    addMember(
        playerData: PlayerData, playerId: number,
    ) {
        const player = this.gamePlayerList[playerId];
        player.setPlayer(playerData);
        if (this.gameMasterPlayerId.Value == null) {
            this.gameMasterPlayerId.Value = playerId;
            player.IsGameMaster = true;
        }
        return player;
    }

    initCard(startStatusList: StartStatusYamlData[], actionCardStacks: ActionCardStacks) {
        arrayshuffle(startStatusList);
        this.getNowPlayers().forEach((x, idx) => {
            x.setAICard(startStatusList[idx]);
            x.drawActionCard(actionCardStacks.draw(1));
            for (let i = 0; i < 4; i++) {
                x.drawActionCard(actionCardStacks.draw(Math.floor(Math.random() * 2) + 2));
                x.setResourceList();
            }
        });
    }

    initTurnSet() {
        this.turnManager.setPlayers(this.getNowPlayers());
        const firstTurnPlayerId = this.turnManager.nextTurnPlayerId()!;
        this.getNowPlayers().forEach(player => {
            if (player.PlayerId != firstTurnPlayerId) player.setWait();
            else player.setMyTurn();
        });
    }

    rotateTurn() {
        const currentPlayerId = this.turnManager.nextTurnPlayerId();
        this.getNowPlayers().forEach(player => {
            if (player.PlayerId != currentPlayerId) player.setWait();
            else player.setMyTurn();
        })
    }

    winWar(playerId: number) {
        this.getNowPlayers().find(x => x.PlayerId == playerId)!.winWar();
    }
    loseWar(playerId: number) {
        this.getNowPlayers().find(x => x.PlayerId == playerId)!.loseWar();
    }
    startWar(playerId: number) {
        this.getNowPlayers().find(x => x.PlayerId == playerId)!.startWar();
    }

}