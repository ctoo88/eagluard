const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const webpackConfig = require("./dev");
const compiler = webpack(webpackConfig);
const server = express();

server.use(webpackDevMiddleware(compiler, {
  publicPath: '/',
}));

server.listen(8818, () => {
  console.log('server 8818');
});
