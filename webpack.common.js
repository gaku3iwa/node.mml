const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: {
    main: path.join(__dirname, "src", "mml_bundle_main.js"),
  },
  output: {
    path: path.join(__dirname, "docs", "js"),
    filename: "mml_bundle.js",
    library: "mml",
    libraryTarget: "umd",
    globalObject: "this",
  },
  externals: [nodeExternals()],
};
