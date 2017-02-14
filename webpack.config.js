var rucksack = require('rucksack-css')
var cssvariables = require('postcss-css-variables')
var cssnesting = require('postcss-nested')
var cssimports = require('postcss-import')

var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var CopyPlugin = require('copy-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin');

var path = require('path')

var plugins = [
  new ExtractTextPlugin('[name].css'),
  new CopyPlugin([
    { from: 'src/images', to: 'images' }
  ]),
  new HtmlWebpackPlugin({
    filename: 'projects.html',
    template: 'src/projects.hbs',
  }),
];

var PROD = process.env.NODE_ENV === 'production';

if (PROD) {
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: { warnings: false },
    output: { comments: false },
  }))
}

module.exports = {
  entry: {
    app: [ './src/main.js' ]
  },

  output: {
    path: path.resolve(__dirname, PROD ? 'static' : 'src'),
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
      {
        test: /\.to?ml$/,
        loader: 'toml',
      },
      {
        test: /\.(handlebars|hbs)$/,
        loader: 'handlebars?helperDirs[]=' + path.resolve(__dirname, 'src/helpers'),
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

  plugins: plugins,

  devServer: {
    contentBase: 'src/'
  }
}
