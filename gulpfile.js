/**
 * Created with JetBrains PhpStorm.
 * User: huangjinlan
 * Date: 16-4-25
 * Time: 下午1:32
 * To change this template use File | Settings | File Templates.
 */

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-minify-css');
var rename = require('gulp-rename');
var del = require('del');
var jshint = require('gulp-jshint');
var tmod = require('gulp-tmod');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var px2rem = require('gulp-px3rem');
var htmlone = require('gulp-htmlone');
var connect = require('gulp-connect');
//压缩html
var htmlmin = require('gulp-htmlmin');

var uglifies = [];

gulp.task('connect', function () {
    connect.server({
        livereload: true
    });
});
gulp.task('clean', function (cb) {
    del(['build'], cb);
});

gulp.task('cleantpl', function (cb) {
    del(['src/tpl'], cb);
});

gulp.task('tmod', function () {
    gulp.src('src/templates/**/*.html')
        .pipe(tmod({
            debug: true,
            combo: true,
            minify: false,
            cache: false,
            compress: true,
            type: "default",
            helpers: 'src/templates/$helper.js',
            runtime: 'template.js',
            syntax: 'simple',
            base: 'src/templates',
            output: 'src/tpl'
        }))
        .pipe(connect.reload());
});

gulp.task('html', function () {
    gulp.src('./demo/pages/*.html')
        .pipe(connect.reload());
});

gulp.task('js', function () {
    gulp.src('src/**/**/*.js')
        .pipe(connect.reload());
});
gulp.task('sass', function () {
    return gulp.src('src/pages/**/*.scss')
        .pipe(sass())
        .pipe(px2rem({
            baseDpr: 2, // base device pixel ratio (default: 2)
            threeVersion: false, // whether to generate 3x version (default: true)
            remVersion: true, // whether to generate rem version (default: true)
            remUnit: 75, // rem unit value (default: 64)
            remPrecision: 6 // rem precision (default: 6)
        }))
        .pipe(gulp.dest('build/'));
});

gulp.task('cssmin', ['sass'], function () {
    return gulp.src('build/**/*.debug.css')
        .pipe(cssmin())
        .pipe(rename(function (path) {
            path.basename = path.basename.replace('.debug', '');
        }))
        .pipe(gulp.dest('build/'))
        .pipe(connect.reload());
});


gulp.task('htmlbuild',['htmlone'], function () {
    return gulp.src('dest/pages/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest('dest/pages'));
});

gulp.task('watch', ['connect'], function () {
    gulp.watch('src/**/**/*.scss', ['cssmin']);
    gulp.watch('src/**/**/*.js', ['js']);
    gulp.watch('demo/pages/*.html', ['html']);
    gulp.watch('src/templates/**/*.html', ['tmod']);
});

//htmlone打包所有页面
gulp.task('htmlone', function () {
    var arr = ['demo/pages/*.html'];
    return gulp.src(arr)
        .pipe(htmlone({
            jsminify: true
        }))
        .pipe(gulp.dest('dest/pages'));
});


gulp.task('default', ['clean','tmod'], function () {
   var tasks = uglifies.concat('cssmin');
   gulp.start(tasks);
});

