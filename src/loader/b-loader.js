// module.exports = function(source) {
//   console.log('Loader b is excuted!');
//   return source;
// }


// const loaderUtils = require("loader-utils");

// module.exports = function(source) {
//   const { name } = loaderUtils.getOptions(this);
//   console.log(name);
//   return source;
// };

const loaderUtils = require('loader-utils');

module.exports = function (source) {
  const options = loaderUtils.getOptions(this);
  const callback = this.async();

  setTimeout(() => {
    const result = source.replace('world', options.name);
    callback(null, result);
  }, 1000);
}