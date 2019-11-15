var gulp = require("gulp");
var node;
const webpackStream = require("webpack-stream");
const webpack = require("webpack");
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const spritesmith = require('gulp.spritesmith');

gulp.task('sprite', () => {
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


gulp.task('watch',
    gulp.series('webpack', done => {
        gulp.watch('Client/**/*.ts', gulp.task('webpack'));
        done();
    })
);

// clean up if an error goes unhandled.
process.on('exit', function () {
    if (node) node.kill()
})