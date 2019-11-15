var gulp = require("gulp");
var typescript = require('gulp-typescript');
var spawn = require('child_process').spawn;
var node;
const webpackStream = require("webpack-stream");
const webpack = require("webpack");
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const spritesmith = require('gulp.spritesmith');

// gulp.task('sprite', () => {
//     var spriteData = gulp.src('./Resource/Img/boardSprite/**/*.png')
//         .pipe(spritesmith({
//             imgName: 'boardSprite.png',
//             cssName: 'boardSprite.json'
//         }));
//     return spriteData.pipe(gulp.dest('./Resource/Sprite'));
// });

// gulp.task('sprite_compress', () =>
//     gulp.src('./Resource/Sprite/**/*.png')
//         .pipe(imagemin([
//             pngquant({ nofs: true, posterize: 2, speed: 1 })
//         ]))
//         .pipe(imagemin())
//         .pipe(gulp.dest('./Resource/Sprite'))
// );

// gulp.task('compress', () =>
//     gulp.src('./Resource/Img/**/*.png')
//         .pipe(imagemin([
//             pngquant({ nofs: true, posterize: 2, speed: 1 })
//         ]))
//         .pipe(imagemin())
//         .pipe(gulp.dest('./Resource/PImg'))
// );

gulp.task("webpack", done => {
    const webpackConfig = require("./webpack.config");
    return webpackStream(webpackConfig, webpack).on('error', function (e) {
        this.emit('end');
    }).pipe(gulp.dest("./"));
});

gulp.task("webpack_pro", done => {
    const webpackConfig = require("./webpack.config");
    webpackConfig.mode = "production";
    gulp.src("./Client/**/*.ts")
        .pipe(webpackStream(webpackConfig, webpack))
        .pipe(gulp.dest("./"))
        .on("end", done);
});

gulp.task("build", done => {
    var pj_server = typescript.createProject("./Server/tsconfig.json");
    var pj_share = typescript.createProject("./Client/src/Share/tsconfig.json");
    Promise.all([
        new Promise((resolve, reject) => {
            gulp.src([
                "./Client/src/Share/**/*.ts",
                "!./node_modules/**"
            ])
                .pipe(pj_share())
                .pipe(gulp.dest("./dist/Client/src/Share/"))
                .on("end", resolve)
        }),
        new Promise((resolve, reject) => {
            gulp.src([
                "./Server/**/*.ts",
                "./Client/src/Share/**/*.ts",
                "!./node_modules/**"
            ])
                .pipe(pj_server())
                .pipe(gulp.dest("./dist/Server/"))
                .on("end", resolve)
        })
    ]).then(_ => {
        console.log("ビルド成功したよ！");
        done();
    });
});

gulp.task("test_build", done => {
    var pj_test = typescript.createProject("./Test/tsconfig.json");
    gulp.src([
        "./Client/src/Share/**/*.ts",
        "./Test/**/*.ts",
        "!./node_modules/**",
        "./Server/**/*.ts",
    ])
        .pipe(pj_test())
        .pipe(gulp.dest("./dist/Test/"))
        .on("end", () => {
            console.log("ビルド成功したよ！");
            done();
        });
});

gulp.task("start", done => {
    if (node) node.kill();
    node = spawn('node', ['dist/Server/main.js'], { stdio: 'inherit' })
    console.log("サーバー起動")
    node.on('close', code => {
        if (code === 8) {
            gulp.log('Error detected, waiting for changes...');
        }
    });
    done();

});

gulp.task("server", gulp.series('build', 'start'));

gulp.task('watch',
    gulp.series('build', 'webpack', 'start', done => {
        gulp.watch(['Server/**/*.ts', 'Share/**/*.ts'], gulp.task('server'))
        gulp.watch('Client/**/*.ts', gulp.task('webpack'));
        done();
    })
);

// clean up if an error goes unhandled.
process.on('exit', function () {
    if (node) node.kill()
})