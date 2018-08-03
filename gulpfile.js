var gulp = require("gulp");
var typescript = require('gulp-typescript');
var runSequence = require('run-sequence');
var concat = require('gulp-concat');
var watch = require('gulp-watch');
var spawn = require('child_process').spawn;
var node;
const webpackStream = require("webpack-stream");
const webpack = require("webpack");

// webpackの設定ファイルの読み込み
const webpackConfig = require("./webpack.config");

gulp.task("webpack", () => {
    return new Promise((resolve, reject) => {
        webpackStream(webpackConfig, webpack)
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

gulp.task('watch', () => {
    runSequence('build', 'webpack', 'start');
    watch(['./Server/**/*.ts', './Share/**/*.ts'], () => {
        runSequence('build', 'webpack', 'start');
    });
    watch(['./Client/**/*.ts'], () => {
        runSequence('webpack');
    });
});

// clean up if an error goes unhandled.
process.on('exit', function () {
    if (node) node.kill()
})