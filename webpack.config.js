const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'static/js/[name].[contenthash].js',
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
    clean: true,
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        exclude: /\.module\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              outputPath: 'images/',
              publicPath: 'images/',
            },
          },
        ],
      },
      {
        test: /\.module\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
        ],
      },
      {
        test: /\.module\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
          'sass-loader',
        ],
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'build/favicon.ico', to: 'favicon.ico' },  // Ajuste o caminho conforme necessário
        { from: 'build/robots.txt', to: 'robots.txt' }     // Ajuste o caminho conforme necessário
      ]
    }),
    new WebpackManifestPlugin({
      fileName: 'asset-manifest.json',
      publicPath: 'static/'
    }),
    new HtmlWebpackPlugin({
        template: 'build/index.html', // Ajuste o caminho conforme necessário
        filename: 'index.html'
      })
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.scss']
  }
};
