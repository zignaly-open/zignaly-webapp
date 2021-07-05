const path = require("path");

module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  // webpackFinal: async (config, { configType }) => {
  //   // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
  //   // You can change the configuration based on that.
  //   // 'PRODUCTION' is used when building the static version of storybook.

  //   // Make whatever fine-grained changes you need
  //   // config.module.rules.push({
  //   //   test: /\.scss$/,
  //   //   use: ["style-loader", "css-loader", "sass-loader"],
  //   //   include: path.resolve(__dirname, "../"),
  //   // });

  //   config.module.rules.push({
  //     test: /\.scss$/,
  //     use: [
  //       "style-loader",
  //       "css-loader",
  //       "sass-loader",
  //       {
  //         loader: "sass-resources-loader",
  //         options: {
  //           //shared variable files must be defined here, but only variables. css output will be repeated for every file
  //           resources: [require.resolve("../src/styles/index.scss")],
  //         },
  //       },
  //       "postcss-loader",
  //     ],
  //     include: require.resolve("../"),
  //   });

  //   // Return the altered config
  //   return config;
  // },
  webpackFinal: async (config) => {
    // Transpile Gatsby module because Gatsby includes un-transpiled ES6 code.
    config.module.rules[0].exclude = [/node_modules\/(?!(gatsby)\/)/];
    // use installed babel-loader which is v8.0-beta (which is meant to work with @babel/core@7)
    config.module.rules[0].use[0].loader = require.resolve("babel-loader");
    // use @babel/preset-react for JSX and env (instead of staged presets)
    config.module.rules[0].use[0].options.presets = [
      require.resolve("@babel/preset-react"),
      require.resolve("@babel/preset-env"),
    ];
    config.module.rules[0].use[0].options.plugins = [
      // use @babel/plugin-proposal-class-properties for class arrow functions
      require.resolve("@babel/plugin-proposal-class-properties"),
      // use babel-plugin-remove-graphql-queries to remove static queries from components when rendering in storybook
      require.resolve("babel-plugin-remove-graphql-queries"),
    ];
    // Prefer Gatsby ES6 entrypoint (module) over commonjs (main) entrypoint
    config.resolve.mainFields = ["browser", "module", "main"];

    // Typescript
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      loader: require.resolve("babel-loader"),
      options: {
        presets: [["react-app", { flow: false, typescript: true }]],
        plugins: [
          require.resolve("@babel/plugin-proposal-class-properties"),
          // use babel-plugin-remove-graphql-queries to remove static queries from components when rendering in storybook
          require.resolve("babel-plugin-remove-graphql-queries"),
        ],
      },
    });

    // config.module.rules.push({
    //   test: /\.scss$/,
    //   use: ["style-loader", "css-loader", "sass-loader"],
    //   include: path.resolve(__dirname, "../"),
    // });

    config.module.rules.push({
      test: /\.scss$/,
      use: [
        "style-loader",
        "css-loader",
        "sass-loader",
        {
          loader: "sass-resources-loader",
          options: {
            //shared variable files must be defined here, but only variables. css output will be repeated for every file
            resources: [require.resolve("../src/styles/index.scss")],
          },
        },
      ],
      include: path.resolve(__dirname, "../"),
    });
    return config;
  },
  core: {
    builder: "webpack5",
  },
};
