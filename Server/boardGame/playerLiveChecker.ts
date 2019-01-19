
//最大生存猶予秒数
const MaxLiveTime = 60;

//プレイヤーの応答生存確認を管理するクラス
export class PlayerLiveChecker {
    private playerLifeTimes: { [uuid: string]: number } = {}
    private deadCallback: (uuid: string) => void;
    onDead(f: (uuid: string) => void) {
        this.deadCallback = f;
    }

    constructor() {

        //生存チェックを行う
        setInterval(() => {
            for (const uuid in this.playerLifeTimes) {
                this.playerLifeTimes[uuid]--;
                if (this.playerLifeTimes[uuid] <= 0)
                    this.deadCallback(uuid);
            }
        }, 1000);

    }

    //対象のプレイヤーの生存チェックを開始する
    liveCheckStart(uuid: string) {
        this.playerLifeTimes[uuid] = MaxLiveTime;
    }

    //生存チェック対象から外す
    release(uuid: string) {
        delete this.playerLifeTimes[uuid];
    }

}