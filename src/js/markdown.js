// highlight.js 配置
if (window.marked) {
  window.marked.setOptions({
    langPrefix: 'hljs ',
    highlight: function (code, language) {
      const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
      return hljs.highlight(validLanguage, code).value;
    },
  });
}

// 回到顶部 & 回到首页
(function () {
  // 回到顶部
  var eleScroll2Top = document.createElement('div');
  eleScroll2Top.className = 'tool-item scroll-2-top';
  eleScroll2Top.innerHTML = '↑';
  eleScroll2Top.title = '回到顶部';

  eleScroll2Top.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, false);

  // 回到首页
  var eleBack2Home = document.createElement('div');
  eleBack2Home.className = 'tool-item back-2-home';
  eleBack2Home.innerHTML = '首页';
  eleBack2Home.title = '回到首页';

  eleBack2Home.addEventListener('click', function () {
    window.location.href = '/front-end'
  }, false);

  // 联系邮箱
  var eleEmailAt = document.createElement('a');
  eleEmailAt.className = 'tool-item email-at';
  eleEmailAt.innerHTML = '邮箱';
  eleEmailAt.title = '联系邮箱';
  eleEmailAt.href = 'mailto:serdeemail@gmail.com';
  
  // 右下角工具条
  var toolbar = document.createElement('div')
  toolbar.className = 'toolbar'
  toolbar.appendChild(eleBack2Home);
  toolbar.appendChild(eleEmailAt);
  toolbar.appendChild(eleScroll2Top);
  document.body.appendChild(toolbar);
})();