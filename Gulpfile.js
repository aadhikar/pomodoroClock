var gulp = require('gulp');
var del = require('del');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer   = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var connect = require('gulp-connect');
var watch = require('gulp-watch');
var runSequence = require('gulp-run-sequence');

var port = 8989;

function errorLog(error){
	console.error.bind(error);
	this.emit('end');
}
// task "clean" to delete the dist folder
gulp.task('clean', function () {
  return del([
    './dist/**/*.*'
  ]);
});

gulp.task('html', function () {
  return gulp.src('./*.html')
      .pipe(connect.reload());
});


gulp.task('sass', ['clean'], function() {
  return gulp.src(['./app/scss/**/*.scss']) // Gets all files ending with .scss in app/scss
    .on('error', errorLog)
    .pipe(sourcemaps.init())
    .pipe(sass({
    	style: 'compressed'
    }))
    .pipe(autoprefixer(['last 2 version', 'safari 5', 'ie 8', 'ie 9']))
    .pipe(concat('styles.css'))
    .pipe(cleanCSS())
    .pipe(rename({extname: '.min.css' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/css'))
    .pipe(connect.reload());
});

gulp.task('scripts', ['clean'], function() {
  uglyOptions = {
  beautify: true,
  comments: true,
  sourceMap: false,
  mangle: false
};
  return gulp.src(['./app/js/**/*.js']) // Gets all files ending with .js in app/js
    .on('error', errorLog)
    .pipe(sourcemaps.init())
    .pipe(concat('scripts.js'))
    .pipe(uglify(uglyOptions))
    .pipe(rename({extname: '.min.js' }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest('./dist/js'))
    .pipe(connect.reload());
});


gulp.task('connect', function(){
  return connect.server({
    root: ['../pomodoroClock'],
    port: process.env.PORT || port,
    livereload: true
  });
});

gulp.task('watch', function () {
  gulp.watch(['./*.html', './app/**/*.html'], ['html']);
  gulp.watch(['./app/**/*.scss', './app/**/*.js'], ['clean', 'sass', 'scripts']);
});

//gulp.task('default', ['clean', 'html', 'sass', 'scripts', 'watch', 'connect']);

gulp.task('build', function(cb) {
  runSequence('clean', ['html', 'sass', 'scripts', 'connect', 'watch'], cb);
});

gulp.task('default', function(){
  gulp.start('clean');
  gulp.start('html');
  gulp.start('sass');
  gulp.start('scripts');
  gulp.start('connect');
  gulp.start('watch');
});