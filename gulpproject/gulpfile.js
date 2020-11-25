const {src, dest, watch, parallel} = require('gulp')
const scss = require('gulp-sass')
const concat = require('gulp-concat')
const browserSync = require('browser-sync').create()
const ugify = require('gulp-uglify-es').default
const babel = require('gulp-babel')
const sourcemaps = require('gulp-sourcemaps')
const strip = require('gulp-strip-comments')

function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'app/'
        },
        port: 3003
    })
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
        .pipe(scss({outputStyle: 'compressed'}))
        .pipe(concat('syle.min.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())
}

function watching(){
   watch(['app/scss/**/*.scss'], styles)
   watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts)
   watch(['app/**/*.html']).on('change', browserSync.reload)
}

exports.styles = styles
exports.scripts = scripts
exports.watching = watching
exports.browsersync = browsersync
exports.default = parallel(browsersync, watching)