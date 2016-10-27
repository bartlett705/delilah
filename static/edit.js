let thingsToSave = {};
const delNodeList = document.getElementsByClassName('del-uri');

// uri array delete hook handler

for (let i = 0; i < delNodeList.length; i++ ) {
    delNodeList[i].addEventListener('click', (e) => {
      // Tricksy, we is!
    e.target.parentNode.remove();
    });
}

const previewNodeList = document.getElementsByClassName('add-preview-btn');

// uri array delete hook handler

for (let i = 0; i < previewNodeList.length; i++ ) {
    previewNodeList[i].addEventListener('click', (e) => {
      console.log(e);
    const clickedUri =
      thingsToSave = Object.assign(thingsToSave, {
        preview: e.target.parentNode.childNodes[6].textContent.replace(/\s/g, ''),
      });
      console.log('Changed preview:', thingsToSave);
    });
}

// Edit POST handler
document.getElementById('save-btn').addEventListener('click', (e) => {
  // Scrape our own page to get user changes.
  const newUriObjsArray = [];
  const uriNodeList = document.getElementsByClassName('edit-uri');
  for (var k = 0; k < uriNodeList.length; k++) {
    const uriObj = {
      id: uriNodeList[k].childNodes[1].innerHTML,
      href: uriNodeList[k].childNodes[6].textContent.replace(/\s/g, ''),
      name: uriNodeList[k].childNodes[3].value,
      notes: uriNodeList[k].childNodes[5].value
    };
    newUriObjsArray.push(uriObj);
  }
  // Assemble new work Object to post
  uriObjsArray = newUriObjsArray;
  // console.log('uriobjsarray: ',uriObjsArray.length, uriObjsArray[0].uri);
  const newWorkObj = Object.assign(thingsToSave, {
    title: document.getElementById('form-title').value,
    caption: document.getElementById('form-caption').value,
    creationDate: document.getElementById('form-creationdate').value,
    medium: document.getElementById('form-medium').value,
    uris: uriObjsArray,
  });
  if (!newWorkObj.preview) {
    newWorkObj.preview = passedPreview;
  }
  const http = new XMLHttpRequest;
  http.open('POST', `/edit/${_id}`);
  http.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  http.onload = () => {
    if (http.status === 200) {
      window.location.href = '/main';
    }
  }
  console.log('SENDING', JSON.stringify(newWorkObj));
  http.send(JSON.stringify(newWorkObj));
});
