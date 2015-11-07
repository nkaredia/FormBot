/// <reference path="jquery.min.js" />
/// <reference path="jsonml.js" />
chrome.runtime.onMessage.addListener(
  function (request, sender, sr) {
      var ob = [];
      if (request.message == "read") {
          input = $(":input");
          for (i = 0; i < input.length; i++) {
              ob.push((input[i]));
          }
          console.log(input[1].localName);
          console.log(input.toLocaleString());


          //JsonML.fromHTML()

          
      }
      

      return true;
  });

var printObj = function (obj) {
    var arr = [];
    $.each(obj, function (key, val) {
        var next = key + ": ";
        next += $.isPlainObject(val) ? printObj(val) : val;
        arr.push(next);
    });
    return "{ " + arr.join(", ") + " }";
};