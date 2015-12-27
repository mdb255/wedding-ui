'use strict';

var gulp = require('gulp');
var replace = require('gulp-replace-task');  
var args = require('yargs').argv;
var fs = require('fs');

var gutil = require('gulp-util');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var rimraf = require('rimraf');

/** Build Config **/

gulp.task('replace', function () {  
  // Get the environment from the command line
  var env = args.env || 'dev';

  // Read the settings from the right file
  var filename = env + '.json';
  var settings = JSON.parse(fs.readFileSync('./config/' + filename, 'utf8'));

// Replace each placeholder with the correct value for the variable.  
gulp.src('./config/build-tpl/config.js')
  .pipe(replace({
    patterns: [
      { match: 'apiUrl', replacement: settings.apiUrl },
      { match: 'webRootPath', replacement: settings.webRootPath }
    ]
  }))
  .pipe(gulp.dest('./wedding-app/config'));
});


/******* Build JS ********/

var outputPath = {
  'javascript': './resources/bundles/js'
};

/** Build Libs **/

var inputPathsLibs = {
  javascript: [
    /** HTML5 Boilerplate **/
    './bower_components/html5-boilerplate/js/vendor/modernizr-2.6.2.min.js',
    /** jQuery **/
    './bower_components/jquery/dist/jquery.js',
    /** Utilities **/
    './bower_components/underscore/underscore.js',
    /** Misc **/
    './lib/**/*.js',
    /** Bootstrap Core **/
    './bower_components/bootstrap/dist/js/bootstrap.js',
    /** Angular **/
    './bower_components/angular/angular.js',
    './bower_components/angular-animate/angular-animate.js',
    './bower_components/angular-bootstrap/ui-bootstrap.js',
    './bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
    './bower_components/angular-local-storage/dist/angular-local-storage.js',
    './bower_components/angular-route/angular-route.js'
  ]
};

var miniJsFileNameLibs = 'libs-bundle.min.js';

gulp.task('build-js-libs', ['clean-libs'], function() {
  return gulp.src(inputPathsLibs.javascript)
    .pipe(sourcemaps.init())
    .pipe(concat(miniJsFileNameLibs))
    .pipe(uglify())
    //.pipe(sourcemaps.write()) // Source Maps for libs will dramatically increase file size
    .pipe(gulp.dest(outputPath.javascript));
});

gulp.task("clean-libs", function (cb) {
  rimraf(outputPath.javascript + '/' + miniJsFileNameLibs, cb);
});


/** Build App **/

var inputPathsApp = {
  javascript: [
    './wedding-app/app.js',
    './wedding-app/config/build/js/config.js',
    './scripts/**/*.js',
    '!./scripts/**/*.spec.js',
    './wedding-app/**/*.js',
    '!./wedding-app/**/*.spec.js'
  ]
};

var miniJsFileNameApp = 'app-bundle.min.js';

gulp.task('build-js-app', ['clean-app'], function() {
  return gulp.src(inputPathsApp.javascript)
    .pipe(sourcemaps.init())
    .pipe(concat(miniJsFileNameApp))
    // Enable uglify to minify for production
    //.pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(outputPath.javascript));
});

gulp.task("clean-app", function (cb) {
  rimraf(outputPath.javascript + '/' + miniJsFileNameApp, cb);
});

gulp.task('watch-build', function() {
  gulp.watch(inputPathsApp.javascript, ['build-js-app']);
});