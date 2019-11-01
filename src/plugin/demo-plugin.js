module.exports = class DemoPlugin {
  constructor(options) {
    this.options = options;
  }
  // apply(compiler) {
  //   compiler.hooks.done.tap(' My Plugin', (
  //     stats /* stats is passed as argument when done hook is tapped. */
  //   ) => {
  //   console.log('Hello World!');
  //   });
  // }

  apply() {
    console.log('plugin', this.options);
  }
};