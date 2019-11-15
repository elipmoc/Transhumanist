export interface PnChangeData {
    changeNumber:number, //変わる分の数
    pnId: number,   //0 = positive , 1 = negative
    adId: number    //0 = add , 1 = dec
}