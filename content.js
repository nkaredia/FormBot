/// <reference path="jquery.min.js" />
/// <reference path="jsonml.js" />
/// <reference path="jquery.min.js" />
chrome.runtime.onMessage.addListener(
  function (request, sender, sr) {
      var ob = [];
      var parser = new DOMParser();
      if (request.message == "read") {
          input = $(":input");

          console.log(input);
          console.log(typeof (input[1]));
          var st = $(input[1]).clone().wrap('<div/>').parent().html();
          doc = parser.parseFromString(st, "text/xml");
          console.log($.makeArray(doc));
          console.log(parser.parseFromString(st, "text/xml"));
          console.log(st);
          var a = $.makeArray(input[1]);
          
          console.log(a[1]);
          console.log(typeof($.makeArray(input[1])));

          //JsonML.fromHTML()

          
      }
      

      return true;
  });

function extractProp(obj) {

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