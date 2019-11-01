const path = require('path');

const DemoPlugin = require('./src/plugin/demo-plugin.js');

const ZipPlugin = require('./src/plugin/zip-plugin');

module.exports = {
  mode: "development",
  entry: path.join(__dirname, 'src/loader/index.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js'
  },
  plugins: [
    new DemoPlugin({ name: 'Ops' }),
    new ZipPlugin({ filename: 'dist' })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          path.resolve('./src/loader/a-loader.js'),
          {
            loader: path.resolve('./src/loader/b-loader.js'),
            options: {
              name: 'loader b'
            }
          }
        ]
      },
    ]
  },
}