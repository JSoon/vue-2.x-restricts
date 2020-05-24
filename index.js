marked.setOptions({
  langPrefix: 'hljs ',
});

axios({
    method: 'GET',
    url: '/vue-restricts.md',
    responseType: 'text',
  })
  .then(function (response) {
    const { data } = response;
    const contentBox = document.querySelector('#J_Content');
    contentBox.innerHTML = marked(data);
  });