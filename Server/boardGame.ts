import { BoardPlayerHandle } from "./boardPlayerHandle";
import { PlayerData } from "./playerData";
import { GamePlayers } from "./gamePlayers";
import { SocketBinderList } from "./socketBinderList";
import { WarPair } from "../Share/warPair";
import { BoardGameStarter } from "./boardGameStarter";
import { BoardGameStatusChanger } from "./boardGameStatusChanger";
import { ActionCardStacks } from "./drawCard/actionCardStacks";
import { BoardGameTurnRotation } from "./boardGameTurnRotation";
import { SocketNamespace, SocketBindManager } from "./socketBindManager";
import { Message } from "./message";

export class BoardGame {
    private gamePlayers: GamePlayers;
    private message: Message;
    private boardsocketManager: SocketNamespace;
    private roomId: number;
    private warPairList: SocketBinderList<WarPair>;
    private actionCardStacks: ActionCardStacks;
    private boardGameStatusChanger: BoardGameStatusChanger;

    constructor(boardSocket: SocketIO.Namespace, roomId: number) {
        this.boardsocketManager = new SocketBindManager().registNamespace("board", boardSocket);
        this.boardGameStatusChanger = new BoardGameStatusChanger();

        this.actionCardStacks = new ActionCardStacks(this.boardsocketManager);

        this.gamePlayers = new GamePlayers(this.boardsocketManager);
        this.roomId = roomId;

        this.warPairList = new SocketBinderList<WarPair>("warPairList");
        setTimeout(() => this.warPairList.Value = [{ playerId1: 0, playerId2: 1 }], 3000);

        this.message = new Message(this.boardsocketManager);

        this.boardsocketManager.addSocketBinder(this.warPairList);
    }

    joinUser(socket: SocketIO.Socket, uuid: string) {
        const gamePlayer = this.gamePlayers.getGamePlayer(uuid);
        if (gamePlayer) {
            socket = socket.join(`room${this.roomId}`);

            this.boardsocketManager.addSocket(`player${gamePlayer.PlayerId}`, socket);
            const boardGameStarter = new BoardGameStarter(this.gamePlayers, this.boardGameStatusChanger, this.actionCardStacks);
            const boardGameTurnRotation = new BoardGameTurnRotation(this.gamePlayers);
            new BoardPlayerHandle(socket, gamePlayer, boardGameStarter, boardGameTurnRotation);
        }
    }

    addMember(playerData: PlayerData, playerId: number) {
        this.gamePlayers.addMember(playerData, playerId, this.boardsocketManager);
    }
}