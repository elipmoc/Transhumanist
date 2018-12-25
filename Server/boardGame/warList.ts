import { SocketBinder } from "../socketBinder";
import { WarSuccessFlag } from "./war";

export type WinPlayerId = number;

export class WarList {

    private warPairList: SocketBinder.BinderList<{ playerId1: number, playerId2: number }>;
    private warFlags: SocketBinder.Binder<boolean>[] = [];

    reset() {
        this.warPairList.Value = [];
        this.warFlags.forEach(x => x.Value = false);
    }

    startWar(playerId1: number, playerId2: number): WarSuccessFlag {
        if (playerId1 != playerId2) {
            const same = this.warPairList.Value.find(y =>
                y.playerId1 == playerId1 || y.playerId2 == playerId1 || y.playerId1 == playerId2 || y.playerId2 == playerId2
            );
            if (same == undefined) {
                this.warFlags[playerId1].Value = true;
                this.warFlags[playerId2].Value = true;
                this.warPairList.push({ playerId1, playerId2 });
                return true;
            }
        }
        return false;
    }

    surrender(playerId: number): WinPlayerId | null {
        if (this.warFlags[playerId].Value) {
            const warPair = this.warPairList.Value.find(x => x.playerId1 == playerId || x.playerId2 == playerId)!;
            this.warFlags[warPair.playerId1].Value = false;
            this.warFlags[warPair.playerId2].Value = false;
            this.warPairList.Value = this.warPairList.Value.filter(x => x.playerId1 != playerId && x.playerId2 != playerId);
            return playerId == warPair.playerId1 ? warPair.playerId2 : warPair.playerId1;
        }
        return null;
    }

    getWarPlayerId(playerId: number) {
        if (this.warFlags[playerId].Value) {
            const warPair = this.warPairList.Value.find(x => x.playerId1 == playerId || x.playerId2 == playerId)!;
            return playerId == warPair.playerId1 ? warPair.playerId2 : warPair.playerId1;
        }
        return null;
    }

    constructor(boardSocketManager: SocketBinder.Namespace) {

        this.warPairList = new SocketBinder.BinderList<{ playerId1: number, playerId2: number }>("warPairList");
        this.warPairList.Value = [];
        boardSocketManager.addSocketBinder(this.warPairList);
        for (let i = 0; i < 4; i++) {
            const warFlag = new SocketBinder.Binder<boolean>("warFlag", true, [`player${i}`]);
            warFlag.Value = false;
            this.warFlags.push(warFlag);
            boardSocketManager.addSocketBinder(warFlag);
        }
    }
}