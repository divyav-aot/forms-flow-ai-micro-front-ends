const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-ts");

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "formsflow",
    projectName: "services",
    webpackConfigEnv,
    argv,
  });

  return merge(defaultConfig, {
    devServer: {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      port: 3007
    },
    output:{
      filename:"forms-flow-service.js"
    },
    module: {
      rules: [
        {
          test: /\.scss$/,  // Match .scss files
          use: [
            "style-loader",  // Injects styles into the DOM
            "css-loader",    // Resolves CSS imports and URLs
            "sass-loader",   // Compiles SCSS to CSS
          ],
        },
      ],
    }
  });
};
