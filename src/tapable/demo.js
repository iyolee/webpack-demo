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

const hook1 = new SyncHook(["arg1", "arg2", "arg3"]);
// 绑定事件到webapck事件流
hook1.tap('hook1', (arg1, arg2, arg3) => console.log(arg1, arg2, arg3)) // 1,2,3
// 执行绑定的事件
hook1.call(1,2,3)