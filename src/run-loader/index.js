const fs = require('fs');
const path = require('path');
const { runLoaders } = require('loader-runner');

runLoaders({
  resource: path.resolve(__dirname, 'demo.txt'),
  loaders: [path.resolve(__dirname, 'raw-loader.js')],
  readResource: fs.readFile.bind(fs),
}, (err, result) => (
  err ? console.error(err) : console.log(result)
));