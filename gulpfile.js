var gulp = require("gulp");
var typescript = require('gulp-typescript');
var spawn = require('child_process').spawn;
var node;

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
    gulp.series('build', 'start', done => {
        gulp.watch(['Server/**/*.ts', 'Share/**/*.ts'], gulp.task('server'))
        done();
    })
);

// clean up if an error goes unhandled.
process.on('exit', function () {
    if (node) node.kill()
})