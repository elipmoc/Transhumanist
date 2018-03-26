import * as global from "./boardGlobalData"
import * as viewBase from "./viewBase"

//player情報
export class PlayerInfo {
    playerName: string;
    speed: number;
    resource: number;
    activityRange: number;
    uncertainty: number;
    positive: number;
    negative: number;
}

//宣戦布告ボタン
export class DeclareWarButton extends viewBase.ButtonBase {
    private declareWarButton: createjs.Bitmap;
    private declareWarText: createjs.Text;
    constructor(onClickCallback: () => void, queue: createjs.LoadQueue) {
        super(onClickCallback);
        //ボタン画像
        this.declareWarButton = new createjs.Bitmap(queue.getResult("button"));
        this.declareWarButton.regX = 0;
        this.declareWarButton.regY = this.declareWarButton.image.height;
        this.declareWarButton.x = 20;
        this.declareWarButton.y = global.canvasHeight - 20;
        this.declareWarButton.addEventListener("click", () => onClickCallback());
        this.addChild(this.declareWarButton);

        //ボタンテキスト
        this.declareWarText = new createjs.Text("宣戦布告/降伏", "20px Arial");
        this.declareWarText.regX = this.declareWarText.getMeasuredWidth() / 2;
        this.declareWarText.regY = this.declareWarText.getMeasuredHeight() / 2;
        this.declareWarText.x = this.declareWarButton.x + this.declareWarButton.image.width / 2;
        this.declareWarText.y = this.declareWarButton.y - this.declareWarButton.image.height / 2;
        this.addChild(this.declareWarText);
    }
}

//ターン終了ボタン
export class TurnFinishButton extends viewBase.ButtonBase {
    private turnFinishButton: createjs.Bitmap;
    private turnFinishText: createjs.Text;
    constructor(onClickCallback: () => void, queue: createjs.LoadQueue) {
        super(onClickCallback);
        //ターン終了ボタン画像
        this.turnFinishButton = new createjs.Bitmap(queue.getResult("button"));
        this.turnFinishButton.regX = this.turnFinishButton.image.width;
        this.turnFinishButton.regY = this.turnFinishButton.image.height;
        this.turnFinishButton.x = global.canvasWidth - 20;
        this.turnFinishButton.y = global.canvasHeight - 20;
        this.turnFinishButton.addEventListener("click", () => onClickCallback());
        this.addChild(this.turnFinishButton);

        //ターン終了ボタンテキスト
        this.turnFinishText = new createjs.Text("ターン終了", "20px Arial");
        this.turnFinishText.regX = this.turnFinishText.getMeasuredWidth() / 2;
        this.turnFinishText.regY = this.turnFinishText.getMeasuredHeight() / 2;
        this.turnFinishText.x = this.turnFinishButton.x - this.turnFinishButton.image.width / 2;
        this.turnFinishText.y = this.turnFinishButton.y - this.turnFinishButton.image.height / 2;
        this.addChild(this.turnFinishText);
    }
}

//設定ボタン
export class SettingButton extends viewBase.ButtonBase {
    private settingButton: createjs.Bitmap;
    constructor(onClickCallback: () => void, queue: createjs.LoadQueue) {
        super(onClickCallback);
        this.settingButton = new createjs.Bitmap(queue.getResult("setting"));
        this.settingButton.addEventListener("click", () => onClickCallback());
        this.addChild(this.settingButton);
    }

    public getHeight() { return this.settingButton.image.height; }

}

export class Player1Window extends viewBase.PlayerWindowBase {
    constructor(queue: createjs.LoadQueue) {
        super();

        this.playerFrame.image = <any>queue.getResult("evenPlayerFrame");
        this.playerFrame.regX = this.playerFrame.image.width / 2;
        this.playerFrame.regY = 0;

        this.x = global.canvasWidth / 2;
        this.y = global.canvasHeight - this.playerFrame.image.height;

        this.playerNameText.color = "blue";
        this.playerNameText.font = "20px Arial";
        this.playerNameText.regX = this.playerNameText.getMeasuredWidth() / 2;
        this.playerNameText.y = 5;

        this.speedText.x = -180;
        this.speedText.y = 35;
        this.speedText.color = "white";
        this.speedText.font = "15px Arial";

        this.resourceText.x = -80;
        this.resourceText.y = 35;
        this.resourceText.color = "white";
        this.resourceText.font = "15px Arial";

        this.activityRangeText.x = 10;
        this.activityRangeText.y = 35;
        this.activityRangeText.color = "white";
        this.activityRangeText.font = "15px Arial";

        this.uncertaintyText.x = 90;
        this.uncertaintyText.y = 35;
        this.uncertaintyText.color = "white";
        this.uncertaintyText.font = "15px Arial";

        this.positiveText.x = -80;
        this.positiveText.y = 60;
        this.positiveText.color = "green";
        this.positiveText.font = "15px Arial";

        this.negativeText.x = 0;
        this.negativeText.y = 60;
        this.negativeText.color = "red";
        this.negativeText.font = "15px Arial";
    }
}

export class Player2Window extends viewBase.PlayerWindowBase {
    constructor(queue: createjs.LoadQueue) {
        super();

        this.playerFrame.image = <any>queue.getResult("oddPlayerFrame");
        this.playerFrame.regY = this.playerFrame.image.height / 2;

        this.y = global.canvasHeight / 2;

        this.playerNameText.color = "green";
        this.playerNameText.font = "10px Arial";
        this.playerNameText.y = -60;

        this.speedText.y = -30;
        this.speedText.color = "white";
        this.speedText.font = "12px Arial";

        this.resourceText.y = -15;
        this.resourceText.color = "white";
        this.resourceText.font = "12px Arial";

        this.activityRangeText.y = 0;
        this.activityRangeText.color = "white";
        this.activityRangeText.font = "12px Arial";

        this.uncertaintyText.y = 15;
        this.uncertaintyText.color = "white";
        this.uncertaintyText.font = "12px Arial";

        this.positiveText.y = 45;
        this.positiveText.color = "green";
        this.positiveText.font = "12px Arial";

        this.negativeText.y = 60;
        this.negativeText.color = "red";
        this.negativeText.font = "12px Arial";
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

        this.playerNameText.color = "orange";
        this.playerNameText.font = "20px Arial";
        this.playerNameText.regX = this.playerNameText.getMeasuredWidth() / 2;
        this.playerNameText.y = 5;

        this.speedText.x = -180;
        this.speedText.y = 35;
        this.speedText.color = "white";
        this.speedText.font = "15px Arial";

        this.resourceText.x = -80;
        this.resourceText.y = 35;
        this.resourceText.color = "white";
        this.resourceText.font = "15px Arial";

        this.activityRangeText.x = 10;
        this.activityRangeText.y = 35;
        this.activityRangeText.color = "white";
        this.activityRangeText.font = "15px Arial";

        this.uncertaintyText.x = 90;
        this.uncertaintyText.y = 35;
        this.uncertaintyText.color = "white";
        this.uncertaintyText.font = "15px Arial";

        this.positiveText.x = -80;
        this.positiveText.y = 60;
        this.positiveText.color = "green";
        this.positiveText.font = "15px Arial";

        this.negativeText.x = 0;
        this.negativeText.y = 60;
        this.negativeText.color = "red";
        this.negativeText.font = "15px Arial";
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

        this.playerNameText.color = "yellow";
        this.playerNameText.font = "10px Arial";
        this.playerNameText.y = -60;

        this.speedText.y = -30;
        this.speedText.color = "white";
        this.speedText.font = "12px Arial";

        this.resourceText.y = -15;
        this.resourceText.color = "white";
        this.resourceText.font = "12px Arial";

        this.activityRangeText.y = 0;
        this.activityRangeText.color = "white";
        this.activityRangeText.font = "12px Arial";

        this.uncertaintyText.y = 15;
        this.uncertaintyText.color = "white";
        this.uncertaintyText.font = "12px Arial";

        this.positiveText.y = 45;
        this.positiveText.color = "green";
        this.positiveText.font = "12px Arial";

        this.negativeText.y = 60;
        this.negativeText.color = "red";
        this.negativeText.font = "12px Arial";
    }
}

export class OptionWindow extends createjs.Container {
    constructor(queue: createjs.LoadQueue) {
        super();
    }
}