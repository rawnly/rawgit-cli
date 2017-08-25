exports.getInfos = function(url) {
  url = url.slice(8, url.length).split('/');
  url.shift();

  url[2] = '';

  let newURL = [];
  let filePath = [];

  url.forEach(item => {
    if (item !== url[2]) {
      newURL.push(item)
    }
  });

  let info = {
    user: newURL[0],
    repo: newURL[1],
    branch: newURL[2]
  }

  newURL.forEach(item => {
    if (item !== info.user && item !== info.repo && item !== info.branch) {
      filePath.push(item);
    }
  })

  // GET /repos/:owner/:repo/commits

  filePath = filePath.join('/');
  info.path = filePath;

  return info;
}
