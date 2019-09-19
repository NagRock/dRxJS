const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = env => {
  const config = merge(common(env), {
    mode: 'development',
    devtool: 'source-map',
    optimization: {
      minimize: false,
    },
  });

  return config;
};
