import * as global from "../boardGlobalData";

interface Pos {
    x: number,
    y: number
}

export class WarLine extends createjs.Container {
    private playerPos: Pos[] = [
        { x: global.canvasWidth / 2, y: global.canvasHeight },
        { x: 0, y: global.canvasHeight / 2 },
        { x: global.canvasWidth / 2, y: 0 },
        { x: global.canvasWidth, y: global.canvasHeight / 2 },
    ]
    private playerId1: number;
    private playerId2: number;
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