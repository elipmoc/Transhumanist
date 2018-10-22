import { BoardPlayerHandle } from "./boardGame/boardPlayerHandle";
import { PlayerData } from "./playerData";
import { GamePlayers } from "./boardGame/gamePlayers";
import { BoardGameStarter } from "./boardGame/boardGameStarter";
import { BoardGameStatus } from "./boardGame/boardGameStatus";
import { ActionCardStacks } from "./boardGame/drawCard/actionCardStacks";
import { BoardGameTurnRotation } from "./boardGame/boardGameTurnRotation";
import { Message } from "./boardGame/message";
import { SocketBinder } from "./socketBinder";
import { EventCardStack } from "./boardGame/drawCard/eventCardStack";
import { EventCardDrawer } from "./boardGame/eventCardDrawer";
import { ChatSe } from "./boardGame/chatSe";
import { War } from "./boardGame/war";
import { TurnFinishButtonClick } from "./boardGame/turnFinishButtonClick";

export class BoardGame {
    private gamePlayers: GamePlayers;
    private message: Message;
    private boardsocketManager: SocketBinder.Namespace;
    private roomId: number;
    private actionCardStacks: ActionCardStacks;
    private eventCardStack: EventCardStack;
    private boardGameStatus: BoardGameStatus;
    private chatSe: ChatSe;
    private war: War;
    private boardGameStarter: BoardGameStarter;
    private boardGameTurnRotation: BoardGameTurnRotation;
    private deleteMemberCallback: (uuid: string) => void;

    constructor(boardSocket: SocketIO.Namespace, roomId: number) {
        this.boardsocketManager = new SocketBinder.BindManager().registNamespace("board", boardSocket);
        this.boardGameStatus = new BoardGameStatus();

        this.actionCardStacks = new ActionCardStacks(this.boardsocketManager);
        this.eventCardStack = new EventCardStack(this.boardsocketManager);

        this.gamePlayers =
            new GamePlayers(this.boardsocketManager, new EventCardDrawer(this.eventCardStack, this.boardsocketManager));

        this.boardGameStarter = new BoardGameStarter(this.gamePlayers, this.boardGameStatus, this.actionCardStacks);
        this.boardGameTurnRotation = new BoardGameTurnRotation(this.gamePlayers);

        this.roomId = roomId;

        this.message = new Message(this.boardsocketManager);
        this.chatSe = new ChatSe(this.boardsocketManager);

        this.war = new War(this.boardsocketManager);
        this.war.onWin(playerId => this.gamePlayers.winWar(playerId));
        this.war.onLose(playerId => this.gamePlayers.loseWar(playerId));
        this.war.onStartWar(playerId => this.gamePlayers.startWar(playerId));
        this.gamePlayers.onLeaveRoom(player => {
            if (this.isWait()) {
                this.deleteMemberCallback(player.Uuid)
                player.clear();
            }
        });
    }

    joinUser(socket: SocketIO.Socket, uuid: string) {
        const gamePlayer = this.gamePlayers.getGamePlayer(uuid);
        if (gamePlayer) {
            socket = socket.join(`room${this.roomId}`);

            this.boardsocketManager.addSocket(`player${gamePlayer.PlayerId}`, socket);
            new BoardPlayerHandle(socket, gamePlayer);
        }
    }

    isWait() {
        return this.boardGameStatus.isWait();
    }

    addMember(playerData: PlayerData, playerId: number) {
        if (this.boardGameStatus.isWait()) {
            const gamePlayer =
                this.gamePlayers.addMember(playerData, playerId, this.boardsocketManager, this.actionCardStacks);
            this.message.addPlayerName(playerId, playerData.getName());
            new TurnFinishButtonClick(gamePlayer, this.boardGameStarter, this.boardGameTurnRotation, this.boardsocketManager);
        }
    }

    onDeleteMember(callback: (uuid: string) => void) {
        this.deleteMemberCallback = callback;
    }
}