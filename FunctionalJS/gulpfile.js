'use strict';

var gulp            = require('gulp'),
    connect = require('gulp-connect'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins         = gulpLoadPlugins(),
    webpack         = require('webpack'),
    ComponentPlugin = require("component-webpack-plugin"),
    info            = require('./package.json'),
    webpackCompiler;

var config = {

  JS: {
    src: ["src/js/**/*.js"],
    build: "build/js/",
    buildFiles: "build/js/*.js"
  },

  HTML:{
    src: ['pages/**/*.html'],
    build: "../",
    buildFiles: ["mapbox/**/*.html"]
  },

  SASS: {
    src: "src/sass/**/*.scss",
    build: "build/css/"
  },

}

// SERVER ---------------------------------------------------------------------
gulp.task('connect', function() {
  connect.server({
    // root: '../',
    port: 8000,
    livereload: false
  });
});


// SASS -----------------------------------------------------------------------
gulp.task('sass', function() {
  gulp.src( config.SASS.src )
    .pipe(plugins.plumber())
    .pipe(plugins.sass({
      outputStyle: 'compressed'
      }))
    .on("error", plugins.notify.onError())
    .on("error", function (err) {
      console.log("Error:", err);
    })
    .pipe( plugins.autoprefixer (
        "last 2 versions", "> 10%", "ie 9"
        ))
    .pipe( gulp.dest( config.SASS.build ) )
    .pipe( plugins.livereload() );
});


// WEBPACK --------------------------------------------------------------------
gulp.task('webpack', function(callback) {
  webpackCompiler.run(function(err, stats) {
    if (err) {
      throw new plugins.util.PluginError('webpack', err);
    }
    plugins.util.log('webpack', stats.toString({
      colors: true,
    }));
    callback();
  });
});

var webpackConfig = {
  cache: true,
  debug: true,
  progress: true,
  colors: true,
  devtool: 'source-map',
  entry: {
    main: './src/js/main.js',
  },
  output: {
    path: config.JS.build ,
    filename: '[name].bundle.js',
    chunkFilename: '[id].chunk.js',
    publicPath: '/build/js/',
  },
  externals: {
    "L": 'mapbox.js'
  },
  module:{
    loaders: [
      { test: /\.json$/, loader: "json" },
      { test: /\.html$/, loader: "html" },
      { test: /\.css$/, loader: "css" }
    ]
  }

};

gulp.task('set-env-dev', function() {
  webpackConfig.plugins = [
    new webpack.BannerPlugin(info.name + '\n' + info.version + ':' + Date.now() + ' [development build]'),
    new ComponentPlugin()
  ];
  webpackCompiler = webpack( webpackConfig );
});

gulp.task('set-env-prod', function() {
  webpackConfig.debug = false;
  webpackConfig.devtool = "";
  webpackConfig.plugins = [
    new webpack.optimize.UglifyJsPlugin(),
    new ComponentPlugin()
  ];
  webpackCompiler = webpack( webpackConfig );
});


// BOWER ----------------------------------------------------------------------
gulp.task ('bower', function () {
  gulp.src ([
      './vendor/bower/owl.carousel/dist/owl.carousel.js'
    ])
    .pipe( plugins.concat("plugins.js") )
    .pipe( plugins.uglify() )
    .pipe( gulp.dest ( config.JS.build ) )
});


// JAVASCRIPT RELOADING -------------------------------------------------------
gulp.task('js', function () {
  gulp.src( config.JS.buildFiles )
    .pipe( plugins.changed ( config.JS.buildFiles ))
    .pipe( plugins.livereload() );
});






// HTML TEMPORARIO --------------------------------------------------------------
gulp.task('html', function () {
  gulp.src( config.HTML.buildFiles )
    .pipe( plugins.livereload() );
});


// ICONS ----------------------------------------------------------------------
gulp.task('icons', function(){
  gulp.src([ config.ICONS.src ])
    .pipe( plugins.iconfontCss({
      fontName: config.ICONS.fontname,
      path: './sass/app/components/icons/_icons-template.scss',
      targetPath: '../../../.src/sass/app/components/icons/_icons.scss',
      fontPath: './fonts/',
    }))
    .pipe( plugins.iconfont({
      fontName: config.ICONS.fontname,
      fixedWidth: true,
      appendCodepoints: false
    }))
    .pipe(gulp.dest( config.ICONS.build ));
});


// GLOBAL TASKS ---------------------------------------------------------------

gulp.task('watch', function () {
  gulp.watch( config.HTML.buildFiles , ['html'] );
  gulp.watch( config.JS.src , ["webpack"]);
  gulp.watch( config.JS.buildFiles , ["js"] );
  gulp.watch( config.SASS.src , ['sass']  );
});

gulp.task('default', ['prod'] );
gulp.task('dev', ['set-env-dev', 'connect', 'watch'] );
gulp.task('prod', ['set-env-prod', 'connect', 'watch'] );
