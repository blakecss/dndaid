var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var autoPrefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var include = require('gulp-include');
var runSequence = require('run-sequence');

var base = '/Applications/MAMP/htdocs/vue/';

// Initialize Browser Sync
gulp.task('browserSync', function() {
  browserSync.init({
    proxy: 'localhost/vue'
  });
});

// Compile and minify CSS (SASS) files
gulp.task('sass', function() {
  return gulp.src(base + 'src/scss/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoPrefixer({
      browsers: ['> 1%', 'last 2 versions', 'Safari >= 7']
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(base + 'dist/css'))
    .pipe(browserSync.stream());
});

// Concatenate (includes), minify, and generate source maps for javascript files
gulp.task('js', function() {
  return gulp.src(base + 'src/js/**/[^_]*.js')
    .pipe(sourcemaps.init())
    .pipe(include({
      includePaths: [
        base + 'lib',
        base + 'src/js/**'
      ]
    })).on('error', function(e) {
      console.log(e.toString());
      this.emit('end');
    })
    .pipe(uglify()).on('error', function(e) {
      console.log(e.toString());
      this.emit('end');
    })
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(base + 'dist/js'));
});

// Watch files for changes
gulp.task('default', ['browserSync', 'sass', 'js'], function() {
  gulp.watch(base + 'src/scss/**/*.scss', ['sass']);
  gulp.watch(base + '**/*.{html,php,svg,json}', browserSync.reload);
  gulp.watch(base + 'src/js/**/*.js', function() {
    runSequence('js', browserSync.reload);
  });
});

// Build files without running browserSync
gulp.task('build', function() {
  runSequence('sass', 'js');
});
