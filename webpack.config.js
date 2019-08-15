var MinifyPlugin = require('babel-minify-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
var fs = require('fs')
var ip = require('ip')
var path = require('path')
var webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')

const PORT = process.env.PORT || 3001

PLUGINS = [
  new webpack.EnvironmentPlugin(['NODE_ENV']),
  // Hot swap please!
  new webpack.HotModuleReplacementPlugin(),

  // // Serves the html
  new CopyWebpackPlugin([
    {
      //Note:- No wildcard is specified hence will copy all files and folders
      from: 'assets', //Will resolve to RepoDir/src/assets
      to: 'assets' //Copies all files from above dest to dist/assets
    },
    {
      from: 'public', //Will resolve to RepoDir/src/assets
      to: '' //Copies all files from above dest to dist/assets
    },
    {
      from: '*.html',
      to: ''
    }
  ]),

  // Define env variables
  new webpack.DefinePlugin({
    'process.env.HOXEL_ASSET_URL':
      JSON.stringify(process.env.HOXEL_ASSET_URL) ||
      `http://localhost:${PORT}/streamed`
  }),

  // Handle the WebWorker loading
  new webpack.LoaderOptionsPlugin({
    options: {
      worker: {
        output: {
          filename: 'hash.worker.js',
          chunkFilename: '[id].hash.worker.js',
          globalObject: 'this'
        }
      }
    }
  })
]

module.exports = {
  devServer: {
    disableHostCheck: true,
    hotOnly: true
  },
  entry: {
    build: './src/index.js'
  },
  output: {
    path: `${__dirname}/build`,
    filename: '[name].js',
    globalObject: 'this'
  },
  mode: process.env.NODE_ENV || 'development',
  // watch: true,
  // watchOptions: {
  //   ignored: ['node_modules', 'dist', 'public'],
  // },
  node: {
    fs: 'empty' // fixes bug with Draco making reference to fs from node
  },
  plugins: PLUGINS,
  module: {
    rules: [
      {
        test: /\.js/,
        exclude: /(node_modules)/,
        use: ['babel-loader', 'aframe-super-hot-loader']
      },
      {
        test: /\.html/,
        exclude: /(node_modules)/,
        use: [
          'aframe-super-hot-html-loader',
          {
            loader: 'super-nunjucks-loader',
            options: {
              globals: {
                HOST: ip.address(),
                IS_PRODUCTION: process.env.NODE_ENV === 'production'
              },
              path: process.env.NUNJUCKS_PATH || path.join(__dirname, 'src')
            }
          },
          {
            loader: 'html-require-loader',
            options: {
              root: path.resolve(__dirname, 'src')
            }
          }
        ]
      },
      {
        test: /\.glsl/,
        exclude: /(node_modules)/,
        loader: 'webpack-glsl-loader'
      },
      {
        test: /\.css$/,
        exclude: /(node_modules)/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.png|\.jpg/,
        exclude: /(node_modules)/,
        use: ['url-loader']
      },
      {
        // Handle the Draco web assembly code
        test: /\.(wasmbin)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 340000
            }
          }
        ]
      }
    ]
  }
}
