import { BoardPlayerHandle } from "./boardGame/boardPlayerHandle";
import { PlayerData } from "./playerData";
import { GamePlayers } from "./boardGame/gamePlayers";
import { BoardGameStatus } from "./boardGame/boardGameStatus";
import { ActionCardStacks } from "./boardGame/drawCard/actionCardStacks";
import { Message, MessageSender } from "./boardGame/message";
import { SocketBinder } from "./socketBinder";
import { ChatSe } from "./boardGame/chatSe";
import { BoardGameStatusKind } from "./boardGame/boardGameStatusKind";
import { GamePlayerCondition } from "../Share/gamePlayerCondition";
import { yamlGet } from "./yamlGet";
import { GamePlayer } from "./boardGame/gamePlayer";
import { LogMessageType } from "../Share/logMessageForClient";

export class BoardGame {
    private gamePlayers: GamePlayers;
    private message: Message;
    private messageSender: MessageSender;
    private boardsocketManager: SocketBinder.Namespace;
    private roomId: number;
    private actionCardStacks: ActionCardStacks;
    private boardGameStatus: BoardGameStatus;
    private chatSe: ChatSe;
    private deleteMemberCallback: (uuid: string) => void;
    private deleteRoomCallback: (roomId: number) => void;

    constructor(boardSocket: SocketIO.Namespace, roomId: number) {
        this.boardsocketManager = new SocketBinder.BindManager().registNamespace(
            "board",
            boardSocket
        );
        this.boardGameStatus = new BoardGameStatus();

        this.actionCardStacks = new ActionCardStacks(this.boardsocketManager);

        this.message = new Message(this.boardsocketManager);
        this.messageSender = this.message.createMessageSender();
        this.gamePlayers = new GamePlayers(
            this.boardsocketManager,
            this.actionCardStacks,
            this.messageSender
        );

        this.roomId = roomId;

        this.chatSe = new ChatSe(this.boardsocketManager);

        this.gamePlayers.onLeaveRoom(player => {
            if (this.isWait()) {
                this.deleteMemberCallback(player.Uuid);
                this.messageSender.sendPlayerMessage(`${player.GameState.State.playerName}が退室しました`, player.PlayerId);
                player.clear();
                if (this.gamePlayers.getPlayerCount() == 0)
                    this.deleteRoomCallback(this.roomId);
                return true;
            }
            return false;
        });
        this.gamePlayers.onTurnFinishButtonClick(player =>
            this.turnFinishButtonClick(player)
        );
        this.boardsocketManager.addSocketBinder();
        this.gamePlayers.onEndGameRequest(() => this.resetGame());
    }

    //ゲームのリセット処理をする
    private resetGame() {
        this.boardGameStatus.reset();
        this.actionCardStacks.settingCard();
        this.gamePlayers.reset();
    }

    onChangeStatus(f: (state: BoardGameStatusKind) => void) {
        this.boardGameStatus.onChangeCallback(f);
    }

    joinUser(socket: SocketIO.Socket, uuid: string) {
        const gamePlayer = this.gamePlayers.getGamePlayer(uuid);
        if (gamePlayer) {
            socket = socket.join(`room${this.roomId}`);

            this.boardsocketManager.addSocket(
                `player${gamePlayer.PlayerId}`,
                socket
            );
            new BoardPlayerHandle(socket, gamePlayer);
            return true;
        }
        return false;
    }

    isWait() {
        return this.boardGameStatus.isWait();
    }

    private turnFinishButtonClick(gamePlayer: GamePlayer) {
        switch (gamePlayer.Condition) {
            case GamePlayerCondition.Start:
                if (gamePlayer.IsGameMaster) {
                    //プレイヤーが二人以上でゲーム開始できる
                    if (
                        this.gamePlayers.getPlayerCount() > 1 &&
                        this.boardGameStatus.start()
                    ) {
                        this.messageSender.sendMessage("ゲームが開始されました", LogMessageType.OtherMsg);
                        const startStatusYamlData = yamlGet(
                            "./Resource/Yaml/startStatus.yaml"
                        );
                        this.gamePlayers.initCard(
                            startStatusYamlData,
                            this.actionCardStacks
                        );
                        this.gamePlayers.initTurnSet();
                    }
                }
                break;
            case GamePlayerCondition.MyTurn:
                this.gamePlayers.rotateTurn();
                break;
        }
    }

    addMember(playerData: PlayerData, playerId: number) {
        if (this.boardGameStatus.isWait()) {
            this.gamePlayers.addMember(playerData, playerId);
            this.message.addPlayerName(playerId, playerData.getName());
            this.messageSender.sendPlayerMessage(`${playerData.getName()}が入室しました`, playerId);
        }
    }

    onDeleteMember(f: (uuid: string) => void) {
        this.deleteMemberCallback = f;
    }

    onDeleteRoom(f: (roomId: number) => void) {
        this.deleteRoomCallback = f;
    }
}
