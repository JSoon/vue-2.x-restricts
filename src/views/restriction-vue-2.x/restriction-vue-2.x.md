<h1>Vue 2.x 编码风格指南</h1>

<h2>文档变更日志</h2>

| 编写人员 | 修改时间   | 版本  |  更新日志
| -------- | ---------- | ----- | ------ |
| 孙靖     | 2020/05/20 | 1.0.0 |         |
| 孙靖     | 2021/07/09 | 1.0.1 | 更新标题 |
| 孙靖     | 2022/03/31 | 1.0.2 | 优化部分描述 |

<h2>目录</h2>

- [优先级级别说明](#优先级级别说明)
- [优先级 A: 极其重要 (Essential)](#优先级-a-极其重要-essential)
  - [组件名称](#组件名称)
  - [prop 属性](#prop-属性)
  - [v-for 遍历语法](#v-for-遍历语法)
  - [v-if 和 v-for](#v-if-和-v-for)
  - [模板根元素](#模板根元素)
  - [组件样式域](#组件样式域)
  - [私有属性命名](#私有属性命名)
- [优先级 B: 强烈推荐 (Strongly Recommended)](#优先级-b-强烈推荐-strongly-recommended)
  - [组件文件](#组件文件)
  - [单文件组件文件名](#单文件组件文件名)
  - [基础组件命名](#基础组件命名)
  - [单例组件命名](#单例组件命名)
  - [紧密耦合组件命名](#紧密耦合组件命名)
  - [组件名称的单词顺序](#组件名称的单词顺序)
  - [自闭合组件标签](#自闭合组件标签)
  - [模板中的组件命名](#模板中的组件命名)
  - [JS/JSX 中的组件命名](#jsjsx-中的组件命名)
  - [全词组件命名](#全词组件命名)
  - [属性命名](#属性命名)
  - [多属性元素](#多属性元素)
  - [模板中仅使用简单表达式](#模板中仅使用简单表达式)
  - [仅使用简单的computed属性](#仅使用简单的computed属性)
  - [HTML属性值](#html属性值)
  - [指令缩写](#指令缩写)
- [优先级 C & D](#优先级-c--d)
- [参考资料](#参考资料)

## 优先级级别说明

对于优先级的级别分类，并不意味着优先级低的规范就不需要强制执行，而是作为编程意识及习惯重要程度的自我认知。

该规范旨在提升Vue.js项目的代码质量，增强团队开发协作，提升项目的可维护性（包括代码可读性、移植性、向后兼容性等等）。

> 以下规范是团队关于Vue 2.x编程风格约定的基本内容，请务必严格遵循。

##  优先级 A: 极其重要 (Essential)

### 组件名称

除了根组件`App`以及Vue内置组件（如`<transition>`，`<component>`等等）外，所有组件名称需要由多个单词组成，且命名规则为Pascal命名法（a.k.a.大驼峰式）。

```js
// 全局组件
Vue.component('TodoItem', {
  // ...
})
// 单文件组件
export default {
  name: 'TodoItem',
  // ...
}
```

### prop 属性

属性定义必须使用对象格式。且包含`type`，`required`和`validator`，其中，`validator`为可选项。

```js
props: {
  status: {
    type: String,
    required: true,
    // 验证器为可选，同时，对于联合枚举类型的属性，建议进行验证
    validator: function (value) {
      return [
        'syncing',
        'synced',
        'version-conflict',
        'error'
      ].indexOf(value) !== -1
    }
  }
}
```

### v-for 遍历语法

`v-for`必须同`key`属性同时使用，以减少DOM操作，提升性能，保证对象持久性[Object Constancy](https://bost.ocks.org/mike/constancy/)。

```html
<ul>
  <li
    v-for="todo in todos"
    :key="todo.id"
  >
    {{ todo.text }}
  </li>
</ul>
```

### v-if 和 v-for

`v-if`和`v-for`一定不能出现在同一个组件上，若需使用请检查代码设计是否合理。

### 模板根元素

每个模板的根元素必须是`<div>`标签，并且`class`名称与组件文件名称保持一致，且命名规则为kebab命名法（a.k.a.烤串式）。

**CompanyCertification.vue**

```html
<template>
  <div class="company-certification">
  	<button class="button button-close">X</button>
  </div>
</template>
```

### 组件样式域

对于单文件组件，必须添加样式域。同时，所有组件样式必须包裹在根元素样式下。

此外，如果需要样式穿透(覆盖子组件样式)，请使用[深度选择器](https://vue-loader.vuejs.org/guide/scoped-css.html#deep-selectors)。

```html
<template>
	<div class="my-dialog">
  	<button class="button button-close">X</button>
  </div>
</template>

<!-- 使用`scoped`属性 -->
<style lang="scss" scoped>
.my-dialog {
  .button {
    border: none;
    border-radius: 2px;
  }

  .button-close {
  	background-color: red;
  }
}
</style>

<!-- 或者使用深度选择器 -->
<style lang="scss" scoped>
.my-dialog::v-deep {
  .button {
    border: none;
    border-radius: 2px;
  }

  .button-close {
  	background-color: red;
  }
}
</style>
```

### 私有属性命名

所有[mixin](https://vuejs.org/v2/guide/mixins.html)，[plugin](https://vuejs.org/v2/guide/plugins.html)等等可复用的功能元件的自定义私有属性，都只能定义在元件内部，原则上对外都不能被访问。如果需要被访问，必须加上`$_yourMixinOrPluginName_`名称域前缀，以减少与其他协同开发者代码, 以及Vue.js本身对象原型链上的私有属性之间可能产生的命名冲突。

> 在 Vue.js 源码中, 使用 `_` 前缀来定义私有属性, `$` 前缀来定义暴露给用户的特殊实例属性.

```js
// mixin
const myGreatMixin = {
  // ...
  methods: {
    publicMethod() {
      // ...
      myPrivateFunction()
    }
  }
}

// 定义为内部函数
function myPrivateFunction() {
  // ...
}
```

或者：

```js
// mixin
const myGreatMixin = {
  // ...
  methods: {
    // 添加命名前缀
    $_myGreatMixin_update: function () {
      // ...
    }
  }
}
```

## 优先级 B: 强烈推荐 (Strongly Recommended)

### 组件文件

每个组件都需要保存在单独的文件中，无论该组件为[全局组件](https://vuejs.org/v2/guide/components.html)或是[单文件组件](https://vuejs.org/v2/guide/single-file-components.html)。

```
// 全局组件
components/
|- TodoList.js
|- TodoItem.js

// 单文件组件
components/
|- TodoList.vue
|- TodoItem.vue
```

### 单文件组件文件名

组件文件命名规则必须使用Pascal命名法，且与组件名保持一致。

```
components/
|- MyComponent.vue
```

**MyComponent.vue**

```js
export default {
  name: 'MyComponent',
  // ...
}
```

### 基础组件命名

基础组件命名必须以特定前缀开头，如`Base`，`App`，或者`V`。

```
components/
|- BaseButton.vue
|- BaseTable.vue
|- BaseIcon.vue
// Or
components/
|- AppButton.vue
|- AppTable.vue
|- AppIcon.vue
// Or
components/
|- VButton.vue
|- VTable.vue
|- VIcon.vue
```

### 单例组件命名

单例组件必须以`The`前缀开头。

```
components/
|- TheHeading.vue
|- TheSidebar.vue
```

### 紧密耦合组件命名

紧密耦合的组件需要在名称前加上父组件名作为前缀。

```
components/
|- TodoList.vue // 父组件
|- TodoListItem.vue // TodoList子组件
|- TodoListItemButton.vue // TodoList子组件

components/
|- SearchSidebar.vue // 父组件
|- SearchSidebarNavigation.vue // SearchSidebar子组件
```

### 组件名称的单词顺序

组件名称的单词顺序必须以上下文联系最紧密的名词开头，然后加上限定词。

> 请务必不要使用自然语言的语法顺序，这样会影响文件在IDE中的排序。

```
// 所有与搜索相关的组件，都以`Search`开头；与设置相关的组件，都以`Settings`开头
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputExcludeGlob.vue
|- SearchInputQuery.vue
|- SettingsCheckboxLaunchOnStartup.vue
|- SettingsCheckboxTerms.vue
```

### 自闭合组件标签

在单文件组件、字符串模板和JSX文件中，没有slot内容的组件，应该进行自闭合。

在DOM模板中的无内容组件，不要进行自闭合(HTML规范中也只允许["void"元素](https://html.spec.whatwg.org/multipage/syntax.html#void-elements))。

```html
<!-- 单文件组件，字符串模板，JSX文件 -->
<MyComponent />
<!-- DOM模板 -->
<my-component></my-component>
```

### 模板中的组件命名

模板中的组件命名必须使用Pascal命名法（DOM模板除外）。

```html
<!-- 单文件组件，字符串模板，JSX文件 -->
<MyComponent />
<MyComponent>Content</MyComponent>
<!-- DOM模板 -->
<my-component></my-component>
```

延伸阅读: [为什么应当避免使用 DOM Templates？](https://vuejsdevelopers.com/2017/09/17/vue-js-avoid-dom-templates/)

### JS/JSX 中的组件命名

同模板中的组件命名。

### 全词组件命名

组件的命名绝大多数情况下，必须使用全词命名，不使用缩写命名，以增强可读性。

```
components/
|- StudentDashboardSettings.vue
|- UserProfileOptions.vue
```

### 属性命名

属性命名在`props`中必须使用小驼峰式。在模板和JSX中，请使用烤串式。

```js
props: {
  greetingText: {
    type: String,
    required: true,
  }
}
```

```html
<WelcomeMessage greeting-text="hi"/>
```

### 多属性元素

拥有多个属性的元素，其属性应该各自写在单独一排。

```html
<img
  src="https://vuejs.org/images/logo.png"
  alt="Vue Logo"
>

<MyComponent
  foo="a"
  bar="b"
  baz="c"
/>
```

### 模板中仅使用简单表达式

组件模板中只能包含简单表达式，复杂的表达式放入`method`或`computed`中进行计算。

```html
<!-- In a template -->
{{ normalizedFullName }}
```

```js
// The complex expression has been moved to a computed property
computed: {
  normalizedFullName: function () {
    return this.fullName.split(' ').map(function (word) {
      return word[0].toUpperCase() + word.slice(1)
    }).join(' ')
  }
}
```

### 仅使用简单的computed属性

复杂的`computed`应该拆分成多个简单计算属性。

```js
computed: {
  basePrice: function () {
    return this.manufactureCost / (1 - this.profitMargin)
  },
  discount: function () {
    return this.basePrice * (this.discountPercent || 0)
  },
  finalPrice: function () {
    return this.basePrice - this.discount
  }
}
```

### HTML属性值

非空的HTML属性值必须包裹在双引号中。

```html
<input type="text" disabled>
<AppSidebar :style="{ width: sidebarWidth + 'px' or `${sidebarWidth}px` }">
```

### 指令缩写

所有指令统一采用缩写形式。

```html
<!-- v-bind -->
<input
  :value="newTodoText"
  :placeholder="newTodoInstructions"
>
<!-- v-on -->
<input
  @input="onInput"
  @focus="onFocus"
>
<!-- v-slot -->
<template #header>
  <h1>Here might be a page title</h1>
</template>
<template #footer>
  <p>Here's some contact info</p>
</template>
```

## 优先级 C & D

优先级 A 和 B 中，已经囊括了绝大部分可能影响代码质量和维护性的规则，所以不再进一步对编码规范进行约束。同时，通过对项目进行 eslint 和 hook 配置，很大程度上能够保障这些编码规范得到执行，最大限度避免不合理代码的上传。

## 参考资料

[Vue Style Guide](https://v2.vuejs.org/v2/style-guide/) (英文文档)

[Vue 代码风格指南](https://cn.vuejs.org/v2/style-guide/index.html) (中文文档)





















