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
  - [修改属性](#修改属性)
  - [新增属性及其默认值](#新增属性及其默认值)
  - [自定义 Setters 和 Getters](#自定义-setters-和-getters)
  - [属性继承](#属性继承)
- [延伸阅读](#延伸阅读)
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

`Object.defineProperty` 允许在对象上进行属性的精准添加和修改. 常规的属性添加, 即通过赋值运算符 `.` 的方式添加的属性会出现在对象属性的枚举中, 可通过 `for...in`, `Object.keys`, `Object.entries` 进行访问, 这些属性可以被修改和删除. 

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

> 注: 所有描述符默认值仅考虑由 `Object.defineProperty` 创建出来的属性, 由赋值运算符 `.` 创建的属性的特性将在[新增属性及其默认值](#新增属性及其默认值)一节进行讲解.

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

### 修改属性

当属性在对象中已经存在时, `Object.defineProperty()` 会根据新的描述符配置尝试修改该属性的值和现有配置. 若现有配置中的 `configurable` 为 `false`, 则表示该属性是"不可配置"的. 也就意味着: 

1. 对于一个不可配置的存取器描述的属性, 不能进行任何修改.
2. 对于数据描述的属性, 仅仅能够将 `writable` 从 `true` 改为 `false`.
3. 数据描述属性和存取器描述属性不能相互转换
4. 任何属性不可被 delete 运算符删除

```js
// 数据描述符属性
var o = {};
Object.defineProperty(o, 'name', {
  configurable: false,
  writable: true,
  value: 'Soon',
});

// 修改成功
Object.defineProperty(o, 'name', {
  configurable: false,
  writable: false,
  value: 'Soon',
});

// 存取器描述符属性
var o = {};
Object.defineProperty(o, 'name', {
  configurable: false,
  get() { return this.name_stored; },
  set(name) { this.name_stored = name; },
});

// 修改失败
Object.defineProperty(o, 'name', {
  configurable: false,
  get() { return this.new_name_stored; },
  set(name) { this.new_name_stored = name; },
});

// 数据描述符和存取器描述符相互转换
var o = {};
Object.defineProperty(o, 'name', {
  configurable: false,
  writable: true,
  value: 'Soon',
});

// 修改失败
Object.defineProperty(o, 'name', {
  configurable: false,
  get() { return this.name_stored; },
  set(name) { this.name_stored = name; },
});

// 属性删除
var o = {};
Object.defineProperty(o, 'name', {
  configurable: false,
  writable: true,
  value: 'Soon',
});

console.log(o.name); // 'Soon'
delete o.name;
console.log(o.name); // 'Soon'
```

所以, 除非修改后的属性和修改前的属性完全一样, 否则对一个不可配置属性进行修改(除了将 `writable` 由 `true` 改为 `false`), 都会报错.

**可写描述符**

当 `writable` 为 `false` 时, 该属性则为"不可写"的. 即无法进行再次赋值.

```js
// 非严格模式
var o = {}; // Creates a new object

Object.defineProperty(o, 'a', {
  value: 37,
  writable: false
});

console.log(o.a); // 37
o.a = 25; // 非严格模式下, 不会报错, 但赋值也不会成功
console.log(o.a); // 37, 赋值失败

// 严格模式
(function() {
  'use strict';
  var o = {};
  Object.defineProperty(o, 'b', {
    value: 2,
    writable: false
  });
  o.b = 3; // 抛异常: "b" 是只读属性
  return o.b; // 2
}());
```

**可枚举描述符**

`enumerable` 决定了属性是否可被 `Object.assign()` 或者 [spread 运算符](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) 获取. 对于非 [`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) 属性来说, 可枚举描述符也决定了属性是否能被 [`for...in`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in), [`Object.keys`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys) 和 [`Object.entries`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries) 遍历.

```js
var o = {};
Object.defineProperty(o, 'a', {
  value: 1,
  enumerable: true
});
Object.defineProperty(o, 'b', {
  value: 2,
  enumerable: false
});
Object.defineProperty(o, 'c', {
  value: 3,
  // enumerable 默认为 false, 等同于:
  // enumerable: false,
});
// 当通过赋值运算创建属性时, enumerable 默认为 true
o.d = 4;
Object.defineProperty(o, Symbol.for('e'), {
  value: 5,
  enumerable: true
});
Object.defineProperty(o, Symbol.for('f'), {
  value: 6,
  enumerable: false
});

for (var i in o) {
  console.log(i); // 'a', 'd', Symbol 属性不会被 for...in 遍历
}

Object.keys(o); // ['a', 'd'], Symbol 属性不会被 Object.keys 遍历

o.propertyIsEnumerable('a'); // true
o.propertyIsEnumerable('b'); // false
o.propertyIsEnumerable('c'); // false
o.propertyIsEnumerable('d'); // true
o.propertyIsEnumerable(Symbol.for('e')); // true
o.propertyIsEnumerable(Symbol.for('f')); // false

// spread 运算符可获取所有 enumerable 为 true 的属性, 包括 Symbol 类型
var p = { ...o }
p.a // 1
p.b // undefined
p.c // undefined
p.d // 4
p[Symbol.for('e')] // 5
p[Symbol.for('f')] // undefined
```

**可配置描述符**

见[前文](#修改属性).

### 新增属性及其默认值
通过赋值运算符和 `Object.defineProperty()` 创建的属性, 其描述符配置的默认值是不尽相同的. 两者间的差异如下: 

```js
var o = {};

// 赋值运算:
o.a = 1;
// 等同于:
Object.defineProperty(o, 'a', {
  value: 1,
  writable: true,
  configurable: true,
  enumerable: true
});

// Object.defineProperty: ,
Object.defineProperty(o, 'a', { value: 1 });
// 等同于:
Object.defineProperty(o, 'a', {
  value: 1,
  writable: false,
  configurable: false,
  enumerable: false
});
```

### 自定义 Setters 和 Getters

下例实现了一个自我归档对象, 当设置 `temperature` 属性时, `archive` 数组会新增一条归档记录.

```js
// 归档器构造函数
function Archiver() {
  var temperature = null;
  var archive = [];

  Object.defineProperty(this, 'temperature', {
    get() {
      console.log('get!');
      return temperature;
    },
    set(value) {
      temperature = value;
      archive.push({ val: temperature });
    }
  });

  this.getArchive = function() { return archive; };
}

var arc = new Archiver();
arc.temperature; // 'get!'
arc.temperature = 11;
arc.temperature = 13;
arc.getArchive(); // [{ val: 11 }, { val: 13 }]
```

### 属性继承

若一个存取器属性被继承, 其 `get` 和 `set` 方法将在其子类实例上的属性被访问和修改时被调用. 若这些方法使用了一个全局变量来存储其属性值, 则该值为所有实例对象共享.

```js
function MyClass() {
}

var value;
Object.defineProperty(MyClass.prototype, "x", {
  get() {
    return value;
  },
  set(x) {
    value = x;
  }
});

var a = new MyClass();
var b = new MyClass();
a.x = 1;
// b 实例上的 x 也被修改了
console.log(b.x); // 1
```

为了保证实例属性与实例绑定, 可以通过将属性值存储在另一个属性上来解决. 在 `get` 和 `set` 方法中, `this` 始终指向访问属性的对象.

```js
function MyClass() {
}

Object.defineProperty(MyClass.prototype, "x", {
  get() {
    return this.stored_x || 0;
  },
  set(x) {
    this.stored_x = x;
  }
});

var a = new MyClass();
var b = new MyClass();
a.x = 1;
// b 实例上的 x 仍然是默认值
console.log(b.x); // 0
```

不同于存取器属性, 值属性总是绑定在实例对象上, 而非在类的 `prototype` 上. 当然, 若实例对象继承了一个不可写的属性, 该属性在实例对象上也是无法进行修改的. 

```js
function MyClass() {
}

// 定义值类型属性
MyClass.prototype.x = 1;
Object.defineProperty(MyClass.prototype, "y", {
  writable: false,
  value: 1
});

var a = new MyClass();
// 修改实例上的属性
a.x = 2;
// 修改成功
console.log(a.x); // 2
// 父类原型上的 x 并未被修改
console.log(MyClass.prototype.x); // 1
// 由于 y 是不可写的, 故不能被修改
a.y = 2; // 严格模式下, 会抛错
console.log(a.y); // 1
console.log(MyClass.prototype.y); // 1
```

## 延伸阅读

`Object.defineProperty()` 使得对象的属性能够被精准定义, 同时由于 JavaScript 是一门由事件驱动的编程语言, `get` 和 `set` 方法使得对象具备实现观察者模式的可能. 一个著名的实现就是 Vue.js 的[数据响应系统](https://vuejs.org/v2/guide/reactivity.html).

## 参考资料

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty

https://tc39.es/ecma262/#sec-object.defineproperty

https://vuejs.org/v2/guide/reactivity.html