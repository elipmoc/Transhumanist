import { SocketBinder } from "../socketBinder";

export class LeaveRoom {
    private leaveRoomCallback: (id: number) => void;
    constructor(boardSocketManager: SocketBinder.Namespace) {
        for (let i = 0; i < 4; i++) {
            const leaveRoom = new SocketBinder.EmitReceiveBinder("leaveRoom", true, [`player${i}`]);
            const playerId = i;
            leaveRoom.OnReceive(() =>
                this.leaveRoomCallback(playerId)
            );
            boardSocketManager.addSocketBinder(leaveRoom);
        }
    }
    onLeaveRoom(f: (id: number) => void) {
        this.leaveRoomCallback = f;
    }
}