"use strict";

var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('js', function() {
	return gulp.src([
		'src/jquery.viewport-detection.js',
	])
	.pipe(uglify())
    .pipe(rename('jquery.viewport-detection.min.js'))
	.pipe(gulp.dest('dist/js'))
});

gulp.task('default', function() {
	gulp.watch([
		'src/jquery.viewport-detection.js',
	], ['js']);
});
