
window.onload = () => {
    let stage = new createjs.Stage("myCanvas");
    let circle = new createjs.Shape();
    circle.addEventListener("click", e => alert("baho"));
    circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
    circle.x = 100;
    circle.y = 100;
    stage.addChild(circle);
    stage.update();
}