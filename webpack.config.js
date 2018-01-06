const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: {
    app: './src/js/app.js',
    client:'./src/js/client.js',
    myCommon:'./src/js/myCommon.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'static/js'),
  },
  plugins: [
    new CleanWebpackPlugin(['static/js']),
  ],
};
