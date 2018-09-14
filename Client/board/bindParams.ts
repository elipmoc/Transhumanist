import { Yamls } from "../getYaml";
import { ImageQueue } from "./imageQueue";

export interface BindParams {
    stage: createjs.Stage;
    imgQueue: ImageQueue;
    socket: SocketIOClient.Socket;
    playerId: number;
    yamls: Yamls;
}