declare type RoomData = {
    roomName: string;
    roomId: number;
    playFlag: boolean;
    playerList: string[];
};
declare let testRoomDataList: RoomData[];
declare function initRoomList(roomDataList: RoomData[]): void;
declare function addRoom(roomData: RoomData): void;
declare function deleteRoom(roomID: number): void;
declare function addMember(roomID: number, playerName: string, playerTag: string): void;
declare function deleteMember(roomID: number, playerTag: string): void;
declare function updatePlayFlag(roomID: number, playFlag: boolean): void;
