function readObject(e) {
    console.log(chrome.extension.getBackgroundPage().read());


}

document.getElementById('read-button').addEventListener('click', readObject);