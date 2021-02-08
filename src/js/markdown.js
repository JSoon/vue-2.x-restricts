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

// 回到顶部
(function () {
  var ele = document.createElement('div');
  ele.id = 'J_Scroll2Top';
  ele.className = 'scroll-2-top';
  ele.innerHTML = '↑';
  ele.title = '回到顶部';
  document.body.appendChild(ele);

  ele.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, false);
})();