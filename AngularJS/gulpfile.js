'use strict';

var gulp            = require('gulp'),
    connect         = require('gulp-connect'),
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
    // src: ['pages/**/*.hbs']
    build: "./pages/**/*.html"
  },

  SASS: {
    src: "src/sass/**/*.scss",
    build: "build/css/"
  }

}

// SERVER ---------------------------------------------------------------------
gulp.task('connect', function() {
  connect.server({
    // root: './pages/'
    // port: 8000,
    // livereload: false
  });
});
// gulp.task('webserver', function() {
//   gulp.src('app')
//     .pipe( plugins.webserver({
//       livereload: true
//     }));
// });


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
        "last 1 versions", "> 10%", "ie 9"
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
  module:{
    loaders: [
      { test: /\.html$/, loader: "html" },
      { test: /\.css$/, loader: "css" }
    ]
  },
  externals: {
    // require("jquery") is external and available
    //  on the global var jQuery
    "jquery": "jQuery"
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


// JAVASCRIPT RELOADING -------------------------------------------------------
gulp.task('js', function () {
  gulp.src( config.JS.buildFiles )
    .pipe( plugins.changed ( config.JS.buildFiles ))
    .pipe( plugins.livereload() );
});




// HTML TEMPORARIO --------------------------------------------------------------
gulp.task('html', function () {
  gulp.src( config.HTML.build )
    .pipe( plugins.livereload() );
});



// GLOBAL TASKS ---------------------------------------------------------------

gulp.task('watch', function () {
  gulp.watch( config.HTML.build , ['html'] );
  gulp.watch( config.JS.src , ["webpack"]);
  gulp.watch( config.JS.buildFiles , ["js"] );
  gulp.watch( config.SASS.src , ['sass']  );
});

gulp.task('default', ['prod'] );
gulp.task('dev', ['set-env-dev', 'connect', 'watch'] );
gulp.task('prod', ['set-env-prod', 'connect', 'watch'] );

gulp.task('shipit', ['set-env-prod', 'webpack'] );
