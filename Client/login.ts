import * as io from "socket.io-client";
import * as cookies from "js-cookie";
import { RoomDataForClient } from "../Share/roomDataForClient";
import { RoomViewList } from "./login/roomViewList";
import { ResultEnterRoomData } from "../Share/resultEnterRoomData";
import { ResultCreateRoomData } from "../Share/resultCreateRoomData";
import { RequestCreateRoomData } from "../Share/requestCreateRoomData";
import { RequestEnterRoomData } from "../Share/requestEnterRoomData";
import { SocketBinderList } from "./socketBinderList";

//サンプルソケットに繋げる
const socket = io("/login");

const roomViewList = new RoomViewList(
    roomId => requestCall(() => requestEnter(roomId))
);

socket.on("addRoom", (data: string) => {
    let roomData: RoomDataForClient = JSON.parse(data);
    roomViewList.addRoom(roomData);
});

socket.on("deleteRoom", (data: number) => {
    let roomId: number = data;
    roomViewList.deleteRoom(roomId);
});

const roomList = new SocketBinderList<RoomDataForClient>("roomList", socket);
roomList.onUpdate(rooms => {
    roomViewList.initRoomList(rooms);
});
roomList.onPush(room => {
    roomViewList.addRoom(room);
})
roomList.onSetAt((id, room) => {
    roomViewList.setRoom(room);
});

let button = document.getElementById("createButton");
button.onclick = () => { requestCall(requestCreate); };

//リクエスト待機中かどうかを保存する変数
let requestProcessing = false;

async function requestCall<T>(f: () => Promise<T>) {
    if (requestProcessing) return;
    requestProcessing = true;
    try { await f() } catch (_) { };
    requestProcessing = false;
}

//requestCreateRoom
async function requestCreate() {
    let request: RequestCreateRoomData = {
        roomName: (<HTMLInputElement>document.getElementById("roomName")).value,
        password: (<HTMLInputElement>document.getElementById("pass")).value,
        passwordFlag: (<HTMLInputElement>document.getElementById("passwordFlag")).checked,
        playerName: (<HTMLInputElement>document.getElementById("playerName")).value
    };
    if (request.playerName == "") {
        alert("プレイヤー名が入力されていません！");
    } else if (request.roomName == "") {
        alert("部屋の名前が入力されていません！");
    } else if (request.passwordFlag && request.password == "") {
        alert("パスワードが入力されていません！");
    } else {
        await checkExistUuid(cookies.get("uuid"));
        const promise = asyncSocketEvent<ResultCreateRoomData>("resultCreateRoom");
        socket.emit("requestCreateRoom", JSON.stringify(request));
        let resultCreateRoomData = await promise;
        if (resultCreateRoomData.successFlag)
            await requestEnter(resultCreateRoomData.roomId);
        else throw "";
    }
}

//requestEnterRoom
async function requestEnter(roomId: number) {
    let target = <HTMLInputElement>document.getElementById("playerName");
    let name: string = target.value;

    if (name != "") {
        let requestEnterRoomData: RequestEnterRoomData = {
            roomId,
            playerName: name,
            password: (<HTMLInputElement>document.getElementById("pass")).value
        }
        cookies.set("roomid", String(roomId));
        await checkExistUuid(cookies.get("uuid"));
        const promise = asyncSocketEvent<ResultEnterRoomData>("resultEnterRoom");
        socket.emit("requestEnterRoom", JSON.stringify(requestEnterRoomData));
        const resultEnterRoomData = await promise;
        if (resultEnterRoomData.successFlag) {
            cookies.set("uuid", resultEnterRoomData.uuid);
            cookies.set("playerId", String(resultEnterRoomData.playerId));
            location.href = "board.html";
        }
        else throw "";
    } else {
        alert("プレイヤー名が入力されていません！");
    }
}

//現在のuuidがサーバーに存在するか確認
async function checkExistUuid(uuid: string) {
    const promise = asyncSocketEvent<boolean>("resultExistUuid");
    socket.emit("requestExistUuid", uuid);
    const isExist = await promise;
    if (isExist) {
        alert("あなたはすでに別の部屋に入室しています");
        throw "";
    }
}

//socketイベントのasync化
function asyncSocketEvent<T>(eventName: string): Promise<T> {
    return new Promise(resolve =>
        socket.once(eventName, (data: string) => {
            resolve(JSON.parse(data))
        }));
}
