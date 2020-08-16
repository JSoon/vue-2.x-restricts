<h1>SPA 应用在 H5 history 模式下的 Nginx 服务端配置</h1>

<h2>目录</h2>

- [问题背景](#问题背景)
- [解决思路](#解决思路)
- [Nginx配置](#nginx配置)
- [上述配置在服务端的解析过程](#上述配置在服务端的解析过程)
- [参考资料](#参考资料)

## 问题背景

在单页面应用中(下文统称SPA), 通常存在两种路由模式: `hash`和`history`. 其中, `history`模式使用了HTML5的`history.pushState`接口, 用于达到不刷新页面而进行路由导航的目的. 从而也带来了一个问题, 由于SPA是一个客户端应用(即除根路径外, 其他路由均由HTML5的history接口实现), 当我们在浏览器中直接访问路由中的某一个子路径时, 例如: `http://oursite.com/user/id`, 如果在服务端没有进行正确的配置, 会得到一个404的错误响应.

## 解决思路

为了解决上述问题, 我们所要做的就是在服务端增加一个简单的用于捕获所有客户端请求的备用配置. 即当一个请求地址没有匹配到任何静态资源时, 则始终将SPA应用的入口页面(通常为`index.html`)作为该请求的响应内容. 从而`http://oursite.com/user/id`始终访问的是入口页面, 而`/user/id`也始终通过`history`模式的客户端路由, 从而得到正确的响应结果.

## Nginx配置

**常规配置**

如果SPA运行在服务端的根路由下, 即`/`, 则使用以下配置:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

**带有publicPath的配置**

如果SPA运行在特定的发布路径下, 如`/h5`, 则参考以下配置:

```nginx
location /h5 {
  alias     /disk/path/to/dist;
  try_files $uri $uri/ /h5/index.html;
}
```

上述配置中, `$uri`为Nginx的统一资源标识符变量, 其值等于请求的资源地址, 例如:

当访问`http://oursite.com/h5/user/id?foo=1`时, `$uri`等于`/h5/user/id`.

这里需要注意一下`$uri`同`$request_uri`变量间的区别:

`$uri`是一个经过标准化后的值, 具有以下特点:

- 移除了URL中的`?`及其query string
- 连续的`/`会被替换为单个的`/`
- URL中所有被编码的字符都会被解码

相较`$uri`, `$request_uri`的值不会进行任何的标准化处理, 其完全等于原始请求的URL.

## 上述配置在服务端的解析过程

1. 访问`http://oursite.com/h5/user/id`
2. `$uri`: 搜索名为`/disk/path/to/dist/user/id`的文件(`alias+$uri`). 如果没有该文件, 则进行下一步
3. `$uri/`: 搜索名为`/disk/path/to/dist/user/id`的文件夹(`alias+$uri/`). 如果没有该文件夹, 则进行下一步
4. `/h5/index.html`: 访问`/h5/index.html`, 即`/disk/path/to/dist/index.html`(`alias+$uri`, 此时的`$uri`等于`/h5/index.html`)

> 结果: 当访问`http://oursite.com/h5/user/id`时, 始终返回SPA的首页, 这样便始终能够使用客户端路由进行导航了.

## 参考资料

[HTML5 History Mode](https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations)

[Trying Several Options](https://docs.nginx.com/nginx/admin-guide/web-server/serving-static-content/#trying-several-options)

[NGINX $request_uri vs $uri](https://stackoverflow.com/questions/48708361/nginx-request-uri-vs-uri/48709976)

[Nginx: When the `index` and `try_files` in the same block, why the `try_files` will be processed, not the `index` directive?
](https://stackoverflow.com/questions/36175676/nginx-when-the-index-and-try-files-in-the-same-block-why-the-try-files-w)

[Nginx之location 匹配规则详解](https://blog.51cto.com/11935263/2074602)

[Nginx变量索引-$uri](http://nginx.org/en/docs/http/ngx_http_core_module.html#var_uri)