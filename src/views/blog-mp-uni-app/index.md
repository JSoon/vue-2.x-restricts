<h1>微信小程序 & uni-app 问题集合以及解决方案</h1>

<h2>目录</h2>

- [问题集合](#问题集合)
  - [像素单位](#像素单位)
  - [[原生] 阻止事件冒泡](#原生-阻止事件冒泡)
  - [原生组件导致的兼容问题](#原生组件导致的兼容问题)
  - [自定义导航 fixed 导致 iOS 下滚动时背景随页面移位](#自定义导航-fixed-导致-ios-下滚动时背景随页面移位)
  - [[uni] 样式穿透](#uni-样式穿透)
  - [[uni] 运行时主包大小超限制导致真机预览失败](#uni-运行时主包大小超限制导致真机预览失败)
- [参考资料](#参考资料)

## 问题集合

### 像素单位

原生开发全部使用 `rpx`.

uni-app 开发在 `<style>` 中使用 `upx`, 在 `<template>` 和 `<script>` 中使用 `rpx`.

### [原生] 阻止事件冒泡

使用 catchtap. 

> 除 bind 外，也可以用 catch 来绑定事件。与 bind 不同， catch 会阻止事件向上冒泡。

https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxml/event.html

### 原生组件导致的兼容问题

[微信小程序 - 原生组件采坑记录](http://jsoon.fun/JiaHua-Front-End-Coding-Guide/views/blog-miniprogram-native-component/blog-miniprogram-native-component.html)

### 自定义导航 fixed 导致 iOS 下滚动时背景随页面移位

在使用自定义导航 fixed 布局时, 需将背景设置在 fixed 元素上, 否则, 由于 iOS 存在弹性交互效果, 设置在非 fixed 元素上(如父元素节点)会造成背景随 Page 移位的情况. 此类兼容问题适用于所有 fixed 布局元素.

[微信小程序 - WeUI 自定义顶部导航](http://jsoon.fun/JiaHua-Front-End-Coding-Guide/views/blog-miniprogram-custom-navigation/blog-miniprogram-custom-navigation.html)

### [uni] 样式穿透

uni-app 使用 Vue.js 进行开发, 所以在样式穿透时仍然使用 `::v-deep` 修饰符. 需注意的是, 因为在运行时本质上代码还是原生小程序, 所以在多层级的嵌套组件中, 仍需使用小程序的 `options.styleIsolation` 配置项. 

```javascript
export default {  
  options: { styleIsolation: 'shared' },
  // ...
}
```

具体规则如下:

- 页面样式穿透页面组件, 无需配置 `options.styleIsolation`
```javascript
// Router Page
<template>
  <view class="page">
    <ParentComponent />
  </view>
</template>
<style lang="scss">
.page::v-deep {
  .parent-component {
    color: red;
  }
}
</style>

// ParentComponent
<template>
  <view class="parent-component">
  </view>
</template>
```
- 父组件样式穿透子组件, 须给父组件配置 `options.styleIsolation`
```javascript
// Router Page
<template>
  <view class="page">
    <ParentComponent />
  </view>
</template>

// ParentComponent
<template>
  <view class="parent-component">
    <ChildComponent />
  </view>
</template>
<script>
export default {
  options: {
    styleIsolation: 'shared'
  }
}
</script>
<style lang="scss">
.parent-component::v-deep {
  .child-component {
    color: green;
  }
}
</style>

// ChildComponent
<template>
  <view class="child-component">
  </view>
</template>
```

[自定义组件-组件模板和样式](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/wxml-wxss.html#组件样式隔离)

https://ask.dcloud.net.cn/question/73797

### [uni] 运行时主包大小超限制导致真机预览失败



## 参考资料
