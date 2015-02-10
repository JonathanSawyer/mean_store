var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var protractor = require('gulp-protractor').protractor;
var karma = require('gulp-karma');
var gulpif = require("gulp-if");
var notify = require('gulp-notify');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var ngAnnotate = require('gulp-ng-annotate');
var sass = require('gulp-sass');
var minifyHtml = require('gulp-minify-html');
var livereload = require('gulp-livereload');
var argv = require('yargs').argv;
var changed = require('gulp-changed');
var preprocess = require('gulp-preprocess');

var src = {
	mocha : {
		src: ['lib/tests/unit/server/**/*.js'],
	 	watch: [
		'gulpfile.js',
		'index.js',
		'lib/**/*.js',
		'!lib/{dist,dist/**}',
		'!lib/{public,public/**}',
		'!lib/tests/{e2e,e2e/**}',
		'!lib/tests/unit/{client,client/**}'
		]},
	karma : [
	'lib/dist/js/vendor.js',
	'bower_components/angular-mocks/angular-mocks.js',
	'node_modules/jasmine-sinon/lib/jasmine-sinon.js',
	'lib/dist/js/scripts.js',
	'lib/tests/unit/client/**/*.js'
	],
	e2e : [
	'lib/tests/e2e/setup.js',
	"lib/tests/e2e/**/*Spec.js"
	],
	jshint : [
	'gulpfile.js',
	'index.js',
	'lib/**/*.js',
	'!lib/dist/**'
	],
	client : {
		css : ['lib/public/css/**/*.scss'],
		js : ['lib/public/js/**/*.js'],
		html : {
			index : ['lib/public/index.html'],
			partials : ['lib/public/partials/**/*.html']
		},
		fonts : ['bower_components/bootstrap/dist/fonts/**']
	},
	vendor : {
		js : [
		"bower_components/jquery/dist/jquery.js",
		"bower_components/bootstrap/dist/js/bootstrap.js",
		"bower_components/angular/angular.js",
		"bower_components/angular-route/angular-route.js",
		"bower_components/ngstorage/ngStorage.js",
		"bower_components/angular-bootstrap/ui-bootstrap-tpls.js"
		],
		css : [
		"bower_components/bootstrap/dist/css/bootstrap.css",
		"bower_components/bootstrap/dist/css/bootstrap-theme.css"
		],
		cssMaps : [
		"bower_components/bootstrap/dist/css/bootstrap.css.map",
		"bower_components/bootstrap/dist/css/bootstrap-theme.css.map"
		]
	}
};

function isMinifying(){
	return argv.m || process.env.NODE_ENV === 'production';
}

gulp.task("default", ["jshint", "test"]);

gulp.task("test", ["server-test", "client-test", "e2e-test"]);

gulp.task('vendor-js', function(){
	return gulp.src(src.vendor.js)
		.pipe(gulpif(isMinifying(), uglify()))
		.pipe(concat('vendor.js'))
		.pipe(gulp.dest('lib/dist/js'))
		.pipe(livereload());
});

gulp.task('vendor-css', function(){
	return gulp.src(src.vendor.css)
		.pipe(concat('vendor.css'))
		.pipe(gulpif(isMinifying(), minifyCSS()))
		.pipe(gulp.dest('lib/dist/css'))
		.pipe(livereload());
});

gulp.task('vendor-css-maps', function(){
	return gulp.src(src.vendor.cssMaps)
		.pipe(changed('lib/dist/css'))
		.pipe(gulp.dest('lib/dist/css'));
});

gulp.task('scripts', function(){
	return gulp.src(src.client.js)
		.pipe(ngAnnotate())
		.pipe(concat('scripts.js'))
		.pipe(gulpif(isMinifying(), uglify()))
		.pipe(gulp.dest('lib/dist/js'))
		.pipe(livereload());
});

gulp.task('styles', function(){
	return gulp.src(src.client.css)
		.pipe(sass())
		.pipe(concat('styles.css'))
		.pipe(gulpif(isMinifying(), minifyCSS()))
		.pipe(gulp.dest('lib/dist/css'))
		.pipe(livereload());
});

gulp.task('html-index', function(){
	return gulp.src(src.client.html.index)
		.pipe(changed('lib/dist'))
		.pipe(preprocess({context: { NODE_ENV: process.env.NODE_ENV || 'development'}}))
		.pipe(gulpif(isMinifying(), minifyHtml()))
		.pipe(gulp.dest('lib/dist'))
		.pipe(livereload());
});

gulp.task('html-partials', function(){
	return gulp.src(src.client.html.partials, {base : './lib/public/partials'})
		.pipe(changed('lib/dist/partials'))
		.pipe(gulpif(isMinifying(), minifyHtml()))
		.pipe(gulp.dest('lib/dist/partials'))
		.pipe(livereload());
});

gulp.task('fonts', function(){
	return gulp.src(src.client.fonts)
		.pipe(changed('lib/dist/fonts'))
		.pipe(gulp.dest('lib/dist/fonts'))
		.pipe(livereload());
});

gulp.task('clean', function(){
	return gulp.src('lib/dist', {read:false})
		.pipe(clean());
});

gulp.task('auto-deploy', function(){
	livereload.listen();
	gulp.watch(src.client.html.index, ["html-index"]);
	gulp.watch(src.client.html.partials, ["html-partials"]);
	gulp.watch(src.client.js, ["scripts"]);
	gulp.watch(src.client.css, ["styles"]);
	gulp.watch(src.client.fonts, ["fonts"]);
	gulp.watch(src.vendor.css, ["vendor-css"]);
	gulp.watch(src.vendor.js, ["vendor-js"]);
	gulp.watch(src.vendor.cssMaps, ["vendor-css-maps"]);
});

gulp.task('auto', ['auto-deploy', 'auto-test', 'jshint-w']);

gulp.task('deploy', ["vendor-js", "vendor-css", "vendor-css-maps", "scripts", "styles", "html-index", "html-partials", "fonts"]);

gulp.task("server-test", function(){
	return gulp.src(src.mocha.src, {read: false})
		.pipe(mocha({
			reporter: 'spec'
		}))
		.on("error", notify.onError({
			message: 'Server unit test: <%= error.message %>',
			sound: false // deactivate sound?
		}));
});

gulp.task("client-test", function(){
	return gulp.src(src.karma)
		.pipe(karma({
			configFile: 'karma.conf.js',
			action: 'run'
		}));
});

gulp.task("client-test-w", function(){
	return gulp.src(src.karma)
		.pipe(karma({
			configFile: 'karma.conf.js',
			action: 'watch'
		}));
});

gulp.task('auto-test', function(){
	gulp.watch(src.karma, ["client-test"]);

	gulp.watch(src.mocha.watch, ["server-test"]);
});

gulp.task("jshint", function(){
	return gulp.src(src.jshint)
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(notify(function (file) {
	      if (file.jshint.success) {
	        // Don't show something if success
	        return false;
	      }

	      var errors = file.jshint.results.map(function (data) {
	        if (data.error) {
	          return "(" + data.error.line + ':' + data.error.character + ') ' + data.error.reason;
	        }
	      }).join("\n");
	      return file.relative + " (" + file.jshint.results.length + " errors)\n" + errors;
	    }));
});

gulp.task("jshint-w", function(){
	gulp.watch(src.jshint, ["jshint"]);
});

gulp.task('e2e-test', ["deploy"], function(){
	process.env.E2E_BROWSER = argv.browser || 'chrome';
	process.env.NODE_ENV = "test";
	return gulp.src(src.e2e)
			.pipe(protractor({
				configFile : 'lib/tests/e2e/conf.js',
				args: ['--baseUrl', 'http://localhost:8082'],
				debug: false
			}))
			.on('error', function(e) { throw e; });
});