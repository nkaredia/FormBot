/// <reference path="jquery.min.js" />
/// <reference path="jsonml.js" />
/// <reference path="jquery.min.js" />
chrome.runtime.onMessage.addListener(
  function (request, sender, sr) {
      if (request.message == "read") {
          input = $(":input");
          var o = extractAllAttributes(input);
          sr({ res: o });   
      }
      return true;
  });


function extractAllAttributes(o) {
    var ar = {};
    for (var i = 0; i < o.length; i++) {
        // ar['type'] = o[i].type;
        ar[i] = extractAttributes(o[i].attributes, o[i].type, o[i].value);
    }
    console.log(ar);
    return ar;
}

function extractAttributes(o, type, value) {
    var ar = {};
    ar['type'] = type;
    ar['value'] = value;
    //console.log(o);
    for (var i = 0; i < o.length; i++) {
        //console.log(o[i].name);
        //console.log('"' + o[i].value + '"');
        ar[o[i].name] = o[i].value !== "" ? o[i].value : "";
    }
    // console.log(ar);
    return ar;
}

var printObj = function (obj) {
    var arr = [];
    $.each(obj, function (key, val) {
        var next = key + ": ";
        next += $.isPlainObject(val) ? printObj(val) : val;
        arr.push(next);
    });
    return "{ " + arr.join(", ") + " }";
};