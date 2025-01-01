function createBox(title, content) {
  const div = document.createElement("div");
  div.classList.add("key");
  const divText = document.createTextNode(content);
  const small = document.createElement("small");
  const smallText = document.createTextNode(title);
  small.appendChild(smallText);
  div.appendChild(small);
  div.appendChild(divText);
  return div;
}

// my way using additional function instead of object and looping
function onKeyPressedV1(e) {
  console.log(e.code);

  // getting element where to add
  const parent = document.getElementById("insert");

  // removing old content
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }

  // creating boxes and it's title
  const divKey = createBox("e.key", e.key === " " ? "Space" : e.key);
  const divKeyCode = createBox("e.keyCode", e.keyCode);
  const divCode = createBox("e.code", e.code);

  // adding created boxes to DOM
  parent.appendChild(divKey);
  parent.appendChild(divKeyCode);
  parent.appendChild(divCode);
}

// shorter way by changing innerHTML of parent element
function onKeyPressedV2(e) {
  let parent = document.getElementById("insert");
  parent.innerHTML = `
        <div id="insert">
            <div class="key">
                <small>e.key</small>
                ${e.key === " " ? "Space" : e.key}
            </div>
            <div class="key">
                <small>e.keyCode</small>
                ${e.keyCode}
            </div>
            <div class="key">
                <small>e.code</small>
                ${e.code}
            </div>
        </div>
    `;
}

// brad's way of doing it by creating new object and for in loop
function onKeyPressedV3(e) {
  const parent = document.querySelector("div#insert");
  parent.innerText = "";
  let eventObjKeybPropts = {
    "e.key": e.key === " " ? "Space" : e.key,
    "e.keyCode": e.keyCode,
    "e.code": e.code,
  };
  for (const objKey in eventObjKeybPropts) {
    const div = document.createElement("div");
    div.className = "key";
    const small = document.createElement("small");
    const divText = document.createTextNode(eventObjKeybPropts[objKey]);
    const smallText = document.createTextNode(objKey);
    small.appendChild(smallText);
    div.appendChild(divText);
    div.appendChild(small);
    parent.appendChild(div);
  }
}

document.body.addEventListener("keydown", onKeyPressedV3);
