var rucksack = require('rucksack-css')
var cssvariables = require('postcss-css-variables')
var cssnesting = require('postcss-nested')
var cssimports = require('postcss-import')

var webpack = require('webpack')
var ExtractTextPlugin = require("extract-text-webpack-plugin")

var path = require('path')

module.exports = {
  entry: {
    app: [ './src/main.js' ]
  },

  output: {
    path: path.resolve(__dirname, 'static'),
    filename: 'bundle.js',
    chunkFilename: '[id].js'
  },

  module: {
    loaders: [
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]'
      },
      {
        test: /\.css$/,
        include: /styles/,
        loader: ExtractTextPlugin.extract('style', [ 'css', 'postcss' ]),
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: [ 'es2015' ]
        }
      },
    ],
  },

  postcss: function(wp) {
    return [
      cssimports({
        addDependencyTo: wp
      }),
      cssvariables(),
      cssnesting(),
      rucksack({
        autoprefixer: true
      })
    ];
  },

  plugins: [
    new ExtractTextPlugin('[name].css')
  ],

  devServer: {
    contentBase: 'src/'
  }
}