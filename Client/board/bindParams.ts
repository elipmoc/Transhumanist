import { Yamls } from "../getYaml";
import { ImageQueue } from "./imageQueue";
import { LayerManager } from "./layerManager";

export interface BindParams {
    layerManager: LayerManager;
    imgQueue: ImageQueue;
    socket: SocketIOClient.Socket;
    playerId: number;
    yamls: Yamls;
}