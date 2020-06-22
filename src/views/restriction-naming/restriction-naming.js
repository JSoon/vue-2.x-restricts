axios({
    method: 'GET',
    url: `./restriction-naming.md`,
    responseType: 'text',
  })
  .then(function (response) {
    const {
      data
    } = response;
    const contentBox = document.querySelector('#J_Content');
    contentBox.innerHTML = marked(data);
  });