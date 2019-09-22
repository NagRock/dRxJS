const path = require('path');
const webpack = require("webpack");
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const MergeJsonWebpackPlugin = require("merge-jsons-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');
const AngularCompilerPlugin = require('@ngtools/webpack').AngularCompilerPlugin;

// Environment config
const buildConfig = require('./build.config');

console.log('BUILD NAME:', buildConfig.targetBuildName);

module.exports = env => {

  return {
    entry: {
      'browser-polyfill.min': path.join(__dirname, '../../node_modules/webextension-polyfill/dist/browser-polyfill.min.js'),
      'devtools/devtools': path.join(__dirname, '../src/devtools/devtools.ts'),

      'devtools/panel/panel': [
        path.join(__dirname, '../src/devtools/panel/vendor'),
        path.join(__dirname, '../src/devtools/panel/panel.module'),
      ],
      background: [
        path.join(__dirname, '../src/background')
      ],
      'content-script': [
        path.join(__dirname, '../src/content-script')
      ],
      'page-scripts': [
        path.join(__dirname, '../src/page-scripts')
      ],
    },
    output: {
      path: path.join(buildConfig.DIST_DIR, './'),
      filename: '[name].js'
    },
    optimization: {
      splitChunks: {
        name: 'vendor',
        chunks: "initial"
      }
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            'ts-loader',
            'angular2-template-loader',
          ],
          exclude: /node_modules/
        },

        {
          test: /\.css$/,
          use: [
            'to-string-loader',
            'css-loader'
          ],
        },
        {
          test: /\.html$/,
          use: 'raw-loader',
        },
      ]
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js']
    },
    plugins: [
      new webpack.ProgressPlugin(),
      new CleanWebpackPlugin(),
      new AngularCompilerPlugin({
        tsConfigPath: './web-extension/tsconfig.json',
        entryModule: './web-extension/src/devtools/panel/panel.module#PanelModule',
        sourceMap: true,
      }),
      new CopyPlugin([{
        from: './web-extension/src',
        to: buildConfig.DIST_DIR,
        ignore: [
          '*.ts'
        ],
      }], {
        copyUnmodified: true
      }),

      new MergeJsonWebpackPlugin({
        files: buildConfig.manifestFiles(env.mode === 'dev'),
        output: {
          fileName: './manifest.json',
        },
      }),
    ]
  }
};
