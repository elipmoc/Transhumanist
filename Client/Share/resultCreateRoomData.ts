export type ResultCreateRoomData = {
    successFlag: boolean;
    errorMsg: string;
    roomId: number
}

//部屋作成が成功した際のResultCreateRoomDataを作成するビルダー関数
export function successResultCreateRoomData(roomId: number): ResultCreateRoomData {
    return {
        successFlag: true,
        errorMsg: "",
        roomId: roomId
    };
}

//部屋作成が失敗した際のResultCreateRoomDataを作成するビルダー関数
export function faildResultCreateRoomData(errorMsg: string): ResultCreateRoomData {
    return {
        successFlag: false,
        errorMsg: errorMsg,
        roomId: NaN
    };
}