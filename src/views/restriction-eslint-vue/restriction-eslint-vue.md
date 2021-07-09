<h1>ESLint 配置 - Vue 2.x 项目</h1>

<h2>文档变更日志</h2>

| 编写人员 | 修改时间   | 版本  |  更新日志
| -------- | ---------- | ----- | ------ |
| 孙靖     | 2020/06/22 | 1.0.0 |        |
| 孙靖     | 2020/07/29 | 1.0.1 | 优化brace-style |
| 孙靖     | 2021/01/20 | 1.0.2 | 优化comma-spacing |
| 孙靖     | 2021/07/09 | 1.1.0 | 精简配置 |

## 配置文件

团队Vue 2.x项目ESLint配置约定如下:

**.eslintrc.js**

```js
const {
  NODE_ENV,
} = process.env;
const NODE_ENV_PROD = 'production';

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    'plugin:vue/essential',
    'plugin:vue/strongly-recommended',
    'plugin:vue/recommended',
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
    'brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
    'comma-dangle': ['error', 'always-multiline'],
    'comma-spacing': ['error', { before: false, after: true }],
    'consistent-return': 'off',
    'func-names': 'off',
    'import/extensions': 'off',
    'import/no-cycle': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'linebreak-style': 'off',
    'max-len': ['error', 200],
    'no-console': NODE_ENV === NODE_ENV_PROD ? 'warn' : 'off',
    'no-debugger': NODE_ENV === NODE_ENV_PROD ? 'warn' : 'off',
    'no-irregular-whitespace': 'off',
    'no-param-reassign': 'warn',
    'no-shadow': 'warn',
    'no-underscore-dangle': 'off',
    'no-unused-expressions': 'off',
    'no-unused-vars': 'warn',
    'no-use-before-define': ['error', 'nofunc'],
    'no-useless-return': 'warn',
    'prefer-destructuring': 'off',

    // #endregion
  },
};
```