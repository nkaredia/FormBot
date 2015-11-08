/// <reference path="jquery.min.js" />
var attributes;
function readObject(e) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { message: "read" }, function (response) {
            console.log(JSON.stringify(response.res));
            attributes = response.res;
            var arr = $.map(attributes, function (el) { return el });
            $('.textarea').append(objectToView(arr));
        });
    });
}

document.getElementById('read-button').addEventListener('click', readObject);

function objectToView(o) {
    var s = "";
    for (var i = 0; i < o.length; i++) {
        /*s.concat("<h4 class='name'>");
        s.concat(o[i].name);
        s.concat("</h4> : </h4 class='value'>");
        s.concat(o[i].value);
        s.concat("</h4><br />");*/

        s += "<h4 class='name'>" + o[i].name + "</h4> : </h4 class='value'>" + o[i].value + "</h4><br />";
    }
    return s;
}