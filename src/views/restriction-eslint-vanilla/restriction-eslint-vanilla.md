<h1>ESLint 配置 - 原生项目</h1>

<h2>文档变更日志</h2>

| 编写人员 | 修改时间   | 版本  |  更新日志
| -------- | ---------- | ----- | ------ |
| 孙靖     | 2020/06/22 | 1.0.0 |        |
| 孙靖     | 2020/07/29 | 1.0.1 | 优化brace-style |
| 孙靖     | 2021/01/20 | 1.0.2 | 优化comma-spacing |
| 孙靖     | 2021/07/09 | 1.1.0 | 精简配置 |
| 孙靖     | 2021/08/13 | 1.2.0 | 新增prettier配置, 优化eslint规则(删减同prettier冲突的配置项) |

## 配置文件

团队原生项目ESLint配置约定如下:

**.eslintrc.js**

```js
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
    'prettier',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    // #region ESLint规则

    // https://eslint.org/docs/rules/
    // https://eslint.org/docs/user-guide/configuring#extending-configuration-files
    'curly': ['error', 'all'],
    'import/extensions': 'off', // 忽略文件扩展名检测, 例如{.vue,.js}等
    'import/no-unresolved': 'off', // 忽略@等别名检测, 使用jsconfig.js配置进行路径解析跳转
    'import/prefer-default-export': 'off',
    'no-console': 'off',
    'no-param-reassign': 'off',

    // #endregion
  },
};
```

**.prettierrc.js**

Prettier配置见: [.prettierrc.js](../restriction-prettier/index.html)