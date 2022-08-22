axios({
    method: 'GET',
    url: `./index.md`,
    responseType: 'text',
  })
  .then(function (response) {
    const {
      data
    } = response;
    const contentBox = document.querySelector('#J_Content');
    contentBox.innerHTML = marked(data);

    const roadmapImage = document.getElementById('J_RoadmapImage')
    const viewer = new Viewer(roadmapImage, {
      transition: false,
      viewed() {
        if (window.innerWidth < roadmapImage.naturalWidth) {
          const scaledHeight = window.innerWidth / roadmapImage.naturalWidth * roadmapImage.naturalHeight
          viewer.zoomTo(window.innerWidth / roadmapImage.naturalWidth);
          viewer.move(0, scaledHeight / 2 - window.innerHeight / 2);
        }
      },
    });
  });