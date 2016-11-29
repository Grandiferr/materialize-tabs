var gulp = require('gulp');
var rename = require('gulp-rename');

var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');

var sass = require('gulp-sass');
var minifyCSS = require('gulp-clean-css');
var concat = require('gulp-concat');

gulp.task('browserify-client', function(){
  return gulp.src('./src/js/tabs.js')
    .pipe(browserify({
      insertGlobals: true
    }))
    .pipe(rename('jquery.materialize-tabs.js'))
    .pipe(gulp.dest('./public/'));
});

gulp.task('uglify', ['browserify-client'], function(){
  return gulp.src('./public/jquery.materialize-tabs.js')
    .pipe(uglify())
    .pipe(rename('jquery.materialize-tabs.min.js'))
    .pipe(gulp.dest('./dist'))
});

gulp.task('styles', function(){
	return gulp.src('./src/css/materialize-tabs.scss')
		// .pipe(concat('jquery.materialize-tabs.css'))
		.pipe(sass())
		.pipe(rename('jquery.materialize-tabs.css'))
		.pipe(gulp.dest('./public/'))
});

gulp.task('minify', ['styles'], function(){
	return gulp.src('./public/*.css')
		.pipe(minifyCSS())
		.pipe(rename('jquery.materialize-tabs.min.css'))
		.pipe(gulp.dest('./dist'));
});

gulp.task('watch', function(){
	gulp.watch('./src/js/*.js', ['uglify']);
	gulp.watch('./src/css/*.css', ['minify']);
});

gulp.task('build', ['uglify', 'minify', 'watch']);
