import gulp             from 'gulp';
import path             from 'path';
import webpack          from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import jade             from 'gulp-jade';
import stylus           from 'gulp-stylus';
import autoprefixer     from 'autoprefixer-stylus';

import productionConfig from './webpack.production.config';
import devServerConfig  from './webpack.dev-server.config';

gulp.task('serve', () => {
  new WebpackDevServer(webpack(devServerConfig), {
    publicPath: devServerConfig.output.publicPath,
    hot: true,
    historyApiFallback: true
  }).listen(devServerConfig.port, 'localhost', (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log('Listening at localhost:' + devServerConfig.port);
  });
});

gulp.task('build', ['template', 'styles'], done => {
  webpack(productionConfig).run((err, stats) => {
    if (err) {
      console.log('Error', err);
    } else {
      console.log(stats.toString());
    }
    if (done) done();
  });
});

gulp.task('template', function() {
  // Add locals for jade
  var DATA = {};

  gulp.src('./lib/*.jade')
    .pipe(jade({
      locals: DATA,
      pretty: true
    }))
    .pipe(gulp.dest('./dist'))
});

gulp.task('styles', function () {
  return gulp.src('lib/css/*.styl')
    .pipe(stylus({
      use: [autoprefixer('iOS >= 7', 'last 1 Chrome version')],
      url: {
        name: 'embedurl',
        paths: [__dirname + '/img'],
        limit: false
      }
    }))
    .pipe(gulp.dest('./dist'))
});