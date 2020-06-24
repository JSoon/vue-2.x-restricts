<h1>为什么需要在 NPM 脚本中对 glob 语句使用引号</h1>

![oh my glob](./oh_my_glob-2721.jpeg)

(图片来源: https://8tracks.com/shanshanness/oh-my-glob)

<h2>目录</h2>

- [问题背景](#问题背景)
- [Why?](#why)
- [解决方法](#解决方法)
- [参考资料](#参考资料)

## 问题背景

最近在一个项目中使用[postcss cli](https://github.com/postcss/postcss-cli)时, 使用到了[Glob Pattern](https://en.wikipedia.org/wiki/Glob_(programming))来对系统文件进行匹配. 然而在执行NPM脚本时, 却发现没有得到预期的结果. 例如, `src/**/*.js`并未匹配到所有子目录下的`.js`文件, 而仅仅只会匹配到src的顶级目录下的所有`.js`文件.

**NPM执行环境**
```
// MAC OS X 10.13.6
GNU bash, version 3.2.57(1)-release (x86_64-apple-darwin17)
Copyright (C) 2007 Free Software Foundation, Inc.
```

## Why?

> NPM脚本不会使用用户当前使用的shell来执行指令.

NPM生命周期在MAC OS X和Linux上, 使用`sh -c`来执行用户指令, 在Windows上则使用的是`cmd /d /s /c`([源码传送门](https://github.com/npm/npm/blob/33ad728dfd7b81fcfd5b8ecc0609a582a4a57567/lib/utils/lifecycle.js#L216)). 这意味着, 本地环境中的 **`/bin/sh`** (或者任何它指向的shell, 因为/bin/sh在很多情况下只是系统软链) 会作为shell来执行指令. 在MAC OS X和许多Linux系统版本中, /bin/sh都是默认的Bash Shell.

这也正是之前谈到的问题来源, 并且该问题很隐晦, 通常不容易理解.

通过上面我们知道, MAC OS X使用的是GNU bash 3.2.x来执行NPM脚本, 然而`globstar`(即`**`, 用于匹配0个或多个目录及其子目录)通配符是从Bash 4.0开始才开始支持的. 更糟糕的是, Windows的shell压根就不支持通配符扩展.

这也就意味着:

```
// Bash 3.2.x
src/**/*.js
```

匹配到的其实是:

```
src/*/*.js
```

只会匹配src下的顶级目录, 不会匹配其他子目录.

![glob pattern](./EsIExgT.gif)

(图片来源: https://imgur.com/EsIExgT)

最好的解决方案是引入[node-glob](https://github.com/isaacs/node-glob)模块来对不同系统下的glob pattern进行匹配. 很多流行的工具像ESLint, Babel等等, 都依赖于该模块. 那么如何避免系统shell对globs进行匹配呢? 技巧就是, **给glob pattern加上引号**. 这样带来的结果是, glob pattern不是由系统shell来进行扩展, 而是将这个解析过程交给了当前的使用了node-glob的工具.

对于postcss-cli而言, 依赖的是类似的glob模块, 打开package-lock.json进行查看便能得知:

```json
"postcss-cli": {
  "version": "7.1.1",
  "resolved": "https://registry.npm.taobao.org/postcss-cli/download/postcss-cli-7.1.1.tgz",
  "integrity": "sha1-Jg+VRr4mCyFJvzLijXhaDXnJqrg=",
  "dev": true,
  "requires": {
    "chalk": "^4.0.0",
    "chokidar": "^3.3.0",
    "dependency-graph": "^0.9.0",
    "fs-extra": "^9.0.0",
    "get-stdin": "^7.0.0",
    // glob pattern匹配模块
    "globby": "^11.0.0",
    "postcss": "^7.0.0",
    "postcss-load-config": "^2.0.0",
    "postcss-reporter": "^6.0.0",
    "pretty-hrtime": "^1.0.3",
    "read-cache": "^1.0.0",
    "yargs": "^15.0.2"
  }
}
```

## 解决方法

正是由于上述原因, 所以我们需要将之前的NPM脚本进行改造, 变为:

```json
"scripts": {
  "svg": "npx postcss 'src/**/*.js' --replace"
},
```

则能够匹配到我们所期望的结果了. 值得注意的是, Windows系统下, 不支持单引号😩. 所以还需要对上面的指令进行优化, 使用双引号, 同时要对双引号进行转义:

```json
"scripts": {
  "svg": "npx postcss \"src/**/*.js\" --replace"
},
```

这样, 我们则能够在NPM脚本中正常地使用glob pattern了.

## 参考资料

- [Why you should always quote your globs in NPM scripts](https://medium.com/@jakubsynowiec/you-should-always-quote-your-globs-in-npm-scripts-621887a2a784)
- [node glob](https://github.com/isaacs/node-glob#readme)
- [Glob Patterns匹配模式使用](https://juejin.im/post/5c2797f8e51d45176760e2cf)
- [Fix glob docs](https://github.com/postcss/postcss-cli/issues/142#issuecomment-310681302)