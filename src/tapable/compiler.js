const {
  SyncHook, // 同步钩子
  SyncBailHook, // 同步熔断钩子
  SyncWaterfallHook, // 同步流水钩子
  SyncLoopHook, // 同步循环钩子
  AsyncParallelHook, // 异步并发钩子
  AsyncParallelBailHook, // 异步并发熔断钩子
  AsyncSeriesHook, // 异步串行钩子
  AsyncSeriesBailHook, // 异步串行熔断钩子
  AsyncSeriesWaterfallHook // 异步串行流水钩子
} = require("tapable");

module.exports = class Compiler {
  constructor() {
    this.hooks = {
      accelerate: new SyncHook(['newspeed']),
      brake: new SyncHook(),
      calculateRoutes: new AsyncSeriesHook(["source", "target", "routesList"])
    }
  }
  run(){
    this.accelerate(10)
    this.break()
    this.calculateRoutes('Async', 'hook', 'demo')
  }
  accelerate(speed) {
    this.hooks.accelerate.call(speed);
  }
  break() {
    this.hooks.brake.call();
  }
  calculateRoutes() {
      this.hooks.calculateRoutes.promise(...arguments).then(() => {
    }, err => {
      console.error(err);
    });
  }
}