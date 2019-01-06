import { BuildActionList } from "../buildActionList";
import { GamePlayerState } from "../gamePlayerState";

export function actionCardUseConditionCheck(
    cardConditions: string | undefined,
    state: GamePlayerState,
    buildActionList: BuildActionList
) {
    if (cardConditions) {
        switch (cardConditions) {
            case "built_quantum_computer":
                if (buildActionList.getCount("量子コンピュータ") == 0)
                    return false;
                break;
            case "p_5":
                if (state.State.positive < 5) return false;
                break;
            case "p_n_total_zero":
                if (state.State.positive - state.State.negative != 0)
                    return false;
                break;
        }
    }
    return true;
}
