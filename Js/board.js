enchant();

window.onload = () => {

    var game = new Game(960, 540);
    game.onload = function () {
        // ここに処理を書いていきます。

        var scene = new Scene();
        let label = new Label("hello! world!");
        label.font = 'bold 30px "ＭＳ 明朝"';
        scene.addChild(label);
        game.pushScene(scene);
        scene.addChild(sprite);
    };
    game.start();
}