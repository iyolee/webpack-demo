# Webpack Plugin

### 目标
- 了解 Webpack Plugin 的作用和原理
- 独立开发需要的 Plugin

### 定义
> A plugin is able to hook into key events that are fired throughout each compilation. Every step of the way, the plugin will have full access to the compiler and, when applicable, the current compilation.

plugin 能够 hook 到在每个编译中触发的所有关键事件。在编译的每一步，plugin 都具备完全访问 compiler 对象的能力，如果情况合适，还可以访问当前 compilation 对象。

### plugin VS loader
- loader 单纯用于转换某些类型的模块，plugin 可以用于执行范围更广的任务
- loader 的作用的过程有限，plugin 作用于整个构建过程。

### Tapable Plugin Framework
在深入了解 plugin 之前，有必要先来了解什么是[Tapable](https://github.com/webpack/tapable)。Tapable 是 webpack 插件架构的核心，极大简化了 webpack 的整体架构。虽然它作为 webpack 的依赖，但 Tapable 的优雅抽象使得我们可以单独使用它来构建其他微内核架构。这里不得不提一下，webpack 就是一个微内核架构的实现。

#### 微内核架构

> 微内核架构（Microkernel Architecture）也叫 Plugin Architecture，是一种基于插件的架构方式，通过编写精简的微内核来支撑以 plugin 的方式来添加更多丰富的功能。

微内核架构包含两个核心概念：**内核系统和插件模块** 。

- 内核系统：在高度抽象概念的基础上实现通用业务逻辑。
- 插件模块：包含特定的处理逻辑和自定义代码，用于增强或扩展微核心产生额外的业务功能。各个插件之间的功能都是各自独立。

微内核和插件之间的具体通信协议在架构模式层面并没有具体的限制，可以是在同一个进程内，也可以是分布式的，可以通过 Socket 通信，也可以通过 HTTP 通信等等。

#### Tapable

说回 Tapable，Tapable 是一个类似于 Node.js 的 EventEmitter 的库,主要是控制 hook 函数的发布与订阅，控制着 webpack 的插件系统。

下面 webpack 的部分源码可以清楚看到核心对象 Compiler、Compilation 都继承自 Tapable：

![](../images/compiler.png)
![](../images/compilation.png)

Tapable 暴露了很多 Hook 类，new 一个类方法获得为 plugin 提供的 hooks：

``` js
const {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  SyncLoopHook,
  AsyncParallelHook,
  AsyncParallelBailHook,
  AsyncSeriesHook,
  AsyncSeriesBailHook,
  AsyncSeriesWaterfallHook
} = require("tapable");
```

名词解释：

|  type   | 描述  |
|  ----  | ----  |
| Hook  | 所有钩子的后缀 |
| Waterfall  | 同步方法，但是它会传值给下一个函数 |
| Bail  | 当函数没有任何返回值，就会在当前执行函数停止 |
| Loop  | 监听函数，返回true表示继续循环，返回undefined表示结束循环 |
| Sync  | 同步方法 |
| AsyncSeries  | 异步串行钩子 |
| AsyncParallel  | 异步并行执行钩子 |

看一个 Tapable 使用的实际例子：

``` js
const hook = new SyncHook(['arg1', 'arg2']);
//绑定事件到 webapck 事件流
hook.tap('hook', (arg1, arg2, arg3) => console.log(arg1, arg2)); // 'hello' 'world'
//执行绑定的事件
hook.call(hello', 'world');
```

Tabpack 提供了同步和异步绑定 hook 的方法，并且都有绑定事件和执行事件对应的方法。

|   Async*  |   Sync*   |
|  ----  | ----  |
|  绑定 tapAsync/tapPromise/tap  |   绑定 tap  |
|  执行 callAsync/promise  |   执行 call  |

### 运行环境
plugin 没有像 loader 那样的独立运行环境`loader runner`，只能在 webpack 里面运行。

### plugin 代码结构：

一个最简单的 plugin 代码结构：

``` js
class MyPlugin {
  apply(compiler) {
    compiler.hooks.done.tap(' My Plugin', (
      stats /* stats is passed as argument when done hook is tapped. */
    ) => {
      // 插件处理逻辑
      console.log('Hello World!');
    });
  }
}
module.exports = MyPlugin;
```