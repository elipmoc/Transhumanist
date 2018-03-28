export type ResultCreateRoomData = {
    successFlag: boolean;
    errorMsg: string;
}

//部屋作成が成功した際のResultCreateRoomDataを作成するビルダー関数
export function successResultCreateRoomData(): ResultCreateRoomData {
    return {
        successFlag: true,
        errorMsg: ""
    };
}

//部屋作成が失敗した際のResultCreateRoomDataを作成するビルダー関数
export function faildResultCreateRoomData(errorMsg: string): ResultCreateRoomData {
    return {
        successFlag: false,
        errorMsg: errorMsg
    };
}