import * as global from "../boardGlobalData";

interface Pos {
    x: number,
    y: number
}

class WarLine extends createjs.Container {
    private playerPos: Pos[] = [
        { x: global.canvasWidth / 2, y: global.canvasHeight },
        { x: 0, y: global.canvasHeight / 2 },
        { x: global.canvasWidth / 2, y: 0 },
        { x: global.canvasWidth, y: global.canvasHeight / 2 },
    ]
    private playerId1: number;
    private playerId2: number;
    get PlayerId1() { return this.playerId1; }
    get PlayerId2() { return this.playerId2; }
    constructor(playerId1: number, playerId2: number, selfPlayerId: number) {
        super();
        this.playerId1 = playerId1;
        this.playerId2 = playerId2;
        // シェイプを作成
        var line = new createjs.Shape();
        line.graphics.setStrokeStyle(8);
        line.graphics.beginStroke("red");
        line.graphics.moveTo(this.playerPos[(playerId1 + 4 - selfPlayerId) % 4].x, this.playerPos[(playerId1 + 4 - selfPlayerId) % 4].y);
        line.graphics.lineTo(this.playerPos[(playerId2 + 4 - selfPlayerId) % 4].x, this.playerPos[(playerId2 + 4 - selfPlayerId) % 4].y);
        line.graphics.endStroke();
        this.addChild(line);
    }
}

export class WarLineControl extends createjs.Container {
    private warLineList: WarLine[] = new Array();
    constructor() {
        super();
    }
    addWarLine(playerId1: number, playerId2: number, selfPlayerId: number) {
        if (this.warLineList.some(x =>
            (x.PlayerId1 == playerId1 && x.PlayerId2 == playerId2) ||
            (x.PlayerId1 == playerId2 && x.PlayerId2 == playerId1)
        ) == false) {
            const warLine = new WarLine(playerId1, playerId2, selfPlayerId);
            this.addChild(warLine);
            this.warLineList.push(warLine);
        }
    }
    deleteWarLine(playerId1: number, playerId2: number) {
        this.warLineList = this.warLineList.filter(x => {
            const flag =
                (x.PlayerId1 != playerId1 || x.PlayerId2 != playerId2) &&
                (x.PlayerId1 != playerId2 || x.PlayerId2 != playerId1);
            if (!flag)
                this.removeChild(x);
            return flag;
        });
    }

}