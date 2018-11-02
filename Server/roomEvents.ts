
export interface RoomEvents {
    deleteMemberCallBack: (uuid: string) => void;
    deleteRoomCallBack: (roomId: number) => void;
}