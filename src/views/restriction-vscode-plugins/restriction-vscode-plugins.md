<h1>VSCode插件规范</h1>

<h2>文档变更日志</h2>

| 编写人员 | 修改时间   | 版本  |  更新日志
| -------- | ---------- | ----- | ------ |
| 孙靖     | 2020/05/28 | 1.0.0 |  |
| 孙靖     | 2021/07/09 | 1.1.0 |  |
| 孙靖     | 2021/08/13 | 1.2.0 | 优化prettier配置 |

<h2>目录</h2>

- [规范说明](#规范说明)
- [必要插件](#必要插件)
- [settings.json](#settingsjson)

## 规范说明

除编码层面的规范外, 编辑器规范也是一种重要的提升个人开发效率, 增强团队协作能力的有效途径.

> 简言之: 约定大于配置, 配置大于编码.

## 必要插件

基于这个目的, 对团队开发编辑器约定以下几种必要插件:

**1. ESLint**

基于项目配置文件, 对前端代码质量进行硬性代码规范约束.

**2. Prettier**

基于项目配置文件, 对前端代码风格进行统一格式化.

> NOTE: 关于 Lints 和 Prettier 的区别与关系请参考 [Prettier vs. Linters](https://prettier.io/docs/en/comparison.html) .

**3. Git History**
  
用于查看Git日志.

**4. GitLens**
  
作为Git History的功能补充, 用于查看行代码修改日志.

**5. Babel JavaScript**

ES201x, React JSX, Flow and GraphQL语法高亮.

**6. PlantUML**

专业快速绘制UML插件, 同时还支持各种非UML图. 支持各种格式导出.

> 上述插件刚好满足当前团队前端开发的需求, 社区使用频率靠前且都遵循ECMA262标准.

## settings.json

以下是上述插件在VSCode中的配置代码, 需追加到settings.json的文件末尾.

```js
// #region ESLint

"eslint.options": {
  "extensions": [".html", ".js", ".jsx", ".vue"]
},
"eslint.validate": [
  "html",
  "javascript",
  "javascriptreact",
  "typescript",
  "typescriptreact",
  "vue"
],
// https://github.com/microsoft/vscode-eslint/issues/600#issuecomment-469211948
"editor.codeActionsOnSave": {
  "source.fixAll.eslint": true
},
"eslint.alwaysShowStatus": true,
"eslint.format.enable": true,
"eslint.trace.server": "messages",
"files.autoSave": "off", // no fix on save with auto save on :-)

// #endregion

// #region Prettier

"editor.defaultFormatter": "esbenp.prettier-vscode",
"editor.formatOnSave": true,
// 仅对存在配置文件的项目进行格式化, 避免对其他项目进行预期之外的格式化
"prettier.requireConfig": true

// #endregion
```

