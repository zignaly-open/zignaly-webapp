const babelOptions = {
  presets: ["@babel/preset-typescript"],
};

module.exports = require("babel-jest").default.createTransformer(babelOptions);
