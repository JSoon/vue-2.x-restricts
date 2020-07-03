<h1>Vue CLI - 模式和环境变量对构建的影响</h1>

<h2>目录</h2>

- [问题背景](#问题背景)
- [构建模式](#构建模式)
- [坑点](#坑点)
- [什么是Staging环境](#什么是staging环境)
- [参考资料](#参考资料)

## 问题背景

由于项目一直基于Chrome开发, 在兼容性测试阶段时, 发现IE11不能输出界面. 打开调试工具发现报错:

```
SCRIPT1003: Expected ':' IE11
```

打开构建后的代码发现, 原因是IE11不支持ES2015的新语法: [Shorthand property names 和 Shorthand method names](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#Syntax). 问题在于, 在项目中, 已经引入的相应的babel并且配置无误, 但构建后的代码中, ES6的语法没有被转换为相应的ES5代码.

几经调试无果, 转而决定从Vue CLI的文档入手.

## 构建模式

对于基于Vue CLI的项目而言, 模式是一个很重要的概念. 默认有三种模式:

- development: vue-cli-service serve
- test: vue-cli-service test:unit
- production: vue-cli-service build 和 vue-cli-service test:e2e

在不同的模式下, `vue-cli-service`会创建并执行不同的webpack配置. 通过执行`vue inspect --mode [development|test|production|...]`可以进行查看.

**三种模式的特性**

- development: HMR(热刷新), 不会对资源进行hash命名, 不会创建vendor bundles.
- test: 不会处理图片和其他对于单元测试不必要的资源.
- production: 经过hash和压缩, 准备好部署的资源.

> 如果在你的环境中已经定义了一个默认的NODE_ENV, 则需要移除该变量, 或者在执行`vue-cli-service`命令时明确指定`--mode`的值.

## 坑点

在`--mode test`下, 由于该模式专注于单元测试的使用及优化, 并不会对资源进行语法转换, 换言之, 不会对代码执行babel处理. 这也是在上述问题背景中, IE11报错的直接原因.

所以这里的test, 并不是代表测试线, 而是代表单元测试模式. 那么, 如何才能科学地描述测试线环境呢? 答案是: **Staging Environment**.

## 什么是Staging环境

Staging环境是生产环境(即当前线上运行的正式版本)的一个副本, 运行在独立的服务上. 任何上线前的补丁, 新特性和版本升级的测试, 都在该环境下进行. 所以对于网站/软件来说, 一个理想的开发工作流应该由以下三种环境构成:

- Development (开发者本地环境)
- Staging (预发布环境)
- Production (生产环境)

所以对应的, 对于Vue CLI的构建, 我们应该创建三个与之对应的配置文件:

- .env.development
```
NODE_ENV=development
VUE_APP_MODE=development
...(VUE_APP_OTHER_KEY=OTHER_VALUE)
```

- .env.staging
```
NODE_ENV=production
VUE_APP_MODE=staging
...(VUE_APP_OTHER_KEY=OTHER_VALUE)
```

- .env.production
```
NODE_ENV=production
VUE_APP_MODE=production
...(VUE_APP_OTHER_KEY=OTHER_VALUE)
```

> 注1: 由于预发布环境应当是生产环境的一个副本, 所以NODE_ENV应当与正式发布环境一致, 以保证构建配置的一致性.

> 注2: Vue CLI使用NODE_ENV来确定不同的webpack配置, 如果想区分NODE_ENV和当前配置文件的MODE, 则可以新增`VUE_APP_MODE`来设置相应的模式值.

## 参考资料

[Modes and Environment Variables](https://cli.vuejs.org/guide/mode-and-env.html#modes)

[Web Development: What is Staging?](https://www.commonplaces.com/blog/web-development-what-is-staging/)

[Custom Build Modes with Vue CLI 3](https://rangle.io/blog/custom-build-modes-with-vue-cli-3/)
