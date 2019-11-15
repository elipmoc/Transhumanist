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
    Dice,
    //イベント処理中
    Event,
    //アクションカード処理中
    Action,
    //イベント処理完了
    EventClear,
    //アクションカードドロー中
    DrawCard,
    //滅亡
    DownFall

}