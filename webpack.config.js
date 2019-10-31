const path = require('path');

module.exports = {
  mode: "development",
  entry: path.join(__dirname, 'src/loader/index.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js'
  },
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
      }
    ]
  }
}