const dev = require("./dev");

const merge = require("webpack-merge");
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(dev, {
  mode: "production",
  devtool: false,
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false
          }
        }
      })
    ]
  }
});
