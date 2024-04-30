const path = require("path")
const nodeExternals = require("webpack-node-externals")

module.exports = {
	entry: {
		main: path.join(__dirname, "node_mml", "bundle_main.js"),
	},
	output: {
		path: path.join(__dirname, "docs", "js"),
		filename: "node_mml_bundle.js",
		library: "node_mml",
		libraryTarget: "umd",
		globalObject: "this",
	},
	externals: [nodeExternals()],
}
