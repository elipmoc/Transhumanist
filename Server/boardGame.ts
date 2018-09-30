import { BoardPlayerHandle } from "./boardGame/boardPlayerHandle";
import { PlayerData } from "./playerData";
import { GamePlayers } from "./boardGame/gamePlayers";
import { WarPair } from "../Share/warPair";
import { BoardGameStarter } from "./boardGame/boardGameStarter";
import { BoardGameStatusChanger } from "./boardGame/boardGameStatusChanger";
import { ActionCardStacks } from "./boardGame/drawCard/actionCardStacks";
import { BoardGameTurnRotation } from "./boardGame/boardGameTurnRotation";
import { Message } from "./boardGame/message";
import { SocketBinder } from "./socketBinder";
import { EventCardStack } from "./boardGame/drawCard/eventCardStack";
import { EventCardDrawer } from "./boardGame/eventCardDrawer";
import { ChatSe } from "./boardGame/chatSe";
export class BoardGame {
    private gamePlayers: GamePlayers;
    private message: Message;
    private boardsocketManager: SocketBinder.Namespace;
    private roomId: number;
    private warPairList: SocketBinder.BinderList<WarPair>;
    private actionCardStacks: ActionCardStacks;
    private eventCardStack: EventCardStack;
    private boardGameStatusChanger: BoardGameStatusChanger;
    private chatSe: ChatSe;

    constructor(boardSocket: SocketIO.Namespace, roomId: number) {
        this.boardsocketManager = new SocketBinder.BindManager().registNamespace("board", boardSocket);
        this.boardGameStatusChanger = new BoardGameStatusChanger();

        this.actionCardStacks = new ActionCardStacks(this.boardsocketManager);
        this.eventCardStack = new EventCardStack(this.boardsocketManager);

        this.gamePlayers =
            new GamePlayers(this.boardsocketManager, new EventCardDrawer(this.eventCardStack, this.boardsocketManager));
        this.roomId = roomId;
        this.warPairList = new SocketBinder.BinderList<WarPair>("warPairList");
        setTimeout(() => this.warPairList.Value = [{ playerId1: 0, playerId2: 1 }], 3000);

        this.message = new Message(this.boardsocketManager);
        this.chatSe = new ChatSe(this.boardsocketManager);

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
        if (this.boardGameStatusChanger.isWait())
            this.gamePlayers.addMember(playerData, playerId, this.boardsocketManager);
    }
}