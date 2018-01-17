enchant();

window.onload = () => {

    var game = new Game(960, 876);
    game.onload = function () {
        // ここに処理を書いていきます。


        var scene = new Scene();
        let backColorSprite = new Sprite(960, 876);
        let surface = new Surface(960, 876)
        surface.context.beginPath();
        surface.context.fillStyle = "rgb(0,0,0)";
        surface.context.fillRect(0, 0, 960, 876);
        backColorSprite.image = surface;
        scene.addChild(backColorSprite);
        let label = new Label("hello! world!");
        label.font = 'bold 30px "ＭＳ 明朝"';
        scene.addChild(label);
        game.pushScene(scene);
    };
    game.start();
}