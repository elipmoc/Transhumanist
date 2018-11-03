//プレイヤーの状態
export enum GamePlayerCondition {
    //ゲーム開始前
    Start,
    //自分のターンが来ている時
    MyTurn,
    //待機中
    Wait,
    //プレイヤーが存在しない
    Empty,
    //ダイスを選択中
    Dice
}