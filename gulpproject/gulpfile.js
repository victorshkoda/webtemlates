const {src, dest, watch, parallel, series} = require('gulp')
const scss = require('gulp-sass')
const concat = require('gulp-concat')
const browserSync = require('browser-sync').create()
const ugify = require('gulp-uglify-es').default
const babel = require('gulp-babel')
const sourcemaps = require('gulp-sourcemaps')
const strip = require('gulp-strip-comments')
const autoprefixer = require('gulp-autoprefixer')
const imagemin = require('gulp-imagemin')
const del = require('del')

function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'app/'
        },
        port: 3003
    })
}

function cleanDist() {
    return del('dist')
}

function images() {
    return src('app/images/**/*')
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 75, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(dest('dist/images'))
}

// !!! Use if js with promices or generators
function scripts() {
    return src(['node_modules/babel-polyfill/dist/polyfill.js','app/js/main.js'])
        .pipe(babel({ presets: ['@babel/env']}))
        .pipe(ugify())
        .pipe(strip())
        .pipe(concat('main.min.js'))
        .pipe(dest('app/js'))
        .pipe(browserSync.stream())
}

/*function scripts() {
    return src(['node_modules/jquery/dist/jquery.js','app/js/main.js'])
        .pipe(babel({ presets: ['@babel/env']}))
        .pipe(ugify())
        .pipe(strip())
        .pipe(concat('main.min.js'))
        .pipe(dest('app/js'))
        .pipe(browserSync.stream())
}*/

function styles() {
    return src('app/scss/style.scss')
        .pipe(sourcemaps.init())
        .pipe(scss({outputStyle: 'compressed'}))
        .pipe(concat('style.min.css'))
        .pipe(autoprefixer({overrideBrowserslist: ['last 10 version'], grid: true}))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())
}

function watching(){
   watch(['app/scss/**/*.scss'], styles)
   watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts)
   watch(['app/**/*.html']).on('change', browserSync.reload)
}

function build(){
    return src([
        'app/css/**/*.min.css',
        'app/js/**/*.min.js',
        'app/fonts/**/*',
        'app/**/*.html'
    ], {base: 'app'})
        .pipe(dest('dist'))
}

exports.styles = styles
exports.scripts = scripts
exports.watching = watching
exports.browsersync = browsersync
exports.images = images
exports.cleanDist = cleanDist
exports.build = series(styles, scripts, cleanDist, images, build)
exports.default = parallel(styles, scripts, browsersync, watching)