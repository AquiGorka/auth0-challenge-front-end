var path              = require('path');
var webpack           = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    './src/index.js'
  ],
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'index.js',
    publicPath: '/public/'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['react-hot','babel'],
      include: path.join(__dirname, 'src')
    }, {
      test: /\.styl$/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!autoprefixer-loader!stylus-loader')
    }, {
      test: /\.woff$/,
      loader: 'file-loader?name=font/[name].[ext]?[hash]'
    }, {
      test: /\.png$/,
      loader: 'file-loader?name=images/[name].[ext]?[hash]'
    }, {
      test: /node_modules\/auth0-lock\/.*\.js$/,
      loaders: [
        'transform-loader/cacheable?brfs',
        'transform-loader/cacheable?packageify'
      ]
    }, {
      test: /node_modules\/auth0-lock\/.*\.ejs$/,
      loader: 'transform-loader/cacheable?ejsify'
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin( 'styles.css', {allChunks: false }),
    new HtmlWebpackPlugin({ template: 'public/index.html' })
  ]
};
