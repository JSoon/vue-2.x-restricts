<h1>Object.defineProperty 剖析</h1>

<h2>目录</h2>

- [定义](#定义)
- [语法](#语法)
- [详述](#详述)
  - [共有描述符 (both data & accessor descriptor)](#共有描述符-both-data--accessor-descriptor)
  - [数据描述符 (data descriptor)](#数据描述符-data-descriptor)
  - [存取器描述符 (accessor descriptor)](#存取器描述符-accessor-descriptor)
  - [如何确保描述符配置的初始值不被改变](#如何确保描述符配置的初始值不被改变)
- [举例](#举例)
  - [定义属性](#定义属性)
- [参考资料](#参考资料)

## 定义

`Object.defineProperty()` 用于直接在对象上定义新的属性, 或者修改已存在的属性, 同时返回该对象.

## 语法

```js
// obj        {object}        目标对象
// prop       {string|symbol} 新的或者需要修改的属性名称或者`Symbol`
// descriptor {object}        属性描述符配置对象
Object.defineProperty(obj, prop, descriptor)
```
**Demo**
```js
const myObj = {}

Object.defineProperty(myObj, 'property1', {
  // data & accessor 共享描述符
  configurable: false,
  enumerable: false,
  // 数据描述符
  value: undefined,
  writable: false,
  // 存取器描述符
  get: undefined,
  set: undefined,
})
```

## 详述

`Object.defineProperty` 允许在对象上进行属性的精准添加和修改. 常规的属性添加, 即通过复制运算符 `.` 的方式添加的属性会出现在对象属性的枚举中, 可通过 `for...in`, `Object.keys`, `Object.entries` 进行访问, 这些属性可以被修改和删除. 

默认情况下, 通过该方法添加的属性是不可修改且不可枚举的.

属性描述符分为两种类型: 数据描述符 (`data descriptors`) 和存取器描述符 (`accessor descriptors`). 简单说来, 数据描述符包含 `value` 和 `writable` 配置项; 而访问器描述符包含一对 getter-setter 存取函数. 

同一属性的描述符对象要么是数据描述符, 要么是存取器描述符, 不能同时包含两种类型的描述符. 若同时包含了两种描述符, 运行时则会抛错:

```js
const myObj = {};

Object.defineProperty(myObj, 'property1', {
  value: 42,
  get() { return 10; },    
});

// 抛错如下
// Uncaught TypeError: Invalid property descriptor. Cannot both specify accessors and a value or writable attribute, #<Object>
//     at Function.defineProperty (<anonymous>)
//     at <anonymous>:3:8
```

描述符配置对象包含以下六种描述符:

> 注: 所有描述符默认值仅考虑由 `Object.defineProperty` 创建出来的属性, 由赋值运算符 `.` 创建的属性的特性将在本文后面的内容中进行讲解.

### 共有描述符 (both data & accessor descriptor)

**configurable**

属性是否可配置, 即是否能被修改和删除. 

默认值为 `false`.

**enumerable**

属性是否可枚举, 即是否能通过 `for...in`, `Object.keys`, `Object.entries` 进行访问. 

默认值为 `false`.

### 数据描述符 (data descriptor)

**value**

属性值, 可以是任意合法的 JavaScript 值 (number, object, function, etc.). 

默认值为 `undefined`.

**writable**

属性是否能够通过赋值运算符进行修改.

默认为 `false`.

### 存取器描述符 (accessor descriptor)

**get**

属性 getter 函数. 当访问属性时, 该函数被执行, 同时 `this` 指向该属性被访问时的对象. 函数返回值将作为属性值.

默认为 `undefined`.

> 注: `this` 指向的对象可能不是该属性被定义时的对象, 例如由原型继承而创建的对象, 当其属性被访问时, `this` 指向的是该对象实例, 而非原型对象本身.

**set**

属性 setter 函数. 当属性被赋值时, 该函数被执行, 参数为进行赋值的值, 同时 `this` 指向该属性被赋值的对象.

默认为 `undefined`.

### 如何确保描述符配置的初始值不被改变

请记住, 描述符配置对象中的属性不一定是自身的属性, 这也就意味着, 通过继承而来的属性, 也应当纳入考虑的范畴. 为了确保定义属性时描述符配置保留正确的初始值, 可以通过以下三种方式:

```js
// using __proto__
var obj = {};

// 1. 创建一个空对象, 不从任何对象中继承属性
var descriptor1 = Object.create(null); // no inherited properties
descriptor1.value = 'static';

// not enumerable, not configurable, not writable as defaults
Object.defineProperty(obj, 'key1', descriptor1);

// 2. 明确配置所有的描述符
Object.defineProperty(obj, 'key2', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: 'static'
});

// 3. 冻结原型链
var Descriptor = function () {};
if (Object.freeze) {
  Object.freeze(Descriptor.prototype);
  var descriptor2 = new Descriptor();
  descriptor2.value = 'static';
  Object.defineProperty(obj, 'key3', descriptor2);
}
```

## 举例

### 定义属性

当属性在对象中不存在时, `Object.defineProperty()` 则根据描述进行创建. 当省略描述符时, 会使用默认值进行配置.

```js
// 创建新对象
var o = {}

// 1. 通过数据描述符创建对象属性
Object.defineProperty(o, 'a', {
  value: 37,
  writable: true,
  enumerable: true,
  configurable: true
});
// 结果: o.a 等于 37

// 2. 通过存取器描述符创建对象属性
var bValue = 38;
Object.defineProperty(o, 'b', {
  // Using shorthand method names (ES2015 feature).
  // This is equivalent to:
  // get: function() { return bValue; },
  // set: function(newValue) { bValue = newValue; },
  get() { return bValue; },
  set(newValue) { bValue = newValue; },
  enumerable: true,
  configurable: true
});
// 结果: o.b 等于 38

// 3. 混合描述符
Object.defineProperty(o, 'conflict', {
  value: 0x9f91102,
  get() { return 0xdeadbeef; }
});
// 结果:
// Uncaught TypeError: Invalid property descriptor. Cannot both specify accessors and a value or writable attribute, #<Object>
```

## 参考资料
