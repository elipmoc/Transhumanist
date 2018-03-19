export class PlayerData{
    private uuid:number;
    private name:string;
    
    //コンストラクタ
    constructor(uuid:number,name:string){}
    //uuidを返すゲッター
    getUuid(){return this.uuid;}
    //nameを返すゲッター
    getName(){return this.name;}

}
    