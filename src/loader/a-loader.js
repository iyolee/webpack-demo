// const loaderUtils = require('loader-utils');

module.exports = function (source) {
  console.log('Loader a is excuted!');
  return source;

  // this.callback(null, source);
  // return;

  // const url = loaderUtils.interpolateName(this, "[hash].[ext]", {
  //   source,
  // });
  // this.emitFile(url, source);
  // const path = `__webpack_public_path__ + ${JSON.stringify(url)};`;
  // return `export default ${path}`;
}