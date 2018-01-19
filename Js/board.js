
window.onload = () => {
    let stage = new createjs.Stage("myCanvas");
    let background = new createjs.Shape();
    background.graphics.beginFill("black").drawRect(0, 0, 960, 876);
    background.x = 0;
    background.y = 0;
    stage.addChild(background);
    stage.update();
}