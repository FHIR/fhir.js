var webpack = require("webpack");
var path = require("path");

module.exports = {
  entry: "./main.js",
  resolve: {
    extensions: ["", ".js"]
  },
  output: {
    path: __dirname,
    filename: "dist.js"
  }
};
