export class PlayerData {
    private uuid: string;
    private name: string;

    //コンストラクタ
    constructor(uuid: string, name: string) {
        this.uuid = uuid;
        this.name = name;
    }
    //uuidを返すゲッター
    getUuid() { return this.uuid; }
    //nameを返すゲッター
    getName() { return this.name; }

}
