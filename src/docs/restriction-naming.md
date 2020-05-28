<h1>命名规范</h1>

<h2>文档变更日志</h2>

| 编写人员 | 修改时间   | 版本  |
| -------- | ---------- | ----- |
| 孙靖     | 2020/05/27 | 1.0.0 |

<h2>目录</h2>

- [规范说明](#规范说明)
- [文件夹命名](#文件夹命名)
- [文件命名](#文件命名)
  - [图片文件命名](#图片文件命名)
  - [JS / CSS 文件命名](#js--css-文件命名)
- [ID命名](#id命名)
- [ClassName命名](#classname命名)
  - [常用命名推荐](#常用命名推荐)
  - [不应当使用的命名](#不应当使用的命名)

## 规范说明

命名规范用于约束并规范由于项目历史原因以及个人习惯引起的各种命名不统一, 造成不同团队成员在维护同一项目或者业务模块时效率低下, 从而使得项目开发, 迭代, 维护成本极高. 其中包括:

1. 文件夹命名
2. 文件命名
3. ID命名
4. ClassName命名

## 文件夹命名

文件夹命名使用Kebab命名法.

```
src/parent-folder-name/child-folder-name
```

## 文件命名

文件命名使用Kebab命名法.

### 图片文件命名

**命名公式**

```
// 按顺序命名
所属业务(可选) + 模块名称(可选) + 图片功能(必选) + 图片修饰(可选) + 像素比率(可选)
```

**所属业务**

- 首页: `home`
- 店铺: `store`
- 拍卖场: `auction`
- ...

**模块名称**

- 分类菜单: `category-menu`
- 搜索栏: `search-bar`
- 公告栏: `bulletin`
- ...

**图片功能**

- 公共类: `common`
- 背景类: `bg`
- 图标类: `icon`
- logo类: `logo`
- 雪碧图类: `sprites`
- 按钮类: `btn`
- ...

**图片修饰**: 用于修饰图片当前状态的单词

- 正常: `normal`
- 悬浮: `hover`
- 激活: `active`
- 禁用: `disabled`
- 大: `large`
- 小: `small`
- ...

**像素比率**

- 普通屏幕: `无`
- 视网膜屏幕: `@2x`
- ...

**范例**

```
// 首页背景图
home-bg.jpg
// 首页分类菜单背景图
home-category-menu-bg.png
// 搜索栏提交按钮 - 正常状态
search-bar-submit-btn.jpg
// 搜索栏提交按钮 - 禁用状态
search-bar-submit-btn-disabled.jpg
// 网站logo
logo-large.png
// 网站logo - retina
logo-large@2x.png
```

### JS / CSS 文件命名

一般来说, JS和CSS文件都与业务关系紧密, 所以在命名时需要加上相关业务前缀.

若是公共模块, 则不需要添加业务前缀. 若是功能性模块, 则只需要以功能命名文件.

**命名公式**

```
所属业务(可选) + 模块名称(可选) + 模块功能(可选)
```

**范例**

```
// 首页 (业务模块)
home.js
// 首页搜索栏 (业务模块)
home-search-bar.js
// 时间格式转换 - 毫秒转UTC日期 (工具模块)
millisecond-to-UTC.js
// 验证器 (工具模块)
validator.js
```

## ID命名

HTML元素ID命名使用Pascal命名法(a.k.a.大驼峰式), 同时需要添加前缀`J_`, 用于标识该元素同JavaScript操作相关.

> 注: 除不可抗拒原因外, ID选择器不能够用于CSS样式.

**命名公式**

```
所属业务(可选) + 模块名称(可选) + HTML元素功能(可选)
```

**所属业务**

- 同图片命名规则

**模块名称**

- 同图片命名规则

**HTML元素功能**

- 表单提交: `submit`
- 表单取消: `cancel`
- 视图切换: `switch`

**范例**

```html
<header id="J_TheHeader">
	<nav id="J_TheNav"></nav>
  <form>
    <input type="text" placeholder="请输入搜索材料关键字" />
    <button id="J_HeaderSearchFormSubmit">搜索</button>
  </form>
</header>

<script>
const theHeader = document.querySelector('#J_TheHeader');
const theNav = document.querySelector('#J_TheNav');
</script>
```

## ClassName命名

HTML元素ClassName命名使用Kebab命名法(a.k.a.烤串式), 若与JavaScript操作相关, 则同ID命名法.

**命名公式**

```
所属业务(可选) + 模块名称(可选) + HTML元素功能(必选)
```

**所属业务**

- 同图片命名规则

**模块名称**

- 同图片命名规则

**HTML元素功能**

- 表单提交: `submit`
- 表单取消: `cancel`
- 视图切换: `switch`

**范例**

```html
<div class="page-home">
  <main>
    <section class="content-box J_ContentBox"></section>
    <section class="content-box J_ContentBox"></section>
    <div class="recommend-goods-list">
      <form class="recommend-goods-search-bar">
        <input type="text" placeholder="请输入商品关键字" />
        <button type="submit" class="recommend-goods-search-btn-submit">搜索</button>
        <button type="reset" class="recommend-goods-search-btn-reset">重置</button>
      </form>
    </div>
  </main>
</div>

<script>
const contentBoxes = document.querySelectorAll('.J_ContentBox');
contentBoxes.forEach((ele, idx) => {
	ele.innerHTML = `Content ${idx}`;
});
</script>
```

### 常用命名推荐

以下是常用ClassName命名单词, 供参考.

| ClassName | 含义 |
| --- | --- |
| about | 关于 |
| account | 账户 |
| arrow | 箭头图标 |
| article	| 文章 |
| aside	| 边栏 |
| audio	| 音频 |
| avatar	| 头像 |
| bg,background	| 背景 |
| bar	| 栏（工具类） |
| branding	| 品牌化 |
| crumb,breadcrumbs	| 面包屑 |
| btn,button	| 按钮 |
| caption	| 标题，说明 |
| category	| 分类 |
| chart	| 图表 |
| clearfix	| 清除浮动 |
| close	| 关闭 |
| col,column	| 列 |
| comment	| 评论 |
| community	| 社区 |
| container	| 容器 |
| content	| 内容 |
| copyright	| 版权 |
| current	| 当前态，选中态 |
| default	| 默认 |
| description	| 描述 |
| details	| 细节 |
| disabled	| 不可用 |
| error	| 错误 |
| even	| 偶数，常用于多行列表或表格中 |
| fail	| 失败（提示） |
| feature	| 专题 |
| field	| 用于表单的输入区域 |
| figure	| 图 |
| filter	| 筛选 |
| first	| 第一个，常用于列表中 |
| fold	| 收起 |
| footer	| 页脚 |
| forum	| 论坛 |
| gallery	| 画廊 |
| group	| 分组 |
| header	| 页头 |
| help	| 帮助 |
| hide	| 隐藏 |
| hightlight	| 高亮 |
| home	| 主页 |
| icon	| 图标 |
| info,information	| 信息 |
| last	| 最后一个，常用于列表中 |
| links	| 链接 |
| login	| 登录 |
| logout	| 退出 |
| logo	| 标志 |
| main	| 主体 |
| menu	| 菜单 |
| meta	| 作者、更新时间等信息栏，一般位于标题之下 |
| module	| 模块 |
| more	| 更多（展开） |
| msg,message	| 消息 |
| nav,navigation	| 导航 |
| prev | 上一页 |
| next	| 下一页 |
| nub	| 小块 |
| odd	| 奇数，常用于多行列表或表格中 |
| off	| 鼠标离开 |
| on	| 鼠标移过 |
| output	| 输出 |
| pagination	| 分页 |
| pop,popup	| 弹窗 |
| preview	| 预览 |
| previous	| 上一页 |
| primary	| 主要 |
| progress	| 进度条 |
| promotion	| 促销 |
| recommend,recommendations	| 推荐 |
| reg,register	| 注册 |
| save	| 保存 |
| search	| 搜索 |
| secondary	| 次要 |
| section	| 区块 |
| selected	| 已选 |
| share	| 分享 |
| show	| 显示 |
| sidebar	| 边栏，侧栏 |
| slide	| 幻灯片，图片切换 |
| sort	| 排序 |
| sub	| 次级的，子级的 |
| submit	| 提交 |
| subscribe	| 订阅 |
| subtitle	| 副标题 |
| success	| 成功（提示） |
| summary	| 摘要 |
| tab	| 标签页 |
| table	| 表格 |
| txt,text	| 文本 |
| thumbnail	| 缩略图 |
| time	| 时间 |
| tips	| 提示 |
| title	| 标题 |
| video	| 视频 |
| wrap	| 容器，包，一般用于最外层 |
| wrapper	| 容器，包，一般用于最外层 |

### 不应当使用的命名

```html
<!-- 敏感且不和谐名称 -->
<div class="fuck"></div>
<div class="jier"></div>
<div class="gg"></div>
<div class="sm"></div> 
<div class="gcd"></div> 
<div class="kmt"></div> 
<div class="ass"></div>
...
<!-- 汉语拼音 & 中英混搭 -->
<div class="ye-tou"></div>
<div class="lun-bo-tu"></div>
<div class="tui-jian-list"></div>
<div class="footer-ban-quan"></div>
...
<!-- 潜在可能的广告关键字 -->
<div class="ad"></div>
<div class="advertise"></div>
<div class="advertisement"></div>
<div class="banner-ad"></div>
...
```

更多关于广告插件拦截的关键字, 详细资料请参考[这里](https://easylist.to/).