const webpack = require("webpack");
const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");

const src = path.resolve(__dirname, "client/src");
module.exports = {
  entry: {
    client: "./client/index.jsx"
  },
  output: {
    path: path.resolve(__dirname, "./public"),
    filename: "bundle.js",
    globalObject: "this"
  },
  mode: process.env.NODE_ENV || "development",
  // mode: 'production',
  node: {
    fs: "empty"
  },
  watchOptions: {
    ignored: /node_modules|dist|\.js/g
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.(wasmbin)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 340000
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebPackPlugin({
      template: "./server/index.html",
      filename: "./index.html"
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        worker: {
          output: {
            // filename: "hash.worker.js",
            // chunkFilename: "[id].hash.worker.js",
            globalObject: "this"
          }
        }
      }
    })
  ]
};
