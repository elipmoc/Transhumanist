import * as uuid from "node-uuid";

//uuidを管理するクラス
export class UuidGenerator {
    private uuidMap: Map<string, null> = new Map();

    //新たしいuuidを生成して返す
    public getUuid() {
        let newUuid: string;
        do {
            newUuid = uuid.v4();
        } while (this.uuidMap.has(newUuid));
        this.uuidMap.set(newUuid, null);
        return newUuid;
    }

    //uuidの返却
    public releaseUuid(uuid: string) {
        this.uuidMap.delete(uuid);
    }

    //uuidが使用されているかどうか
    public isExistUuid(uuid: string) {
        return this.uuidMap.has(uuid);
    }
}