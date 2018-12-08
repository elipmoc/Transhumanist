import { Event } from "../../Share/Yaml/eventYamlData";
import { GamePlayerState } from "./gamePlayerState";
import { ResourceList } from "./ResourceList";
import { BuildActionList } from "./buildActionList";
import { CandidateResources } from "../../Share/candidateResources";

export interface SetEventResult {
    onceNoCostFlag: boolean;
    eventClearFlag: boolean;
    diceRollFlag: boolean;
    exileNumber: number;
}

//イベントのセット処理を行う
export function setEvent(
    eventCard: Event,
    state: GamePlayerState,
    resourceList: ResourceList,
    buildActionList: BuildActionList
): SetEventResult {
    const result: SetEventResult = {
        onceNoCostFlag: false,
        eventClearFlag: false,
        diceRollFlag: false,
        exileNumber: 0
    };

    result.onceNoCostFlag = ["技術革新", "産業革命"].includes(eventCard.name);

    if (eventCard.name == "AIへの反抗") {
        state.addAcivityRange(state.State.negative * -1);
    }
    if (eventCard.name == "AIへの友好") {
        state.addAcivityRange(state.State.positive);
    }

    switch (eventCard.name) {
        case "ムーアの法則":
        case "地震":
        case "暴風":
        case "未知の病気":
        case "隕石":
        case "天変地異":
            result.diceRollFlag = true;
            break;
        case "サブカルチャー":
            state.addNegative(-1);
            result.eventClearFlag = true;
            break;

        case "亡命":
            if (state.State.negative >= 3) {
                if (resourceList.getCount("人間") >= 3) {
                    result.exileNumber = 3;
                } else {
                    result.exileNumber = resourceList.getCount("人間");
                }
                resourceList.deleteResource("人間", result.exileNumber);
                result.diceRollFlag = true;
            } else result.eventClearFlag = true;
            break;

        case "独立傾向":
            if (resourceList.getCount("ロボット") >= 1) {
                result.diceRollFlag = true;
            } else result.eventClearFlag = true;
            break;
        case "内乱":
            if (
                state.State.negative >= 6 &&
                buildActionList.getAllCount() >= 1
            ) {
                //任意の設置済みアクションカードを2つ選択して削除
                buildActionList.setNowEvent(true);
                if (buildActionList.getAllCount() <= 2)
                    buildActionList.deleteRequest(
                        buildActionList.getAllCount(),
                        "内乱の効果が適用されました。"
                    );
                else
                    buildActionList.deleteRequest(
                        2,
                        "内乱の効果が適用されました。"
                    );
            } else result.eventClearFlag = true;
            break;
        case "ブラックホール":
            resourceList.randomDeleteResource(1);
            result.eventClearFlag = true;
            break;

        default:
            result.eventClearFlag = true;
            break;
    }
    return result;
}

export interface DiceSelectAfterEventResult {
    candidateResources: CandidateResources | null;
    eventClearFlag: boolean;
    exileNum: number | null;
}

//イベントのダイスが振られたあとのイベントの処理
export function diceSelectAfterEvent(
    nowEvent: Event,
    diceNumber: number,
    resourceList: ResourceList,
    buildActionList: BuildActionList
): DiceSelectAfterEventResult {
    const result: DiceSelectAfterEventResult = {
        candidateResources: null,
        eventClearFlag: false,
        exileNum: null
    };

    switch (nowEvent.name) {
        case "ムーアの法則":
            let data = {
                number: diceNumber,
                resource_names: nowEvent.resources!
            };
            result.candidateResources = data;
            break;
        case "地震":
            resourceList.deleteResource("人間", diceNumber);
            result.eventClearFlag = true;
            break;
        case "暴風":
            if (diceNumber != 3) {
                //消すリソースを1つ選択してください
                resourceList.setNowEvent(true);
                resourceList.deleteRequest(1, "暴風の効果が適用されました。");
            } else result.eventClearFlag = true;
            break;
        case "未知の病気":
            let humanNum = diceNumber;
            if (diceNumber > resourceList.getCount("人間"))
                humanNum = resourceList.getCount("人間");
            resourceList.changeResource("人間", "病人", humanNum);
            result.eventClearFlag = true;
            break;
        case "隕石":
            resourceList.randomDeleteResource(diceNumber);
            result.eventClearFlag = true;
            break;
        case "亡命":
            //サイコロの値分、左にずれた人に人間を３つ移動。リソース上限は有効。
            result.exileNum = diceNumber;
            result.eventClearFlag = true;
            break;
        case "天変地異":
            //サイコロの値分、リソースと設置済みを消す。
            resourceList.randomDeleteResource(diceNumber);
            buildActionList.randomDeleteResource(diceNumber);
            result.eventClearFlag = true;
            break;
        case "独立傾向":
            let robotNum = diceNumber;
            if (diceNumber > resourceList.getCount("ロボット"))
                robotNum = resourceList.getCount("ロボット");
            resourceList.changeResource("ロボット", "人間", robotNum);
            result.eventClearFlag = true;
            break;
    }
    return result;
}
