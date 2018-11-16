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
import { EmitReceiveBinder } from "../socketBinder/emitReceiveBinder";


export class GamePlayers {
    private gamePlayerList: GamePlayer[] = new Array();
    private gameMasterPlayerId: SocketBinder.Binder<number | null>;
    private turnManager: TurnManager;
    private leaveRoomCallback: (player: GamePlayer) => boolean;
    private turnFinishButtonClickCallback: (player: GamePlayer) => void;
    private endGameRequestCallback: () => void;
    private eventCardDrawer: EventCardDrawer;

    //ゲームを再び開始できるようにステータスをリセットする
    reset() {
        this.getNowPlayers().forEach(x => x.reset());
        this.turnManager.reset();
        this.eventCardDrawer.reset();
    }

    constructor(boardSocketManager: SocketBinder.Namespace, eventCardDrawer: EventCardDrawer, actionCardStacks: ActionCardStacks) {
        this.gameMasterPlayerId = new SocketBinder.Binder<number | null>("gameMasterPlayerId")
        boardSocketManager.addSocketBinder(this.gameMasterPlayerId);
        this.eventCardDrawer = eventCardDrawer;
        this.turnManager = new TurnManager(boardSocketManager);
        new LeaveRoom(boardSocketManager)
            .onLeaveRoom(id =>
                this.leaveRoomCallback(this.gamePlayerList[id])
            );
        for (let i = 0; i < 4; i++) {
            const player = new GamePlayer(i, boardSocketManager, actionCardStacks);
            const endGame = new EmitReceiveBinder("gameEnd", true, [`player${player.PlayerId}`]);
            endGame.OnReceive(() => {
                if (player.IsGameMaster)
                    this.endGameRequestCallback();
            });
            boardSocketManager.addSocketBinder(endGame);
            player.onTurnFinishButtonClick(() => this.turnFinishButtonClickCallback(player));
            this.gamePlayerList.push(player);
        }
    }

    getNowPlayers() {
        return this.gamePlayerList.filter(x => x.Condition != GamePlayerCondition.Empty);
    }

    onLeaveRoom(f: (player: GamePlayer) => boolean) {
        this.leaveRoomCallback = f;
    }

    onTurnFinishButtonClick(f: (player: GamePlayer) => void) {
        this.turnFinishButtonClickCallback = f;
    }

    onEndGameRequest(f: () => void) {
        this.endGameRequestCallback = f;
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
        const firstTurnPlayerId = this.turnManager.nextPlayer()!.playerId;
        this.eventCardDrawer.draw();
        this.getNowPlayers().forEach(player => {
            if (player.PlayerId != firstTurnPlayerId) player.setWait();
            else player.setMyTurn(this.eventCardDrawer.NowEvent!);
        });
    }

    rotateTurn() {
        const { playerId, turnChanged } = this.turnManager.nextPlayer();
        if (turnChanged) this.eventCardDrawer.draw();
        this.getNowPlayers().forEach(player => {
            if (["技術革新", "産業革命"].includes(this.eventCardDrawer.NowEvent!.name))
                player.setOnceNoCost();
            if (player.PlayerId != playerId) player.setWait();
            else player.setMyTurn(this.eventCardDrawer.NowEvent!);
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