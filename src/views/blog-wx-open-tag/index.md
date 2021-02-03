<h1>微信网页 - 开放标签</h1>

<h2>目录</h2>

- [问题背景](#问题背景)
- [兼容性](#兼容性)
- [常规准备工作](#常规准备工作)
- [坑来了](#坑来了)
  - [微信开发者工具, 无法调试开放标签](#微信开发者工具-无法调试开放标签)
  - [Vue, React 等 MVVM 框架 `<template></template>` 内容不显示](#vue-react-等-mvvm-框架-templatetemplate-内容不显示)
  - [页面样式无法作用在模板中的 HTML 元素上](#页面样式无法作用在模板中的-html-元素上)
  - [代码正确, 但开放标签内容不显示](#代码正确-但开放标签内容不显示)
  - [`checkJsApi` 无法检测当前客户端版本是否支持开放标签](#checkjsapi-无法检测当前客户端版本是否支持开放标签)
  - [iOS 下抛错: JS-SDK 签名不合法](#ios-下抛错-js-sdk-签名不合法)
- [参考资料](#参考资料)

## 问题背景
[开放标签](https://developers.weixin.qq.com/doc/oplatform/Mobile_App/WeChat_H5_Launch_APP.html) 是微信开放平台于2020年5月发布的一项开放能力, 功能介绍如下:

> 在部分场景下，用户在微信内访问网页时需要跳转到 APP 使用完整服务，为此我们提供了“微信开放标签”以满足微信内网页跳转到 APP 的需求。 微信内网页跳转 APP 功能已向全体开发者开放，当用户访问已认证服务号的 JS 接口安全域名时，可以通过“微信开放标签”打开符合条件的 APP 。

在开放标签出现以前, 若开发者希望由微信网页跳转到App, 主要通过以下渠道:

**Android**
- 跳转到应用宝
- 引导用户"右上角用手机浏览器打开", 然后使用系统 URL Scheme
- 下载链接, 会被微信拦截, 强制下载QQ浏览器

**iOS**
- 跳转到应用宝
- 引导用户"右上角用手机浏览器打开", 然后:
  - iOS 9 以前: 系统 URL Scheme
  - iOS 9 以后: Universal Links

> 注1: 由于浏览器无法得知手机是否安装了该 Scheme 对应的 App, 也无法监听 App 是否被打开, 所以通常使用定时器的方法进行推断, 即设定时间内, 若 App 未打开, 则认为 App 未安装/未打开, 并跳转到下载页.
> 
> 注2: Android 和 iOS 浏览器下定时器在进入 App 后是否会暂停/延后执行也无法保证, 故也可以通过监听 `visibilitychange` 事件, 来进行推断.

上面的逻辑不仅繁杂, 且不同操作系统, 不同浏览器下, 兼容性和稳定性也是难以保证. 开放标签的出现, 即是为了解决这一痛点而实现的统一解决方案. 本文仅关于开放标签的接入进行描述, 上述渠道的实现请参考以下资料:

[微信浏览器里app内打开怎么实现的？](https://www.zhihu.com/question/309524678)

[如何解决手机浏览器打开客户端APP的问题？](https://www.zhihu.com/question/23154151/answer/376380218)

[iOS H5打开App(通用链接)](https://www.jianshu.com/p/0ead88409212)

## 兼容性

微信开放标签有最低的微信版本要求，以及最低的系统版本要求。

微信版本要求为：7.0.12及以上。 系统版本要求为：iOS 10.3及以上、Android 5.0及以上。

**参考代码**
```js
/**
 * 是否是微信浏览器
 */
function isWeixinBrowser() {
  const ua = navigator.userAgent.toLowerCase()
  return !!(/micromessenger/.test(ua))
}

/**
 * 是否支持开放标签
 * https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_Open_Tag.html
 * 微信版本要求为：7.0.12及以上。 系统版本要求为：iOS 10.3及以上、Android 5.0及以上
 * https://tongji.baidu.com/research/app?source=index
 * 综合操作系统市场份额考虑, 这里仅判断微信版本
 */
function checkOpenTag() {
  const wechat = navigator.userAgent.match(/MicroMessenger\/([\d.]+)/i)
  const version = wechat?.[1]?.split('.')

  if (!version) {
    return false
  }

  if (version[0] >= 7) {
    if (version[0] > 7) {
      return true
    }
    if (version[1] >= 0) {
      if (version[1] > 0) {
        return true
      }
      if (version[2] >= 12) {
        return true
      }
    }
  }

  return false
}

export {
  isWeixinBrowser,
  checkOpenTag,
}
```

## 常规准备工作

1. 绑定域名

登录[微信公众平台](https://mp.weixin.qq.com/)进入“公众号设置”的“功能设置”里填写“JS接口安全域名”。

2. 引入 JS-SDK

在需要调用JS接口的页面引入如下JS文件：http://res.wx.qq.com/open/js/jweixin-1.6.0.js （支持https）

如需进一步提升服务稳定性，当上述资源不可访问时，可改访问：http://res2.wx.qq.com/open/js/jweixin-1.6.0.js （支持https）

备注：支持使用 AMD/CMD 标准模块加载方法加载。

> 不推荐, 毕竟经 gzip 后 JS-SDK 总共也就 4.5kb

3. 通过config接口注入权限验证配置并申请所需开放标签

与使用JS-SDK配置方式相同，所有需要使用开放标签的页面必须先注入配置信息，并通过openTagList字段申请所需要的开放标签，否则将无法使用（同一个url仅需调用一次）。开放标签的申请和JS接口的申请相互独立，因此是可以同时申请的。

```js
// 1. 获取签名数据
// 由开发者服务器生成
// ...

// 2. 进行权限注入
wx.config({
  debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印
  appId: '', // 必填，公众号的唯一标识
  timestamp: , // 必填，生成签名的时间戳 (注: 请生成10位时间戳)
  nonceStr: '', // 必填，生成签名的随机串
  signature: '',// 必填，签名
  jsApiList: [], // 必填，需要使用的JS接口列表
  openTagList: [] // 可选，需要使用的开放标签列表，例如['wx-open-launch-app']
});
```

> 注1: 这一步中, 开发者服务器使用的是普通 access_token, 请注意[区别用户授权 access_token](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html).
> 
> 注2: 同时, timestamp 最大为10位, 这一点虽微信官方文档未明确提及, 但可以在[微信 JS 接口签名校验工具](https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=jsapisign)中, timestamp 一栏中输入从而验证.

4. 通过ready接口处理成功验证

```js
wx.ready(function () {
  // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中
});
```

5. 通过error接口处理失败验证

```js
wx.error(function (res) {
  // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名
});
```

## 坑来了

上面的常规操作, 仅仅是保证能够获得 JS-SDK 的调用权, 在真正能够使用开放标签达到预期目的前, 还需要趟过以下几个坑点:

### 微信开发者工具, 无法调试开放标签

是的, 重要的事情说三遍, 不要惊讶, 不要惊讶, 不要惊讶, 欲对开放标签进行本地调试, 只能通过真机进行, 为此你可能需要完成一系列的前置操作, 例如安全域名绑定, 修改 host, nginx 反向代理, etc. 😁

或者, 也可以使用[公众平台测试沙盒](http://mp.weixin.qq.com/debug/cgi-bin/sandboxinfo?action=showinfo&t=sandbox/index)来进行调试 (u r welcome BTW).

### Vue, React 等 MVVM 框架 `<template></template>` 内容不显示

在此类视图模板中请使用 `<script type="text/wxtag-template"><script>`, 避免与 MVVM 框架的 `<template>` 标签冲突.

```html
// Vue.js
<templte>
  <wx-open-launch-app
    id="launch-btn"
    appid="your-appid"
    extinfo="your-extinfo"
  >
    <script type="text/wxtag-template">
      <style>.btn { padding: 12px }</style>
      <button class="btn">打开App</button>
    <script>
  </wx-open-launch-app>
</template>
```

### 页面样式无法作用在模板中的 HTML 元素上

微信开放标签使用了类似 [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) 的技术对开放标签内容进行组装和渲染 (说是类似, 是因为无法窥探其内部实现), 其插槽中模版的样式是和页面隔离的，因此需要注意在插槽中定义模版的样式. 也就意味着, 开发者需要维护两套样式 (微信H5中的开放标签和常规H5中的非开放标签), 尽管两套样式的代码应当保持一致.

> 注1: 页面中与布局和定位相关的样式，如 `position: fixed; top -100;` 等，尽量不要写在插槽模版的节点中，请声明在标签或其父节点上.
> 
> 注2: 对于有 [CSP](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP) 要求的页面，需要添加白名单 `frame-src https://*.qq.com webcompt:`，才能在页面中正常使用开放标签.

### 代码正确, 但开放标签内容不显示

若是SPA应用, 需在路由卫士中进行接口config配置注入, 代码如下:

```js
// 伪代码
router.afterEach(async (to) => {
  wx.config({
    debug: false,
    appId: '',
    timestamp: ,
    nonceStr: '',
    signature: '',
    jsApiList: [],
    openTagList: ['wx-open-launch-app']
  });
})
```

若仅需注入开放标签, 则同时需保证 `jsApiList` 不为空, 否则开放标签也无法渲染, 上面的代码需变为:

```js
// 伪代码
router.afterEach(async (to) => {
  wx.config({
    debug: false,
    appId: '',
    timestamp: ,
    nonceStr: '',
    signature: '',
    jsApiList: ['Mother Fucker'],
    openTagList: ['wx-open-launch-app']
  });
})
```

### `checkJsApi` 无法检测当前客户端版本是否支持开放标签

`checkJsApi` 仅能检测当前客户端版本是否支持 `jsApiList[]` 中的接口, 无法检测 `openTagList[]` 中的接口. 检测当前客户端版本是否支持开放标签的代码请参考[兼容性](#兼容性)一节.

> 注：checkJsApi接口是客户端6.0.2新引入的一个预留接口，第一期开放的接口均可不使用checkJsApi来检测。jssdk都是兼容低版本的，不需要第三方自己额外做更多工作，但有的接口是6.0.2新引入的，只有新版才可调用。

### iOS 下抛错: JS-SDK 签名不合法

通常情况下, 服务端通过获取 HTTP 报头中的 `Referer` 字段来设置签名所需的网址, 但是对于运行在 iOS 下的 SPA 应用, `Referer` 始终为其首页地址, 这就会导致下例问题:

首页: A

使用 JS-SDK 的目标页: B

在 iOS 下, 直接访问 B 页面, 此时服务端获取 `Referer` 作为签名网址, 然后将签名信息返回给 B 页面, 同时 B 页面拿到签名信息, 调用 `wx.config` 进行接口注入. 由于当前 `window.location.href` 不等于签名时所使用的 `Referer` 地址, 则会导致客户端抛出 `invalid signature` 异常, 从而无法使用 JS-SDK.

所以为了兼容 iOS, 则需要手动设置所需签名的网址为 `window.location.href`:

```js
// 伪代码
import axios from 'axios'

const getWxConfig = () => {
  return axios({
    method: 'GET',
    url: '/get/wxSDKConfig',
    data: {
      url: window.location.href
    }
  })
}
```

## 参考资料

[开放标签说明文档](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_Open_Tag.html)

[在微信中直接打开APP？](https://www.zhihu.com/question/288231239/answer/1384018426)

[微信开放标签wx-open-launch-app](https://blog.csdn.net/qq285679784/article/details/108504148)
