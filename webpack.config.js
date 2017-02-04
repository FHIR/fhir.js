var webpack = require("webpack");
var path = require("path");

module.exports = {
  entry: {
    fhir: ["./src/fhir.js"],
    ngFhir: "./src/adapters/angularjs.js",
    jqFhir: "./src/adapters/jquery.js",
    yuifhir: "./src/adapters/yui.js",
    nativeFhir: "./src/adapters/native.js"
  },
  node: {
    buffer: "mock"
  },
  module: {
    loaders: [{ test: /\.coffee$/, loader: "coffee-loader" }]
  },
  externals: {"jquery": "jQuery"},
  resolve: {
    extensions: ["", ".webpack.js", ".web.js", ".js", ".coffee", ".less"]
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
    library: "fhir",
    libraryTarget: "umd"
  }
};
