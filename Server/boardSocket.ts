import {BoardControler} from "../Server/boardControler";

export class BoardSocket {
    private boardControler: BoardControler;
    constructor(socket:SocketIO.Server,boardControler:BoardControler){}
}