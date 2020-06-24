<h1>注释规范</h1>

<h2>文档变更日志</h2>

| 编写人员 | 修改时间   | 版本  |
| -------- | ---------- | ----- |
| 孙靖     | 2020/05/28 | 1.0.0 |

<h2>目录</h2>

- [规范说明](#规范说明)
- [HTML注释](#html注释)
  - [W3C标准](#w3c标准)
  - [团队约定](#团队约定)
- [CSS注释](#css注释)
  - [W3C标准](#w3c标准-1)
  - [团队约定](#团队约定-1)
- [JavaScript注释](#javascript注释)
  - [ECMA262标准](#ecma262标准)
  - [团队约定](#团队约定-2)

## 规范说明

注释规范用于约束并规范由于项目历史原因以及个人习惯引起的各种注释不统一.

良好的注释**极大程度**影响代码的可读性以及可维护性, 从而提升开发效率和团队协作效率.

其中包括:

1. HTML注释
2. CSS注释
3. JavaScript注释

## HTML注释

### W3C标准

> Comments must have the following format:
>
> 1. The string "`<!--`"
>
> 2. Optionally, text, with the additional restriction that the text must not start with the string "`>`", nor start with the string "`->`", nor contain the strings "`<!--`", "`-->`", or "`--!`>", nor end with the string "`<!-`".
>
> 3. The string "`-->`"

参考资料:

https://www.w3.org/TR/html52/syntax.html#comments

https://www.w3schools.com/html/html_comments.asp

### 团队约定

**单行注释**

一般用于简单的描述, 如某些状态描述, 属性描述等.

注释内容前后各一个空格字符, 注释位于要注释代码的上面, 单独占一行.

```html
<!-- Comment Text -->
<div>...</div>
```

**模块注释**

一般用于描述模块名称, 以及模块开始与结束位置.

该类注释适用于HTML内容较多的模块. 若内容较少, 使用单行注释即可.

```html
<!-- 全局搜索栏 -->
<div class="search-form">
  
</div>
<!-- /全局搜索栏 -->
```

## CSS注释

### W3C标准

> Comments begin with the characters "`/*`" and end with the characters "`*/`". They may occur anywhere outside other tokens, and their contents have no influence on the rendering. Comments may not be nested.

参考资料:

https://www.w3.org/TR/CSS21/syndata.html#comments

https://drafts.csswg.org/css-syntax-3/#token-diagrams

### 团队约定

**单行注释**

用于进行简单描述. 注释内容单独占一行.

**多行注释**

用于进行模块内容描述, 区分模块样式. 同时使得在样式表中更加醒目易查找.

**CSS**

在原生CSS中, 使用标准注释符`/* Comment Text */`进行注释.

```css
/* 单行注释 */
.header {}

/*
模块注释(无缩进)
*/
.header {}
/* 页头logo */
.header .logo {
  display: block;
}

/*
	模块注释(带两个空格缩进)
*/
.footer {}
```

**Sass/SCSS**

在预编译语言中, 使用`//`进行注释.

```scss
// 在预编译语言中, 允许使用双斜线进行注释, 且双斜线注释内容不会出现在编译后的文件中

// 单行注释
.header {}

//
// 模块注释(上下两排各多插入一个行注释符)
//
.header {
  // 页头logo
  .logo {
    display: block;
  }
}

//
// 模块注释
//
.footer {}
```

## JavaScript注释

### ECMA262标准

>Comments can be either single or multi-line. Multi-line comments cannot nest.
>
>Because a single-line comment can contain any Unicode code point except a [LineTerminator](https://tc39.es/ecma262/#prod-LineTerminator) code point, and because of the general rule that a token is always as long as possible, a single-line comment always consists of all code points from the `//` marker to the end of the line. However, the [LineTerminator](https://tc39.es/ecma262/#prod-LineTerminator) at the end of the line is not considered to be part of the single-line comment; it is recognized separately by the lexical grammar and becomes part of the stream of input elements for the syntactic grammar. This point is very important, because it implies that the presence or absence of single-line comments does not affect the process of automatic semicolon insertion (see [11.9](https://tc39.es/ecma262/#sec-automatic-semicolon-insertion)).
>
>Comments behave like white space and are discarded except that, if a [MultiLineComment](https://tc39.es/ecma262/#prod-MultiLineComment) contains a line terminator code point, then the entire comment is considered to be a [LineTerminator](https://tc39.es/ecma262/#prod-LineTerminator) for purposes of parsing by the syntactic grammar.

参考资料:

https://tc39.es/ecma262/#sec-comments

https://www.w3schools.com/js/js_comments.asp

https://google.github.io/styleguide/jsguide.html#formatting-comments

### 团队约定

**单行注释**

单行注释用于对代码进行简单描述. 注释内容单独占一行.

```js
// 轮播动画速度
let speed = 5000;
// 轮播循环播放开关
let loop = false;
```

**多行注释**

多行注释用于对代码进行详细描述.

```js
/**
 * 活动商品计算公式
 * 结算价格 = 原价 * 折扣
 */
const finalPrice = originPrice * discount;
```

**JSDoc注释**

JSDoc注释用于所有的类和方法. 旨在对函数进行详细描述, 包括参数类型, 相关方法, 参考资料, 使用方式等等.

详细文档: https://jsdoc.app/

```js
/**
 * Promise错误捕获工具函数
 *
 * @description 用于异步函数Async & Await
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function}
 * @example
 * let err, data, loading;
 * loading = true
 * [err, data] = await to(DataModel);
 * if (err) {
 *  // do something to handle err...
 * }
 * loading = false
 *
 * @returns {Array} 包含错误对象和返回数据的数组
 */
export default function to(promise) {
  return promise
    .then((data) => [null, data])
    .catch((err) => [err]);
}
```

**区域注释**

区域注释依赖于VSCode Editor的区域注释功能, 能够对区域内代码进行收起和展开. 用于对代码进行逻辑分区, 便于维护.

参考资料: https://code.visualstudio.com/updates/v1_17#_folding-regions

```js
//#region 页头搜索框
// ...
// 搜索框相关业务代码
// ...
//#endregion

//#region 推荐商品列表
// ...
// 推荐商品列表相关业务代码
// ...
//#endregion
```