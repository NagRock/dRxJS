const WebpackExtensionReloader = require('webpack-extension-reloader');
const config = require('./custom-webpack.config');

module.exports = {...config,
  mode: 'development',
  plugins: [new WebpackExtensionReloader({
    reloadPage: true,
    entries: {
      'background': 'background',
      'content-script': 'content-script',
      'page-script': 'page-script',
      'devtools': 'devtools'
    }
  })]
};

