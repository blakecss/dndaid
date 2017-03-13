var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var autoPrefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');

var base = './';

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: base
    }
  });
});

gulp.task('sass', function() {
  return gulp.src(base + 'css/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoPrefixer({
      browsers: ['> 1%', 'last 2 versions']
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(base + '/css'))
    .pipe(browserSync.stream());
});

gulp.task('default', ['browserSync', 'sass'], function() {
  gulp.watch(base + 'css/*.scss', ['sass']);
  gulp.watch(base + '**/*.html', browserSync.reload);
  gulp.watch(base + '**/*.js', browserSync.reload);
});
