import gulp             from 'gulp';
import path             from 'path';
import webpack          from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import jade             from 'gulp-jade';
import stylus           from 'gulp-stylus';
import autoprefixer     from 'autoprefixer-stylus';

import webpackConfig  from './webpack.config.js';

gulp.task('template', () => {
  // Add locals for jade
  var DATA = {};
  gulp.src('./lib/*.jade')
    .pipe(jade({
      locals: DATA,
      pretty: true
    }))
    .pipe(gulp.dest('./public'))
});

gulp.task('styles', () => {
  return gulp.src('lib/css/*.styl')
    .pipe(stylus({
      url: {
        name: 'embedurl',
        paths: [__dirname + '/img'],
        limit: false
      }
    }))
    .pipe(gulp.dest('./public'))
});

gulp.task('webpack', done => {
  webpack(webpackConfig).run((err, stats) => {
    if (err) {
      console.log('Error', err);
    } else {
      console.log(stats.toString());
    }
    if (done) done();
  });
});

gulp.task('server', () => {
  new WebpackDevServer(webpack(webpackConfig), {
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    historyApiFallback: true
  }).listen(8080, 'localhost', (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log('Listening at http://localhost:8080');
  });
});

gulp.task('dev', ['template', 'styles', 'webpack', 'server'], done => {
  if (done) done();
});

gulp.task('default', function() {
    gulp.start('dev');
});
