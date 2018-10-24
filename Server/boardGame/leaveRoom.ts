import { SocketBinder } from "../socketBinder";

export class LeaveRoom {
    private leaveRoomCallback: (id: number) => boolean;
    constructor(boardSocketManager: SocketBinder.Namespace) {
        for (let i = 0; i < 4; i++) {
            const leaveRoom = new SocketBinder.TriggerBinder("leaveRoom", true, [`player${i}`]);
            const playerId = i;
            leaveRoom.OnReceive(() => {
                if (this.leaveRoomCallback(playerId))
                    leaveRoom.emit();
            });
            boardSocketManager.addSocketBinder(leaveRoom);
        }
    }
    onLeaveRoom(f: (id: number) => boolean) {
        this.leaveRoomCallback = f;
    }
}