
// Dependencies
var gulp         = require('gulp');
var concat       = require('gulp-concat');
var streamqueue  = require('streamqueue');
var gutil        = require('gulp-util');
var uglify       = require('gulp-uglifyjs');
var compass      = require('gulp-compass');
var plumber      = require('gulp-plumber');
var notify       = require("gulp-notify");
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify   = require('browserify');
var babelify = require('babelify');
var vueify = require('vueify');
var webserver    = require('gulp-webserver');


// Server 
gulp.task('webserver', function() {
  gulp.src('./dev')
    .pipe(webserver({
      port : 8080,
      livereload: true,
      directoryListing: false,
      open: true,
      // path : '/dev'
    }));
});


// Compass compiler
gulp.task('compass', function() {
  gulp.src('./dev/sass/**/*.scss')
    .pipe(plumber(function (error) {
                gutil.log(error.message);
                this.emit('end');
            }))
    .pipe(compass({
      config_file: 'config.rb',
      css: './dev/assets/css',
      sass:'./dev/sass'
    }))
    .pipe(gulp.dest('./dev/assets/css'));
});

// Purify css
gulp.task('css-purify',function(){
 var content = ['./dev/*.html','./dev/assets/js/*.js'];
 var css = ['./dev/assets/css/styles.css'];
 var excludeClasses = [];
 var options = {
  // Will write purified CSS to this file.
  minify    : true,
  output    : './dev/assets/css/styles.min.css',
  whitelist : excludeClasses
  };
  purify(content, css, options);

});

// Gulp scripts

// Vue dependencies
var dependencies = [
  'vue',
  'vue-router'
];
var scriptsCount = 0;

gulp.task('fw-scripts', function () {
    bundleApp(false);
});

function bundleApp(isProduction) {
  scriptsCount++;
  // Browserify will bundle all our js files together in to one and will let
  // us use modules in the front end.
  var appBundler = browserify({
      entries: 'dev/app/app.js',
      debug: true
    })
 
  // If it's not for production, a separate vendors.js file will be created
  // the first time gulp is run so that we don't have to rebundle things like
  // react everytime there's a change in the js file
    if (!isProduction && scriptsCount === 1){
      // create vendors.js for dev environment.
      browserify({
      require: dependencies,
      debug: true
    })
      .bundle()
      .on('error', gutil.log)
      .pipe(source('vendors.js'))
      .pipe(buffer())
      .pipe(uglify('vendors.min.js'))
      .pipe(gulp.dest('./dev/assets/js/'));
    }
    if (!isProduction){
      // make the dependencies external so they dont get bundled by the 
    // app bundler. Dependencies are already bundled in vendor.js for
    // development environments.
      dependencies.forEach(function(dep){
        appBundler.external(dep);
      })
    }
 
    appBundler
      // transform .vue
      .transform(vueify)
      .bundle()
      .on('error',gutil.log)
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('./dev/assets/js/'));
}

gulp.task('scripts', function() {
   return streamqueue({ objectMode: true },
       //gulp.src('dev/lib/modernizr.custom.min.js'), 
       //gulp.src('dev/lib/jquery-2.1.1.min.js'),
       gulp.src('dev/lib/greensock/utils/SplitText.js'), 
       gulp.src('dev/lib/greensock/TweenMax.js'),
       gulp.src('dev/lib/greensock/plugins/DrawSVGPlugin.js'),   
       gulp.src('dev/lib/greensock/plugins/MorphSVGPlugin.js'),
       gulp.src('dev/lib/greensock/plugins/ScrollToPlugin.js'),
       gulp.src('dev/lib/scrollmagic/ScrollMagic.js'),
       gulp.src('dev/lib/scrollmagic/plugins/animation.gsap.js'),
       //gulp.src('dev/lib/bootstrap.js'),  
       //gulp.src('dev/lib/select2.min.js'),
       gulp.src('dev/lib/scripts.js')
   )
   .pipe(concat('bundle.js'))
   .pipe(uglify('main.min.js'))
   .pipe(gulp.dest('dev/assets/js/'));
});



// Live watch
gulp.task('watch', function(){
    gulp.watch('./dev/sass/**/*.scss', ['compass']);
    gulp.watch('./dev/lib/*.js', ['scripts']);
    gulp.watch(['./dev/app/**/*.js','./dev/app/**/*.vue'], ['fw-scripts']);
});

// Set defaults
gulp.task('default', ['webserver','fw-scripts','scripts','compass','watch']);