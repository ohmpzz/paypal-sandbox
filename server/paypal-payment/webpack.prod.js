const path = require('path');
const webpack = require('webpack');

require('@babel/polyfill');

let plugins = [
  new webpack.EnvironmentPlugin([
    'PORT',
    'PAYPAL_MODE',
    'PAYPAL_CLIENT_ID',
    'PAYPAL_CLIENT_SECRET',
    'REDIRECT_URL',
  ]),
];

module.exports = {
  entry: ['@babel/polyfill', './server.js'],
  target: 'node',
  node: {
    __dirname: false,
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'index.js',
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  plugins,
  resolve: {
    alias: {
      joi: 'joi-browser',
    },
  },
};
