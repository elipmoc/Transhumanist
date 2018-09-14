var gulp = require("gulp");
var typescript = require('gulp-typescript');
var runSequence = require('run-sequence');
var concat = require('gulp-concat');
var spawn = require('child_process').spawn;
var node;
const webpackStream = require("webpack-stream");
const webpack = require("webpack");
var plumber = require('gulp-plumber');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const spritesmith = require('gulp.spritesmith');
// webpackの設定ファイルの読み込み
const webpackConfig = require("./webpack.config");

gulp.task('sprite', function () {
    var spriteData = gulp.src('./Resource/Img/boardSprite/**/*.png')
        .pipe(spritesmith({
            imgName: 'boardSprite.png',
            cssName: 'boardSprite.json'
        }));
    return spriteData.pipe(gulp.dest('./Resource/Sprite'));
});

gulp.task('sprite_compress', () =>
    gulp.src('./Resource/Sprite/**/*.png')
        .pipe(imagemin([
            pngquant({ nofs: true, posterize: 2, speed: 1 })
        ]))
        .pipe(imagemin())
        .pipe(gulp.dest('./Resource/Sprite'))
);

gulp.task('compress', () =>
    gulp.src('./Resource/Img/**/*.png')
        .pipe(imagemin([
            pngquant({ nofs: true, posterize: 2, speed: 1 })
        ]))
        .pipe(imagemin())
        .pipe(gulp.dest('./Resource/PImg'))
);

gulp.task("webpack", () => {
    return new Promise((resolve, reject) => {
        gulp.src("./Client/**/*.ts")
            .pipe(plumber())
            .pipe(webpackStream(webpackConfig, webpack))
            .pipe(gulp.dest("./"))
            .on("end", resolve);
    });
});

gulp.task("build", () => {
    var pj_server = typescript.createProject("./Server/tsconfig.json");
    var pj_share = typescript.createProject("./Share/tsconfig.json");
    return Promise.all([
        new Promise((resolve, reject) => {
            gulp.src([
                "./Share/**/*.ts",
                "!./node_modules/**"
            ])
                .pipe(plumber())
                .pipe(pj_share())
                .js
                .pipe(gulp.dest("./dist/Share/"))
                .on("end", resolve)
        }),
        new Promise((resolve, reject) => {
            gulp.src([
                "./Server/**/*.ts",
                "./Share/**/*.ts",
                "!./node_modules/**"
            ])
                .pipe(plumber())
                .pipe(pj_server())
                .js
                .pipe(gulp.dest("./dist/Server/"))
                .on("end", resolve)
        })
    ]).then(_ => {
        console.log("ビルド成功したよ！");
        return Promise.resolve();
    });
});

gulp.task("start", () => {
    return new Promise((resolve, reject) => {
        if (node) node.kill()
        node = spawn('node', ['dist/Server/main.js'], { stdio: 'inherit' })
        console.log("サーバー起動")
        node.on('close', code => {
            if (code === 8) {
                gulp.log('Error detected, waiting for changes...');
            }
        });
        resolve();
    });
});

gulp.task("server", () =>
    new Promise((resolve, reject) => runSequence('build', 'start', resolve))
);

gulp.task('watch', () => {
    return new Promise((resolve, reject) => {
        runSequence('build', 'webpack', 'start', () => {
            gulp.watch(['Server/**/*.ts', 'Share/**/*.ts'], ['server'])
            gulp.watch('Client/**/*.ts', ['webpack']);
            resolve();
        });
    });
});

// clean up if an error goes unhandled.
process.on('exit', function () {
    if (node) node.kill()
})