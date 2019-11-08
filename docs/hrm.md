# Hot Module Replacement

### Livereload VS HMR
> 在动态编译完成之后立即触发浏览器自动刷新，从而让浏览器及时获取重新编译之后的资源，这种方案被称为 Livereload。

Livereload 的原理：在浏览器和服务器之间创建 Web Socket 连接，服务器端在执行完动态编译之后发送 reload 事件至浏览器，浏览器接收到此事件之后刷新整个页面。Livereload 虽然能够保证动态构建的资源被浏览器即时获取，但是它有一个致命的缺陷：**无法保存页面状态。**

Hot Module Replacement(HMR) 解决了 Livereload 存在的缺陷。

### HMR 整体工作流程
在开启 webpack-dev-server 模式下，webpack 向构建输出的文件中注入了 HMR Runtime。同时在服务器端也注入了对应的服务模块 HMR Server。与 Livereload 的实现方式类似的是，两者之间也是通过 WebSocket 进行通信的。修改源文件并保存后， webpack 监听到 Filesystem Event 事件并触发了重新构建行为。构建完成之后，webpack 将模块变动信息传递给 HMR Server。HMR Server 通过 Web Socket 发送 Push 信息告知 HMR Runtime 需要更新客户端模块，HMR Runtime 随后通过 HTTP 获取待更新模块的内容详情。最终，HMR Runtime 将更新的模块进行替换，在此过程中浏览器不会进行刷新。

### 详细的原理
1. 第一步，在 webpack 的 watch 模式下，文件系统中某一个文件发生修改，webpack 监听到文件变化，根据配置文件对模块重新编译打包，并将打包后的代码通过简单的 JavaScript 对象保存在内存中。
2. 第二步是 webpack-dev-server 和 webpack 之间的接口交互，而在这一步，主要是 dev-server 的中间件 webpack-dev-middleware 和 webpack 之间的交互，webpack-dev-middleware 调用 webpack 暴露的 API对代码变化进行监控，并且告诉 webpack，将代码打包到内存中。
3. 第三步是 webpack-dev-server 对文件变化的一个监控，这一步不同于第一步，并不是监控代码变化重新打包。当我们在配置文件中配置了devServer.watchContentBase 为 true 的时候，Server 会监听这些配置文件夹中静态文件的变化，变化后会通知浏览器端对应用进行 live reload。注意，这儿是浏览器刷新，和 HMR 是两个概念。
4. 第四步也是 webpack-dev-server 代码的工作，该步骤主要是通过 sockjs（webpack-dev-server 的依赖）在浏览器端和服务端之间建立一个 websocket 长连接，将 webpack 编译打包的各个阶段的状态信息告知浏览器端，同时也包括第三步中 Server 监听静态文件变化的信息。浏览器端根据这些 socket 消息进行不同的操作。当然服务端传递的最主要信息还是新模块的 hash 值，后面的步骤根据这一 hash 值来进行模块热替换。
5. webpack-dev-server/client 端并不能够请求更新的代码，也不会执行热更模块操作，而把这些工作又交回给了 webpack，webpack/hot/dev-server 的工作就是根据 webpack-dev-server/client 传给它的信息以及 dev-server 的配置决定是刷新浏览器呢还是进行模块热更新。当然如果仅仅是刷新浏览器，也就没有后面那些步骤了。
6. HotModuleReplacement.runtime 是客户端 HMR 的中枢，它接收到上一步传递给他的新模块的 hash 值，它通过 JsonpMainTemplate.runtime 向 server 端发送 Ajax 请求，服务端返回一个 json，该 json 包含了所有要更新的模块的 hash 值，获取到更新列表后，该模块再次通过 jsonp 请求，获取到最新的模块代码。
7. HotModulePlugin 将会对新旧模块进行对比，决定是否更新模块，在决定更新模块后，检查模块之间的依赖关系，更新模块的同时更新模块间的依赖引用。
8. 最后一步，当 HMR 失败后，回退到 live reload 操作，也就是进行浏览器刷新来获取最新打包代码。
