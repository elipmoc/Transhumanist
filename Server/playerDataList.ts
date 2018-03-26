import { PlayerData } from "./playerData"

export class PlayerDataList {
    private playerDataList: (PlayerData | null)[]
    public constructor() {
        this.playerDataList = new Array(null, null, null, null);
    }

    public getPlayerId(uuid: string) {
        return this.playerDataList.findIndex(x => {
            if (x == null) return false;
            return x.getUuid() == uuid;
        });
    }

    public getPlayerData(uuid: string) {
        return this.playerDataList.find(x => {
            if (x == null) return false;
            return x.getUuid() == uuid;
        });
    }

    public addMember(playerData: PlayerData) {
        for (let i = 0; i < this.playerDataList.length; i++) {
            if (this.playerDataList[i] == null) {
                this.playerDataList[i] = playerData;
                return;
            }
        }
    }

    public deleteMember(uuid: string) {
        for (let i = 0; i < this.playerDataList.length; i++) {
            let x = this.playerDataList[i];
            if (x != null && x.getUuid() == uuid) {
                this.playerDataList[i] = null;
                return;
            }
        }
    }

    public getPlayerCount() {
        return this.playerDataList.filter(x => x != null).length;
    }

    public getPlayerNameList() {
        return this.playerDataList.filter(x => x != null)
            .map(x => x!.getName());
    }

}