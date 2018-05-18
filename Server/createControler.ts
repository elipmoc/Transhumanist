import { LoginControler } from "./loginControler";
import { RoomControler } from "./roomControler";
import { RoomListEvents } from "./roomListEvents";
import { BoardControler } from "./boardControler";

export function createControler(socket: SocketIO.Server) {
    let loginControler: LoginControler;
    let boardControler: BoardControler;
    const roomListEvents: RoomListEvents = {
        addMemberCallBack: (playerDataForClient) => { },
        deleteMemberCallBack: (playerDataForClient) => loginControler.deleteMember(playerDataForClient),
        addRoomCallBack: (roomDataForClient) => loginControler.addRoom(roomDataForClient),
        deleteRoomCallBack: (roomId) => loginControler.deleteRoom(roomId),
        updatePlayFlagCallBack: (playFlagDataForClient) => loginControler.updatePlayFlag(playFlagDataForClient)
    };
    const roomControler = new RoomControler(roomListEvents);
    loginControler = new LoginControler(roomControler, socket.of("/login"));
    boardControler = new BoardControler(roomControler, socket.of("/board"));
}