export type ResultEnterRoomData = {
    successFlag: boolean;
    errorMsg: string;
    uuid: string;
}

//部屋入室が成功した際のResultEnterRoomDataを作成するビルダー関数
export function successResultEnterRoomData(uuid: string): ResultEnterRoomData {
    return {
        successFlag: true,
        errorMsg: "",
        uuid: uuid
    };
}

//部屋入室が失敗した際のResultEnterRoomDataを作成するビルダー関数
export function faildResultEnterRoomData(errorMsg: string): ResultEnterRoomData {
    return {
        successFlag: false,
        errorMsg: errorMsg,
        uuid: ""
    };
}