const gulp = require('gulp');

const browserSync = require('browser-sync').create(),
    reloadBrowser = browserSync.reload;

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

gulp.task('ppHTML', () => {
    return gulp.src(`${assetsDir}/**/*.html`)
        .pipe(plumber())
        .pipe(gulp.dest(distDir))
});

gulp.task('ppCSS', () => {
    return gulp.src(`${assetsDir}/css/style.css`)
        .pipe(plumber())
        .pipe(autoPrefixer())
        .pipe(rename('compiled.css'))
        .pipe(gulp.dest(`${distDir}/css`))
        .pipe(minifyCSS({
            zindex: false
        }))
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest(`${distDir}/css`));
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
        .pipe(gulp.dest(`${distDir}/js`));
});

gulp.task('watch', ['ppHTML', 'ppCSS', 'ppJS'], () => {
    gulp.watch(`${assetsDir}/**/*.html`, ['ppHTML']);
    gulp.watch(`${assetsDir}/css/style.css`, ['ppCSS']);
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

gulp.task('buildDist', ['ppHTML', 'ppCSS', 'ppJS', 'ppImages'], () => {
    console.log('Done');
});