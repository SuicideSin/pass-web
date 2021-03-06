
/*eslint filenames/match-exported: off*/

const path = require("path")
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")

const getPath = (fullPath) => {
  const args = fullPath.split("/")
  args.unshift(__dirname)
  return path.resolve(...args)
}

const svgoConfig = {}

const config = {
  context: getPath("public"),
  entry: [ "./main" ],
  output: {
    path: getPath("dist"),
    filename: "main.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      template: getPath("public/index.ejs"),
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || ""),
      },
      "__DEV__": process.env.NODE_ENV !== "production",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude(path) {
          return path.includes("/node_modules/") || path.includes("/sans-sel/")
        },
        loader: "babel-loader",
      },
      {
        test: /\.svg$/,
        loaders: [
          "file-loader?name=[path][name].[ext]?[hash]",
          `svgo-loader?${JSON.stringify(svgoConfig)}`,
        ],
      },
      {
        test: /\.png$/,
        loader: "file-loader?name=[path][name].[ext]?[hash]",
      },
    ],
  },
}

module.exports = config
