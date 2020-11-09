const babelOptions = {
  presets: [
    [
      "@babel/preset-typescript",
      {
        isTSX: true,
        allExtensions: true,
      },
    ],
    "babel-preset-gatsby",
  ],
};

module.exports = require("babel-jest").createTransformer(babelOptions);
