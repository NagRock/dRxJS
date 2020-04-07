const path = require('path');


const pageScriptVendorDeps = [
  'stacktrace-gps',
  'stacktrace-js',
  'stackframe',
  'error-stack-parser',
  'stack-generator',
  'tslib'
].map((dep) => `${path.sep}node_modules${path.sep}${dep}${path.sep}`);


module.exports = {
  entry: {
    'background': 'src/background/index.ts',
    'content-script': 'src/content-script/index.ts',
    'page-script': 'src/page-script/index.ts',
    'devtools': 'src/devtools/index.ts'
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        pageScriptVendor: {
          name: 'page-script-vendor',
          chunks: 'initial',
          enforce: true,
          priority: 1000,
          test(module) {
            return module.resource && pageScriptVendorDeps.find((dep) => module.resource.includes(dep));
          }
        }
      }
    }
  }
};
