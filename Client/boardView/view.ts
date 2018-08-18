import * as global from "../boardGlobalData"
import * as viewBase from "./viewBase"
import { createMyShadow } from "../utility";

//宣戦布告ボタン
export class DeclareWarButton extends viewBase.ButtonBase {
    constructor(onClickCallback: () => void, queue: createjs.LoadQueue) {
        //ボタン画像
        const declareWarButton = new createjs.Bitmap(queue.getResult("button"));
        declareWarButton.regX = 0;
        declareWarButton.regY = declareWarButton.image.height;
        declareWarButton.x = 20;
        declareWarButton.y = global.canvasHeight - 20;
        super(declareWarButton, onClickCallback);

        //ボタンテキスト
        const declareWarText = new createjs.Text("宣戦布告/降伏", "20px Arial");
        declareWarText.regX = declareWarText.getMeasuredWidth() / 2;
        declareWarText.regY = declareWarText.getMeasuredHeight() / 2;
        declareWarText.x = declareWarButton.x + declareWarButton.image.width / 2;
        declareWarText.y = declareWarButton.y - declareWarButton.image.height / 2;
        this.addChild(declareWarText);
    }
}

//ターン終了ボタン
export class TurnFinishButton extends viewBase.ButtonBase {

    private turnFinishText: createjs.Text;

    constructor(onClickCallback: () => void, queue: createjs.LoadQueue) {

        //ターン終了ボタン画像
        const turnFinishButton = new createjs.Bitmap(queue.getResult("button"));
        turnFinishButton.regX = turnFinishButton.image.width;
        turnFinishButton.regY = turnFinishButton.image.height;
        turnFinishButton.x = global.canvasWidth - 20;
        turnFinishButton.y = global.canvasHeight - 20;
        super(turnFinishButton, onClickCallback);
        //ターン終了ボタンテキスト
        this.turnFinishText = new createjs.Text("", "20px Arial");
        this.turnFinishText.textAlign = "center";
        this.turnFinishText.regY = this.turnFinishText.getMeasuredHeight() / 2;
        this.turnFinishText.x = turnFinishButton.x - turnFinishButton.image.width / 2;
        this.turnFinishText.y = turnFinishButton.y - turnFinishButton.image.height / 2;
        this.addChild(this.turnFinishText);
    }
    setText(text: string) {
        this.turnFinishText.text = text;
    }
}

//設定ボタン
export class SettingButton extends viewBase.ButtonBase {
    private height: number;
    constructor(onClickCallback: () => void, queue: createjs.LoadQueue) {
        const settingButton = new createjs.Bitmap(queue.getResult("setting"));

        settingButton.scaleX = 0.6;
        settingButton.scaleY = 0.6;
        settingButton.x = settingButton.image.width / 4;
        settingButton.y = settingButton.image.height / 4;

        //Graphicsオブジェクトを作成する
        var g = new createjs.Graphics()
            .beginStroke("#000")
            .beginFill("#000")
            .rect(0, 0, settingButton.image.width, settingButton.image.height);
        const rect = new createjs.Shape(g);
        settingButton.hitArea = rect;
        super(settingButton, onClickCallback);
        this.height = settingButton.image.height;
    }

    public getHeight() { return this.height; }

}

export class Player1Window extends viewBase.PlayerWindowBase {
    constructor(queue: createjs.LoadQueue) {
        super();

        this.playerFrame.image = <any>queue.getResult("evenPlayerFrame");
        this.playerFrame.regX = this.playerFrame.image.width / 2;
        this.playerFrame.regY = 0;

        this.x = global.canvasWidth / 2;
        this.y = global.canvasHeight - this.playerFrame.image.height;

        this.playerNameText.color = "#00c6db";
        this.playerNameText.font = "20px Arial";
        this.playerNameText.textAlign = "center";
        this.playerNameText.y = 5;
        this.playerNameText.shadow = createMyShadow();

        this.speedText.textAlign = "center";
        this.speedText.x = (-3.5) * (this.playerFrame.image.width / 10);
        this.speedText.y = 35;
        this.speedText.color = "#f3f3f3";
        this.speedText.font = "15px Arial";
        this.speedText.shadow = createMyShadow();

        this.resourceText.textAlign = "center";
        this.resourceText.x = (-1.2) * (this.playerFrame.image.width / 10);
        this.resourceText.y = 35;
        this.resourceText.color = "#f3f3f3";
        this.resourceText.font = "15px Arial";
        this.resourceText.shadow = createMyShadow();

        this.activityRangeText.textAlign = "center";
        this.activityRangeText.x = (1.2) * (this.playerFrame.image.width / 10);
        this.activityRangeText.y = 35;
        this.activityRangeText.color = "#f3f3f3";
        this.activityRangeText.font = "15px Arial";
        this.activityRangeText.shadow = createMyShadow();

        this.uncertaintyText.textAlign = "center";
        this.uncertaintyText.x = (3.5) * (this.playerFrame.image.width / 10);
        this.uncertaintyText.y = 35;
        this.uncertaintyText.color = "#f3f3f3";
        this.uncertaintyText.font = "15px Arial";
        this.uncertaintyText.shadow = createMyShadow();

        this.positiveText.textAlign = "center";
        this.positiveText.x = (-1) * (this.playerFrame.image.width / 8);
        this.positiveText.y = 60;
        this.positiveText.color = "#00ee00";
        this.positiveText.font = "15px Arial";
        this.positiveText.shadow = createMyShadow();

        this.negativeText.textAlign = "center";
        this.negativeText.x = (1) * (this.playerFrame.image.width / 8);
        this.negativeText.y = 60;
        this.negativeText.color = "#ff0000";
        this.negativeText.font = "15px Arial";
        this.negativeText.shadow = createMyShadow();
    }
}
export class Player1ResourceArea extends viewBase.PlayerResourceAreaBase {
    constructor(queue: createjs.LoadQueue) {
        super(15);
        this.resourceArea.image = <any>queue.getResult("oddPlayerRBArea");
        this.resourceArea.regX = this.resourceArea.image.width / 2;
        this.resourceArea.regY = this.resourceArea.image.height;
        this.resourceArea.x = global.canvasWidth / 2;
        this.resourceArea.y = global.canvasHeight - 85;

        this.resourceList.x = global.canvasWidth / 2 - this.resourceArea.image.width / 2;
        this.resourceList.y = global.canvasHeight - this.resourceArea.image.height - 85;

    }
}
export class Player1Build extends viewBase.PlayerBuildBase {
    constructor(queue: createjs.LoadQueue) {
        super(15);
        this.buildArea.image = <any>queue.getResult("oddPlayerRBArea");
        this.buildArea.regX = this.buildArea.image.width / 2;
        this.buildArea.regY = this.buildArea.image.height;
        this.buildArea.x = global.canvasWidth / 2;
        this.buildArea.y = (global.canvasHeight - 85) - this.buildArea.image.height - 4;
        this.buildList.x = global.canvasWidth / 2 - this.buildArea.image.width / 2;
        this.buildList.y = global.canvasHeight - this.buildArea.image.height - 85 - this.buildArea.image.height - 4;

    }
}

export class Player2Window extends viewBase.PlayerWindowBase {
    constructor(queue: createjs.LoadQueue) {
        super();

        this.playerFrame.image = <any>queue.getResult("oddPlayerFrame");
        this.playerFrame.regY = this.playerFrame.image.height / 2;

        this.y = global.canvasHeight / 2;

        this.playerNameText.textAlign = "center";
        this.playerNameText.color = "#00dd00";
        this.playerNameText.font = "14px Arial";
        this.playerNameText.x = (this.playerFrame.image.width / 2);
        this.playerNameText.y = -60;
        this.playerNameText.shadow = createMyShadow();

        this.speedText.textAlign = "center";
        this.speedText.x = (this.playerFrame.image.width / 2);
        this.speedText.y = -30;
        this.speedText.color = "#f3f3f3";
        this.speedText.font = "12px Arial";
        this.speedText.shadow = createMyShadow();

        this.resourceText.textAlign = "center";
        this.resourceText.x = (this.playerFrame.image.width / 2);
        this.resourceText.y = -15;
        this.resourceText.color = "#f3f3f3";
        this.resourceText.font = "12px Arial";
        this.resourceText.shadow = createMyShadow();

        this.activityRangeText.textAlign = "center";
        this.activityRangeText.x = (this.playerFrame.image.width / 2);
        this.activityRangeText.y = 0;
        this.activityRangeText.color = "#f3f3f3";
        this.activityRangeText.font = "12px Arial";
        this.activityRangeText.shadow = createMyShadow();

        this.uncertaintyText.textAlign = "center";
        this.uncertaintyText.x = (this.playerFrame.image.width / 2);
        this.uncertaintyText.y = 15;
        this.uncertaintyText.color = "#f3f3f3";
        this.uncertaintyText.font = "12px Arial";
        this.uncertaintyText.shadow = createMyShadow();

        this.positiveText.textAlign = "center";
        this.positiveText.x = (this.playerFrame.image.width / 2);
        this.positiveText.y = 45;
        this.positiveText.color = "#00ee00";
        this.positiveText.font = "12px Arial";
        this.positiveText.shadow = createMyShadow();

        this.negativeText.textAlign = "center";
        this.negativeText.x = (this.playerFrame.image.width / 2);
        this.negativeText.y = 60;
        this.negativeText.color = "#ff0000";
        this.negativeText.font = "12px Arial";
        this.negativeText.shadow = createMyShadow();
    }
}
export class Player2ResourceArea extends viewBase.PlayerResourceAreaBase {
    constructor(queue: createjs.LoadQueue) {
        super(5);
        this.resourceArea.image = <any>queue.getResult("evenPlayerRBArea");
        this.resourceArea.regX = 0;
        this.resourceArea.regY = this.resourceArea.image.height / 2;
        this.resourceArea.x = 100;
        this.resourceArea.y = global.canvasHeight / 2 - (this.resourceArea.image.height / 2) - 2;
        this.resourceList.x = 100;
        this.resourceList.y = global.canvasHeight / 2 - (this.resourceArea.image.height) - 2;
    }
}
export class Player2Build extends viewBase.PlayerBuildBase {
    constructor(queue: createjs.LoadQueue) {
        super(5);
        this.buildArea.image = <any>queue.getResult("evenPlayerRBArea");
        this.buildArea.regX = 0;
        this.buildArea.regY = this.buildArea.image.height / 2;
        this.buildArea.x = 100;
        this.buildArea.y = global.canvasHeight / 2 + (this.buildArea.image.height / 2) + 2;
        this.buildList.x = 100;
        this.buildList.y = global.canvasHeight / 2 + 2;

    }
}

export class Player3Window extends viewBase.PlayerWindowBase {
    constructor(queue: createjs.LoadQueue) {
        super();

        this.playerFrame.image = <any>queue.getResult("evenPlayerFrame");
        this.playerFrame.regX = this.playerFrame.image.width / 2;
        this.playerFrame.regY = this.playerFrame.image.height;
        this.playerFrame.rotation = 180;

        this.x = global.canvasWidth / 2;

        this.playerNameText.color = "#ddab40";
        this.playerNameText.font = "20px Arial";
        this.playerNameText.textAlign = "center";
        this.playerNameText.y = 5;
        this.playerNameText.shadow = createMyShadow();

        this.speedText.textAlign = "center";
        this.speedText.x = (-3.5) * (this.playerFrame.image.width / 10);
        this.speedText.y = 35;
        this.speedText.color = "#f3f3f3";
        this.speedText.font = "15px Arial";
        this.speedText.shadow = createMyShadow();

        this.resourceText.textAlign = "center";
        this.resourceText.x = (-1.2) * (this.playerFrame.image.width / 10);
        this.resourceText.y = 35;
        this.resourceText.color = "#f3f3f3";
        this.resourceText.font = "15px Arial";
        this.resourceText.shadow = createMyShadow();

        this.activityRangeText.textAlign = "center";
        this.activityRangeText.x = (1.2) * (this.playerFrame.image.width / 10);
        this.activityRangeText.y = 35;
        this.activityRangeText.color = "#f3f3f3";
        this.activityRangeText.font = "15px Arial";
        this.activityRangeText.shadow = createMyShadow();

        this.uncertaintyText.textAlign = "center";
        this.uncertaintyText.x = (3.5) * (this.playerFrame.image.width / 10);
        this.uncertaintyText.y = 35;
        this.uncertaintyText.color = "#f3f3f3";
        this.uncertaintyText.font = "15px Arial";
        this.uncertaintyText.shadow = createMyShadow();

        this.positiveText.textAlign = "center";
        this.positiveText.x = (-1) * (this.playerFrame.image.width / 8);
        this.positiveText.y = 60;
        this.positiveText.color = "#00ee00";
        this.positiveText.font = "15px Arial";
        this.positiveText.shadow = createMyShadow();

        this.negativeText.textAlign = "center";
        this.negativeText.x = (1) * (this.playerFrame.image.width / 8);
        this.negativeText.y = 60;
        this.negativeText.color = "red";
        this.negativeText.font = "15px Arial";
        this.negativeText.shadow = createMyShadow();
    }
}
export class Player3ResourceArea extends viewBase.PlayerResourceAreaBase {
    constructor(queue: createjs.LoadQueue) {
        super(15);
        this.resourceArea.image = <any>queue.getResult("oddPlayerRBArea");
        this.resourceArea.regX = this.resourceArea.image.width / 2;
        this.resourceArea.regY = 0;
        this.resourceArea.x = global.canvasWidth / 2;
        this.resourceArea.y = 85;
        this.resourceList.x = global.canvasWidth / 2 - this.resourceArea.image.width / 2;
        this.resourceList.y = 85;
    }
}
export class Player3Build extends viewBase.PlayerBuildBase {
    constructor(queue: createjs.LoadQueue) {
        super(15);
        this.buildArea.image = <any>queue.getResult("oddPlayerRBArea");
        this.buildArea.regX = this.buildArea.image.width / 2;
        this.buildArea.regY = 0;
        this.buildArea.x = global.canvasWidth / 2;
        this.buildArea.y = 85 + this.buildArea.image.height + 4;
        this.buildList.x = global.canvasWidth / 2 - this.buildArea.image.width / 2;
        this.buildList.y = 85 + this.buildArea.image.height + 4;;

    }
}

export class Player4Window extends viewBase.PlayerWindowBase {
    constructor(queue: createjs.LoadQueue) {
        super();

        this.playerFrame.image = <any>queue.getResult("oddPlayerFrame");
        this.playerFrame.regY = this.playerFrame.image.height / 2;
        this.playerFrame.regX = this.playerFrame.image.width;
        this.playerFrame.rotation = 180;
        this.y = global.canvasHeight / 2;
        this.x = global.canvasWidth - this.playerFrame.image.width;

        this.playerNameText.textAlign = "center";
        this.playerNameText.x = (this.playerFrame.image.width / 2);
        this.playerNameText.color = "#ddee41";
        this.playerNameText.font = "14px Arial";
        this.playerNameText.y = -60;
        this.playerNameText.shadow = createMyShadow();

        this.speedText.textAlign = "center";
        this.speedText.x = (this.playerFrame.image.width / 2);
        this.speedText.y = -30;
        this.speedText.color = "#f3f3f3";
        this.speedText.font = "12px Arial";
        this.speedText.shadow = createMyShadow();

        this.resourceText.textAlign = "center";
        this.resourceText.x = (this.playerFrame.image.width / 2);
        this.resourceText.y = -15;
        this.resourceText.color = "#f3f3f3";
        this.resourceText.font = "12px Arial";
        this.resourceText.shadow = createMyShadow();

        this.activityRangeText.textAlign = "center";
        this.activityRangeText.x = (this.playerFrame.image.width / 2);
        this.activityRangeText.y = 0;
        this.activityRangeText.color = "#f3f3f3";
        this.activityRangeText.font = "12px Arial";
        this.activityRangeText.shadow = createMyShadow();

        this.uncertaintyText.textAlign = "center";
        this.uncertaintyText.x = (this.playerFrame.image.width / 2);
        this.uncertaintyText.y = 15;
        this.uncertaintyText.color = "#f3f3f3";
        this.uncertaintyText.font = "12px Arial";
        this.uncertaintyText.shadow = createMyShadow();

        this.positiveText.textAlign = "center";
        this.positiveText.x = (this.playerFrame.image.width / 2);
        this.positiveText.y = 45;
        this.positiveText.color = "#00ee00";
        this.positiveText.font = "12px Arial";
        this.positiveText.shadow = createMyShadow();

        this.negativeText.textAlign = "center";
        this.negativeText.x = (this.playerFrame.image.width / 2);
        this.negativeText.y = 60;
        this.negativeText.color = "red";
        this.negativeText.font = "12px Arial";
        this.negativeText.shadow = createMyShadow();
    }
}
export class Player4ResourceArea extends viewBase.PlayerResourceAreaBase {
    constructor(queue: createjs.LoadQueue) {
        super(5);
        this.resourceArea.image = <any>queue.getResult("evenPlayerRBArea");
        this.resourceArea.regX = this.resourceArea.image.width;
        this.resourceArea.regY = this.resourceArea.image.height / 2;
        this.resourceArea.x = global.canvasWidth - 100;
        this.resourceArea.y = global.canvasHeight / 2 - (this.resourceArea.image.height / 2) - 2;
        this.resourceList.x = global.canvasWidth - 100 - this.resourceArea.image.width;
        this.resourceList.y = global.canvasHeight / 2 - (this.resourceArea.image.height) - 2;
    }
}
export class Player4Build extends viewBase.PlayerBuildBase {
    constructor(queue: createjs.LoadQueue) {
        super(5);
        this.buildArea.image = <any>queue.getResult("evenPlayerRBArea");
        this.buildArea.regX = this.buildArea.image.width;
        this.buildArea.regY = this.buildArea.image.height / 2;
        this.buildArea.x = global.canvasWidth - 100;
        this.buildArea.y = global.canvasHeight / 2 + (this.buildArea.image.height / 2) + 2;
        this.buildList.x = global.canvasWidth - 100 - this.buildArea.image.width;
        this.buildList.y = global.canvasHeight / 2 + 2;
    }
}