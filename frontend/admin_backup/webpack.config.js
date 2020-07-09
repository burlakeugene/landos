const path = require('path');
const autoprefixer = require('autoprefixer');
//config
const ROOT_DIR = __dirname;
const CLIENT_CONFIGS_DIR = path.resolve(ROOT_DIR, './config');

function getJSONConfig() {
  let commonConfig = require(CLIENT_CONFIGS_DIR + '/common.json');
  return commonConfig;
}

const JSON_CONFIG = getJSONConfig();

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(ROOT_DIR, '/dist'),
    publicPath: JSON_CONFIG.publicPath,
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js(x)?$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [autoprefixer()],
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: ['absolute/path/a', 'absolute/path/b']
            }
          }
        ]
      },
      {
        test: /\.(svg)$/,
        use: [
          {
            loader: 'url-loader',
            query: {
              name: '[name]-[hash].[ext]'
            }
          }
        ]
      },
      {
        test: /\.jpe?g$|\.ico$|\.gif$|\.pdf$|\.png$|\.woff$|\.ttf$|\.wav$|\.mp3$/,
        loader: 'file-loader',
        options: {
          outputPath: 'media',
          name: '[name].[ext]'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      components: ROOT_DIR + '/src/app/components',
      containers: ROOT_DIR + '/src/app/containers',
      pages: ROOT_DIR + '/src/app/pages',
      actions: ROOT_DIR + '/src/app/actions',
      modules: ROOT_DIR + '/src/app/modules',
      core: ROOT_DIR + '/src/app/core',
      config: ROOT_DIR + '/config//common.json',
      store: ROOT_DIR + '/src/app/redux/store'
    }
  }
};