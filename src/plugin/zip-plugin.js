const path = require('path');
// // 文件压缩为 zip 包
const JSZip = require('jszip');
// 文件写入需要使用 webpack-sources
const RawSource = require('webpack-sources').RawSource;
const zip = new JSZip();

module.exports = class ZipPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('ZipPlugin', (compilation, callback) => {
      const folder = zip.folder(this.options.filename);

      for (let filename in compilation.assets) {
        const source = compilation.assets[filename].source();
        folder.file(filename, source);
      }

      zip.generateAsync({
        type: 'nodebuffer'
      }).then((content) => {
        const outputPath = path.join(
          compilation.options.output.path, 
          this.options.filename + '.zip'
        );

        const outputRelativePath = path.relative(
          compilation.options.output.path,
          outputPath
        );
        // compilation 上的 assets 可以用于文件写入
        compilation.assets[outputRelativePath] = new RawSource(content);

        callback();
      });
    });
  }
}