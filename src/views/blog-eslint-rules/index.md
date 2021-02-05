<h1>ESLint 部分规则说明</h1>

<h2>目录</h2>

- [不必要的三元运算 (no-unneeded-ternary)](#不必要的三元运算-no-unneeded-ternary)
- [待更新...](#待更新)

## 不必要的三元运算 (no-unneeded-ternary)

当存在更加简洁的语句时, 禁止使用三元运算符.

> Disallow ternary operators when simpler alternatives exist.

**举例说明**

```js
// 1. 三元运算符的三个运算数均为布尔值
// Bad
var isYes = answer === 1 ? true : false;
// Good: 仅使用等式运算符即可
var isYes = answer === 1;

// 2. 三元运算符用于指定默认值
// Bad
foo(bar ? bar : 1);
// Good: 使用逻辑或运算符
foo(bar || 1);

// 3. 三元运算符的第一个运算数为逻辑假, 如: undefined, null, false, etc.
// Bad
var isOriginal = data.isOriginal ? true : false
// Good: 使用双重逻辑非一元运算符
var isOriginal = !!data.isOriginal
```

**参考文档**

https://eslint.org/docs/rules/no-unneeded-ternary

## 待更新...