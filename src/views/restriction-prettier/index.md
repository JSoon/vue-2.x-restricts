<h1>Prettier 配置文件</h1>

## .prettierrc.js

```js
// https://prettier.io/docs/en/options.html
module.exports = {
  // 箭头函数参数始终添加括号: (x) => {}
  arrowParens: 'always',
  // 花括号内部前后始终添加空格: { name: 'foo' }
  bracketSpacing: true,
  // 内嵌其他语言自动识别进行格式化
  embeddedLanguageFormatting: 'auto',
  // html标签按照css规则处理内部空格: block/inline
  htmlWhitespaceSensitivity: 'css',
  requirePragma: false,
  insertPragma: false,
  // jsx标签结束是否和属性在同一行
  jsxBracketSameLine: false,
  // jsx是否使用单引号: const foo = <div class="foo" />;
  jsxSingleQuote: false,
  // 代码最大打印宽度, 提高代码可读性
  printWidth: 120,
  // 对象属性名是否需要引号, 若存在引号属性, 则该对象中其他属性均添加括号
  quoteProps: 'consistent',
  // 代码语句末尾始终添加分号`;`
  semi: true,
  // JS中始终使用单引号
  singleQuote: true,
  // 不使用制表符进行代码缩进, 使用空格
  useTabs: false,
  // 制表符宽度: 2个空格
  tabWidth: 2,
  // 由逗号分隔的多行语法结构, 对符合ES5中合法的语法进行末尾逗号的添加,
  // 如字面量对象, 数组等等: const obj = { name: 'Ben', age: '18', }; const arr = [1, 2, 3,];
  trailingComma: 'es5',
  // .vue中, <script>和<style>标签中的代码不进行整体缩进
  vueIndentScriptAndStyle: false,
};
```
