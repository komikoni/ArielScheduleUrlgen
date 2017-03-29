// gulpfile.js
var gulp       = require('gulp');
var browserify = require('browserify');
var source     = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');

// browserify and gulp.
gulp.task('watch', function () {
    gulp.watch(['./*.js'], ['build-js']);
});
gulp.task('browserify', function () {
    return browserify('./main.js')
            .bundle()
            .pipe(source('bundle.js'))
            .pipe(gulp.dest('./dist/'));
});
gulp.task('build-js', function () {
    return browserify({
        entries: './main.js' // どのファイルからビルドするか
    }).plugin('licensify') // licensifyプラグインの有効化
        .bundle() // browserifyの実行
        .pipe(source('bundle.js'))
        .pipe(buffer())
//        .pipe(uglify({
//            preserveComments: 'license' // ライセンスコメントを残しつつminify
//        }))
        .pipe(gulp.dest('./dist')); // 出力
});
