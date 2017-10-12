const gulp = require('gulp');

const browserSync = require('browser-sync').create(),
    reloadBrowser = browserSync.reload;

const sass = require('gulp-sass');

const plumber = require('gulp-plumber'),
    clean = require('gulp-clean'),
    minifyImage = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    merge = require('merge-stream');

const autoPrefixer = require('gulp-autoprefixer'),
    minifyCSS = require('gulp-cssnano');

const babel = require('gulp-babel'),
    minifyJS = require('gulp-uglify');

let assetsDir = './src';
let distDir = './dist';

gulp.task('ppCSS', () => {
    return gulp.src(`${assetsDir}/css/style.scss`)
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoPrefixer())
        .pipe(rename('compiled.css'))
        .pipe(gulp.dest(`${distDir}/css`))
        .pipe(minifyCSS({
            zindex: false
        }))
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest(`${distDir}/css`))
        .pipe(browserSync.stream());
});

gulp.task('ppJS', () => {
    return gulp.src(`${assetsDir}/js/main.js`)
        .pipe(plumber())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(rename('compiled.js'))
        .pipe(gulp.dest(`${distDir}/js`))
        .pipe(minifyJS())
        .pipe(rename('main.min.js'))
        .pipe(gulp.dest(`${distDir}/js`))
        .pipe(browserSync.stream());
});

gulp.task('watch', ['ppCSS', 'ppJS'], () => {
    browserSync.init({
        server: "./"
    });


    gulp.watch(`./**/*.html`, reloadBrowser);
    gulp.watch(`${assetsDir}/css/style.scss`, ['ppCSS']);
    gulp.watch(`${assetsDir}/js/main.js`, ['ppJS']);
});

gulp.task('cleanImages', () => {
    gulp.src(`${distDir}/img`)
        .pipe(clean())
});

gulp.task('ppImages', () => {
    gulp.src(`${assetsDir}/img/**/*`, {
            base: `${assetsDir}/img/`
        })
        .pipe(minifyImage())
        .pipe(gulp.dest(`${distDir}/img`));
});

gulp.task('cleanDist', () => {
    gulp.src(`${distDir}`)
        .pipe(clean())
});

gulp.task('buildDist', ['ppCSS', 'ppJS', 'ppImages'], () => {
    console.log('Done');
});