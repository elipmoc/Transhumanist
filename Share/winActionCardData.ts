import { ActionCardName } from "./Yaml/actionCardYamlData";

//勝利アクションカードの情報
export interface WinActionCardData {
    //現在の枚数
    currentNumber: number;
    //最大の山札数
    maxNumber: number;
    //カード名
    cardName: ActionCardName;
}