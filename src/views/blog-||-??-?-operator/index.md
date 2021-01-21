<h1>逻辑或, 空值合并, 可选链运算符</h1>

<h2>目录</h2>

- [问题背景](#问题背景)
- [逻辑或 (||)](#逻辑或-)
- [空值合并 (??)](#空值合并-)
  - [语法](#语法)
  - [不能直接同 AND 或者 OR 运算符链式使用](#不能直接同-and-或者-or-运算符链式使用)
- [可选链 (?.)](#可选链-)
  - [语法](#语法-1)
- [`?.` 和 `??` 的关系](#-和--的关系)
- [何时应该使用空值合并运算符 `??`](#何时应该使用空值合并运算符-)
- [参考资料](#参考资料)

## 问题背景
[ECMAScript 2020, the 11th edition](https://tc39.es/ecma262/#sec-intro) 引入了 [Nullish Coalescing Operator](https://tc39.es/ecma262/#prod-CoalesceExpression) 运算符 (`??`) 和 [Optional Chaining Operator](https://tc39.es/ecma262/#prod-OptionalExpression) 运算符 (`?.`), 广泛运用这两种运算符, 将在较大程度上提高程序的鲁棒性.

## 逻辑或 (||)
在控制合并运算符出现以前, 一般通过 `||` 来为变量设置默认值, 例如:
```javascript
const paginate = (options = {}) => {
  return [1, 2, 3, 4, 5].splice(0, options.limit || 3);
}

paginate(1); // expected: [1], output: [1]
paginate(); // expected: [1, 2, 3], output: [1, 2, 3]
paginate(0); // expected: [], output: [1, 2, 3]
```
通过执行上述代码的最后一句表达式, 程序并没有得到期望的输出, 即 `options.limit || 3` 得到的是 `3`, 而不是 `0`. 也就是说, `0` 连同`''`, `NaN`, `null` 和 `undefined` 一并被当做逻辑 `false` 来进行运算.

## 空值合并 (??)
使用 `??` 运算符, 则可以解决上述问题.

### 语法
```
leftExpr ?? rightExpr
```

> 空值合并运算符 `??` 的计算方式是, 当运算符左边的值为 `null` 或者 `undefined` 时, 返回右边的值, 否则, 返回运算符左边的值.

所以刚才的代码可以改写为: 
```javascript
const paginate = (options = {}) => {
  return [1, 2, 3, 4, 5].splice(0, options.limit ?? 3);
}

paginate(1); // expected: [1], output: [1]
paginate(); // expected: [1, 2, 3], output: [1, 2, 3]
paginate(0); // expected: [], output: []
```
这样就得到了期望输出.

### 不能直接同 AND 或者 OR 运算符链式使用

**错误的语法**
```javascript
null || undefined ?? "foo"; // raises a SyntaxError
true || undefined ?? "foo"; // raises a SyntaxError
```

**正确的语法**
```javascript
// 加上圆括号, 提升运算符优先级
(null || undefined) ?? "foo"; // returns "foo"
```

## 可选链 (?.)
可选链允许读取对象上的属性, 同时无需明确地校验该属性是否合法. 除了会在遇到 `null` 或 `undefined` 会导致错误以外, 可选链操作符 `?.` 基本类似于 `.` 链式操作符. 当读取到遇到 `null` 或 `undefined` 的属性时, 整个表达式会返回 `undefined`.

简而言之, 可选链的出现, 大大提升了程序的简洁度和鲁棒性, 例如:

```javascript
// 判断属性是否存在, 并进行对应的逻辑处理
const a = {
  b: {
    d: 'd'
  }
}

// 抛错
if (a.b.c.d) {
  // Uncaught TypeError: Cannot read property 'd' of undefined
} else {
  // ...
}

// 不使用可选链
if (a) {
  if (a.b) {
    if (a.b.c) {
      if (a.b.c.d) {
        // 按照属性层级逐级判断
      } else {
        // ...
      }
    }
  }
}

// 使用可选链
if (a?.b?.c?.d) {
  // a.b?.c?.d -> undefined
} else {
  // ...
}
```

### 语法
```javascript
obj.val?.prop // 属性读取
obj.val?.[expr] // 表达式属性读取 (即该属性名由表达式生成, 例如: obj.val?.['prop' + 'Name'])
obj.arr?.[index] // 数组元素读取
obj.func?.(args) // 函数调用
```

> 注: 若obj.func?.(args) 中, func 存在但本身不是函数, 也会报错.

## `?.` 和 `??` 的关系
由于可选链和空值合并运算符都对 `null` 和 `undefined` 敏感, 所以通常可以将这两种运算符联合使用, 用于为变量设置缺省值, 例如:

```javascript
let customer = {
  name: "Carl",
  details: { age: 82 }
};
const customerCity = customer?.city ?? "Unknown city";
console.log(customerCity); // Unknown city
```

## 何时应该使用空值合并运算符 `??`
在实际应用中, 当 `0`, `''` 和 `NaN` 被认为是有意义的值时, 则使用 `??`, 其他情况下, 则使用逻辑或 `||`.

## 参考资料
[Logical OR (||) vs Nullish Coalescing Operator (??) in JavaScript](https://dev.to/hereisnaman/logical-or-vs-nullish-coalescing-operator-in-javascript-3851)

[Nullish coalescing operator (??)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator)

[Optional chaining (?.)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)