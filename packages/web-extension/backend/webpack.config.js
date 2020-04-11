const path = require('path');


function getConfig(name) {
  return {
    mode: 'development',
    context: path.resolve(__dirname, 'src'),
    entry: {
      entry: path.resolve(__dirname, 'src', name, 'index.ts'),
    },
    output: {
      filename: `${name}.js`,
      path: path.resolve(__dirname, '..', 'dist', 'web-extension'),
      library: '__doctor_rxjs__',
      libraryTarget: 'window'
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "ts-loader",
          options: {
            configFile: path.resolve(__dirname, 'tsconfig.lib.json')
          }
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.js', '.json']
    }
  };
}

module.exports = [
  getConfig('page-script'),
  getConfig('content-script')
];
