import { Yamls } from "../getYaml";

export interface BindParams {
    stage: createjs.Stage;
    queue: createjs.LoadQueue;
    socket: SocketIOClient.Socket;
    playerId: number;
    yamls: Yamls;
}