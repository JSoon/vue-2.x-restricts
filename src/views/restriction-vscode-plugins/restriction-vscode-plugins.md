<h1>VSCode插件规范</h1>

<h2>文档变更日志</h2>

| 编写人员 | 修改时间   | 版本  |
| -------- | ---------- | ----- |
| 孙靖     | 2020/05/28 | 1.0.0 |
| 孙靖     | 2021/07/09 | 1.1.0 |

<h2>目录</h2>

- [规范说明](#规范说明)
- [必要插件](#必要插件)
- [settings.json](#settingsjson)

## 规范说明

除编码层面的规范外, 编辑器规范也是一种重要的提升个人开发效率, 增强团队协作能力的有效途径.

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
  "javascript",
  "javascriptreact",
  "typescript",
  "typescriptreact",
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
"eslint.alwaysShowStatus": true

// #endregion

// #region Prettier

// NOTE: Prettier插件的自动格式化不建议在VSCode中打开, 因为默认的配置会影响其他Linters
// 基于该考虑, 故所有Prettier和Linter的任务均在husky中顺序进行
// "editor.defaultFormatter": "esbenp.prettier-vscode",
// "editor.formatOnSave": true

// #endregion
```

