import * as type from "../Share/roomData";
import * as uuid from "node-uuid";

type PlayerData = {
    uuId: string;
    roomId: number;
    playerId: number;
};

let testPlayerData: PlayerData[] = [];

let testRoomDataList: type.RoomData[] = [
    {
        roomName: "バーチャル控室",
        roomId: 114514,
        playFlag: true,
        playerList: ["ミライアカリ", "輝夜月", "シロ", "のじゃロリ"]
    },
    {
        roomName: "テスト用収容室",
        roomId: 666,
        playFlag: false,
        playerList: ["何もない"]
    },
    {
        roomName: "なんでもいい",
        roomId: 10,
        playFlag: false,
        playerList: ["A", "B", "C"]
    }
];


//メインソケットからサンプルソケットを生成
export function create(mainSocket: SocketIO.Server) {
    let loginSocket = mainSocket.of("/login");
    //クライアントが繋がった時の処理
    loginSocket.on("connection", (socket: SocketIO.Socket) => {
        //requestRoomList + sendRoomList
        socket.on("requestRoomList", data => {
            if (data == null) {
                socket.emit("sendRoomList", JSON.stringify(testRoomDataList));
            }
        });

        //addRoom
        socket.emit("addRoom", JSON.stringify({
            roomName: "serverTest",
            roomId: 300,
            playFlag: false,
            playerList: ["add", "delete", "mad", "うける"]
        }));

        //deleteRoom
        socket.emit("deleteRoom", 10);

        //addMember
        socket.emit("addMember", JSON.stringify({
            roomID: 666,
            playerName: "静かなオーケストラ",
            playerTag: "player1"
        }));

        //deleteMember
        socket.emit("deleteMember", JSON.stringify({
            roomID: 114514,
            playerTag: "player0"
        }));

        //updatePlayFlag
        socket.emit("updatePlayFlag", JSON.stringify({
            roomID: 666,
            playFlag: true
        }));

        //requestEnter
        socket.on("requestEnter", (data: string)=>{
            let request = JSON.parse(data);
                
            for(let i = 0; i<testRoomDataList.length; i++){
                if(testRoomDataList[i].roomId == request.roomId){
                    for(let j = 0; j < 4; j++){
                        if(testRoomDataList[i].playerList[j] == null){
                            testRoomDataList[i].playerList[j] = request.playerNama;
                            
                            let data: PlayerData = {
                                uuId: uuid.v4(),
                                roomId: request.roomId,
                                playerId: j
                            };

                            
                            testPlayerData.push(data);
                            break;
                        }
                    }
                    break;
                }
            }
            //socket.emit("resultEnter","なんか");
            console.log(testPlayerData);
        });

        return loginSocket;
    });
}

