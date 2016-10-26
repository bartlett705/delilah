console.log('hi');
console.log(uriObjsArray)
const nodeList = document.getElementsByClassName('del-uri');

// uri array delete hook handler

for (let i = 0; i < nodeList.length; i++ ) {
    nodeList[i].addEventListener('click', (e) => {
      // Tricksy, we is!
    let hiddenId = e.target.parentNode.childNodes[1].innerHTML;
    console.log(hiddenId);
    if (uriObjsArray.length > 1) uriObjsArray = uriObjsArray.slice(0, hiddenId).concat(uriObjsArray.slice(hiddenId + 1, uriObjsArray.length));
    else uriObjsArray = [];
    console.log('new URI array', uriObjsArray);
    e.target.parentNode.remove();
    });
}

// Edit POST handler
document.getElementById('edit-btn').addEventListener('click', (e) => {
  // Scrape our own page to get user changes.
  const newUriObjsArray = [];
  const uriNodeList = document.getElementsByClassName('edit-uri');
  for (var k = 0; k < uriNodeList.length; k++) {
    const uriObj = {
      id: uriNodeList[k].childNodes[1].innerHTML,
      uri: uriNodeList[k].childNodes[0],
      name: uriNodeList[k].childNodes[3].value,
      notes: uriNodeList[k].childNodes[5].value
    };
    newUriObjsArray.push(uriObj);
  }
  // Assemble new work Object to post
  uriObjsArray = newUriObjsArray;
  const newWorkObj = {
    title: document.getElementById('form-title').value,
    caption: document.getElementById('form-caption').value,
    creationDate: document.getElementById('form-creationdate').value,
    medium: document.getElementById('form-medium').value,
    uris: uriObjsArray,
  }
  console.log(newWorkObj);
  const http = new XMLHttpRequest;
  http.open('POST', `/edit/${_id}`);
  http.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  http.onload = () => {
    if (http.status === 200) {
      window.location.href = '/main';
    }
  }
  http.send(JSON.stringify(newWorkObj));
});
