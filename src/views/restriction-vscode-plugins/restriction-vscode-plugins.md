<h1>VSCode插件规范</h1>

<h2>文档变更日志</h2>

| 编写人员 | 修改时间   | 版本  |
| -------- | ---------- | ----- |
| 孙靖     | 2020/05/28 | 1.0.0 |

<h2>目录</h2>

- [规范说明](#规范说明)
- [必要插件](#必要插件)
- [settings.json](#settingsjson)

## 规范说明

除编码层面的规范外, 编辑器规范也是一种重要的提升个人开发效率, 增强团队协作能力的有效途径.

## 必要插件

基于这个目的, 对团队开发编辑器约定以下几种必要插件:

**1. ESLint**

基于项目配置文件, 对前端代码进行硬性代码规范约束, 同时为团队提供统一的代码格式化.

**2. Beautify**

作为ESLint的功能补充, 用于对原生HTML, CSS, Sass和JSON代码进行格式化.

**3. Sass**
  
用于为Sass代码进行语法高亮, 自动补全.

**4. Git History**
  
用于查看Git日志.

**5. GitLens**
  
作为Git History的功能补充, 用于查看行代码修改日志.

> 上述插件刚好满足当前前端开发的需求, 社区使用频率靠前且都遵循ECMA262标准.

## settings.json

以下是上述插件在VSCode中的配置代码, 需追加到settings.json的文件末尾.

```js
// #region eslint
"eslint.options": {
  "extensions": [
    ".html",
    ".js",
    ".jsx",
    ".vue"
  ]
},
"eslint.validate": [
  "javascript",
  "javascriptreact",
  "html",
  "vue"
],
// https://github.com/microsoft/vscode-eslint/issues/600#issuecomment-469211948
"editor.codeActionsOnSave": {
  "source.fixAll.eslint": true
},
"files.autoSave": "off", // no fix on save with auto save on :-)
"eslint.trace.server": "messages",
"eslint.format.enable": true,
// #endregion

// #region Beautify
"beautify.language": {
  "html": [
    "htm",
    "html"
  ],
  "css": [
    "css",
    "scss"
  ]
}
// #endregion
```

