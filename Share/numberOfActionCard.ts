//アクションカードのレベル別枚数情報
export interface NumberOfActionCard {
    //現在の山札数
    currentNumber: number;
    //最大の山札数
    maxNumber: number;
    //捨て札の枚数
    dustNumber: number;
}