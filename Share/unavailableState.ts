//アクションカードの使用不可
export enum UnavailableState {
    Cost,//コストが足りない
    War, //戦争状態じゃないからカードを使用できない
    Condition,//条件が満たされてないからカードの使用できない
    Event//イベントの効果で使用できない
}