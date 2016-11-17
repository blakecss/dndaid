var gulp = require('gulp');
var watch = require('gulp-watch');
var sass = require('gulp-sass');
var useref = require('gulp-useref');
var gulpIf = require('gulp-if');
var uglify = require('gulp-uglify')
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();
var autoPrefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var cssMin = require('gulp-cssmin');
var del = require('del');

var base = './';

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: base
    }
  })
});

gulp.task('sass', function() {
  return gulp.src(base + 'css/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoPrefixer())
    .pipe(gulp.dest(base + '/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('useref', function() {
  return gulp.src(base + '*.html')
  .pipe(useref())
  .pipe(gulpIf('*.js', uglify()))
  .pipe(gulpIf('*.css', cssMin()))
  .pipe(gulp.dest(base + '/dist'))
});

gulp.task('clean:dist', function() {
  return del.sync('dist');
});

gulp.task('watch', ['browserSync', 'sass'], function() {
  gulp.watch(base + 'css/*.scss', ['sass']);
  gulp.watch(base + '**/*.html', browserSync.reload);
  gulp.watch(base + '**/*.js', browserSync.reload);
});

gulp.task('build', ['useref'], function() {
  runSequence('clean:dist', ['sass', 'useref']);
});

gulp.task('default', function() {
  runSequence(['sass', 'browserSync', 'watch']);
});
