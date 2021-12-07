<h1>Electron Mac 应用代码签名</h1>

<h2>目录</h2>

- [写在前面](#写在前面)
- [问题集合](#问题集合)
  - [钥匙链中已将证书设置为信任, 但构建时依然提示证书不合法](#钥匙链中已将证书设置为信任-但构建时依然提示证书不合法)

## 写在前面

Electron 多种打包工具, 都提供了代码签名的功能, 开发者所需要做的就是提供代码签名的证书. 互联网上相关文章有很多, 这里推荐一篇比较详细的: [electronr进行签名与公证](https://www.cnblogs.com/mmykdbc/p/11468908.html). 具体操作不在本文进行详述.

## 问题集合

### 钥匙链中已将证书设置为信任, 但构建时依然提示证书不合法

该问题由苹果全球开发者中间证书(Apple WWDRCA)升级导致, 查看钥匙链中的证书, 虽然当前的过期日期是 February 7, 2023, 但是 Developer ID Application 等相关证书却默认已不被系统信任. 就算手动设置成了信任, 在代码签名阶段, 仍然不能签名成功.

解决方法是下载安装最新的 [G3 证书](https://www.apple.com/certificateauthority/).

相关资料:

[iO证书不受信任的原因及解决方案](https://www.jianshu.com/p/af6acf3cd484)

[Apple Worldwide Developer Relations Intermediate Certificate updates](https://developer.apple.com/support/wwdr-intermediate-certificate/)

[Apple Worldwide Developer Relations Intermediate Certificate Expiration](https://developer.apple.com/support/expiration/)

