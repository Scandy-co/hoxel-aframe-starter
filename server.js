const path = require('path')

const webpack = require('webpack')
const middleware = require('webpack-dev-middleware')
const webpackConfig = require('./webpack.config')
const compiler = webpack(webpackConfig)

const express = require('express')
const app = express()
const http = require('http').Server(app)

const HOST = process.env.HOST || '0.0.0.0'
const PORT = process.env.PORT || 3000

/**
 * Setup the Express server
 */
// view engine setup
app.set('view engine', 'html')
app.use(express.static(path.join(__dirname, 'public')))

// configure express to use webpack middleware
app.use(middleware(compiler));

app.get('/', function(req, res) {
  // res.sendFile(`${__dirname}/index.html`);
  res.render('index.html')
})

http.listen(PORT, HOST, function() {
  console.log(`listening on http://${HOST}:${PORT}`)
})
