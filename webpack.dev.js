const { merge } = require("webpack-merge");
const path = require("path");
const common = require("./webpack.common.js"); // 汎用設定をインポート

// common設定とマージする
module.exports = merge(common, {
  mode: "development", // 開発モード
  devtool: "inline-source-map", // 開発用ソースマップ
  devServer: {
    // webpack-dev-serverの設定
    contentBase: path.join(__dirname, "docs"),
  },
});
