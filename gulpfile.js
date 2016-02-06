var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var concatCss = require('gulp-concat-css');
var minifyCss = require('gulp-minify-css');

gulp.task('default', ['sass', 'css', 'scripts','watch']);

gulp.task('watch', function(){
	gulp.watch([
		'./devel/sass/*.scss',
		'./devel/sass/*/*.scss'
		], ['sass']);
	gulp.watch([
		'./devel/scripts/*.coffee',
		'./devel/scripts/*/*.coffee',
		'./devel/scripts/*.js',
		'./devel/scripts/*/*.js',
		], ['scripts']);
	});

gulp.task('css' , function() {
	return gulp.src([
		'./devel/bower_components/sweetalert/dist/sweetalert.css',
		])
	.pipe(concatCss("./public/css/plugins.css"))
	.pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest('./'));
});

gulp.task('sass', function () {
  return gulp.src('./devel/sass/style.scss')
  	.pipe(sourcemaps.init())
    .pipe(sass().on('error', 
    	function(e) {
    		gutil.log(e);
    		this.emit('end');
    	})
    )
    //.pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/css/'));
});

gulp.task('scripts', function() {
	return gulp.src([
		'./devel/bower_components/js-polyfills/polyfill.min.js',
		'./devel/bower_components/jquery/dist/jquery.min.js',
		'./devel/bower_components/bootstrap/dist/js/bootstrap.min.js',
        './devel/bower_components/sweetalert/dist/sweetalert.min.js',
        './devel/bower_components/d3/d3.min.js',
        './devel/scripts/app.js'
		])
	.pipe(concat('app.min.js'))
	//disable for devel 
	
	.pipe(sourcemaps.init())
	/*.pipe(uglify({mangle: false}).on('error', 
    	function(e) {
    		gutil.log(e);
    		this.emit('end');
    	}))*/
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest('./public/js/'))
});