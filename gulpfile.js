//引入开发工具
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    cssmin = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps'),
    notify = require('gulp-notify'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    htmlmin = require('gulp-htmlmin'),
    htmlhint = require('gulp-htmlhint'),
    browserSync = require('browser-sync').create();


//编译CSS
gulp.task('sass',function(){
    gulp.src(['app/scss/layout.scss'])
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(cssmin())
    .pipe(rename({suffix:'.min'}))
    .pipe(gulp.dest('dist/css'))
    browserSync.reload();
});

//编译插件需要的CSS
gulp.task('swipte-css',function(){
    gulp.src(['app/scss/swipe.scss'])
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(cssmin())
    .pipe(gulp.dest(''))
    .pipe(rename({suffix:'.min'}))
    .pipe(gulp.dest(''))
})


//检测JS语法
gulp.task('jshint',function(){
    gulp.src('app/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});




//检测HTML语法
gulp.task('htmlhint',function(){
    gulp.src('app/*.html')
    .pipe(htmlhint())
    .pipe(htmlmin())
    .pipe(gulp.dest('dist/'));
    browserSync.reload();
});

//编译js
gulp.task('javascript',function(){
    gulp.src('app/js/*.js')
    .pipe(concat('swipe.js'))
    .pipe(gulp.dest(''))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({suffix : '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(gulp.dest(''))
    browserSync.reload();
})



//开启刷新
gulp.task('dev',function(){
    browserSync.init({
        port: 3010,
        server: './dist'
    });
})


//串起来批处理
gulp.task('watch',function(){
    gulp.start('sass', 'swipte-css','jshint', 'htmlhint', 'javascript','dev');
    gulp.watch('app/scss/*.scss', ['sass','swipte-css']);
    gulp.watch('app/js/*.js', ['jshint', 'javascript']);
    gulp.watch('app/*.html', ['htmlhint']);
})