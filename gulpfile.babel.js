import gulp             from 'gulp';
import path             from 'path';
import webpack          from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

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
