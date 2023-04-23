const { resolve } = require("path");
const WebpackShellPluginNext = require("webpack-shell-plugin-next");
const Dotenv = require("dotenv-webpack");

const { NODE_ENV = "production" } = process.env;

module.exports = {
  entry: "./src/index.ts",
  target: "node",
  mode: NODE_ENV,
  watch: NODE_ENV === "development",
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new Dotenv(),
    new WebpackShellPluginNext({
      onBuildEnd: {
        scripts: ["nodemon ./build"],
        parallel: true,
      },
    }),
  ],
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "index.js",
    path: resolve(__dirname, "build"),
  },
};
