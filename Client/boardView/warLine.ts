import * as global from "../boardGlobalData";

interface Pos {
    x: number,
    y: number
}

export class WarLine extends createjs.Container {
    private playerPos: Pos[] = [
        { x: global.canvasWidth / 2, y: global.canvasHeight },
        { x: global.canvasWidth, y: global.canvasHeight / 2 },
        { x: global.canvasWidth / 2, y: 0 },
        { x: 0, y: global.canvasHeight / 2 }
    ]
    constructor(playerId1: number, playerId2: number) {
        super();
        // シェイプを作成
        var line = new createjs.Shape();
        line.graphics.setStrokeStyle(8);
        line.graphics.beginStroke("red");
        line.graphics.moveTo(this.playerPos[playerId1].x, this.playerPos[playerId1].y);
        line.graphics.lineTo(this.playerPos[playerId2].x, this.playerPos[playerId2].y);
        line.graphics.endStroke();
        this.addChild(line);
    }

}