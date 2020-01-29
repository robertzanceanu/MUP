let webpackMerge = require("webpack-merge")

let HTMLWebpackPlugin = require("html-webpack-plugin")
let CopyWebpackPlugin = require("copy-webpack-plugin")
let ImageminWebpWebpackPlugin = require("imagemin-webp-webpack-plugin")
let path = require('path')

module.exports = ({ mode }) => {
  return webpackMerge(
    {
      entry: ["./src/app.js"],
      devServer: {
        historyApiFallback: true,
        host: '0.0.0.0',
        useLocalIp: true
      },
      output: {
        path: path.resolve(__dirname, '..', 'dist'),
        publicPath: '/',
        filename: '[name].[hash].js',

      },
      plugins: [
        new CopyWebpackPlugin([
          {
            from: "./src/assets",
            to: "assets/"
          }
        ]),
        new HTMLWebpackPlugin({
          template: "index.html",
          minify: {
            removeComments: true,
            collapseWhitespace: true
          }
        }),
        new ImageminWebpWebpackPlugin()
      ],
    },

    require(`./build-utils/webpack.${mode}`)
  );
};
