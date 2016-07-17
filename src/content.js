/// <reference path="../typings/select2/select2.d.ts"/>
/// <reference path="../Typings/jquery/jquery.d.ts" />
/// <reference path="../typings/chrome/chrome.d.ts" />
/// <reference path="../Typings/filesystem/filesystem.d.ts" />
/// <reference path="../Typings/filewriter/filewriter.d.ts" />
/// <reference path="../Typings/webrtc/MediaStream.d.ts" />
var CONST;
(function (CONST) {
    CONST[CONST["NEW_DATA"] = 0] = "NEW_DATA";
    CONST[CONST["SAVE_DATA"] = 1] = "SAVE_DATA";
    CONST[CONST["SAVED_DATA"] = 2] = "SAVED_DATA";
    CONST[CONST["READ_DATA"] = 3] = "READ_DATA";
})(CONST || (CONST = {}));
var FormBotApp;
(function (FormBotApp) {
    class Content {
        constructor() {
            this.queryString = ":input:visible[type='text'],:input:visible[type='number'],:input:visible[type='checkbox'],:input:visible[type='radio'],:input:visible[type='date'],:input:visible[type='color'],:input:visible[type='range'],:input:visible[type='month'],:input:visible[type='week'],:input:visible[type='time'],:input:visible[type='datetime'],:input:visible[type='datetime-local'],:input:visible[type='email'],:input:visible[type='search'],:input:visible[type='tel'],:input:visible[type='url'],select:visible,textarea:visible";
            this.onMessageEvent = (request, sender, sr) => {
                var self = this;
                if (request.message == "read") {
                    var _position_id = 0;
                    var msg = [];
                    $(self.queryString).filter(function () {
                        // console.log($(this));
                        var bool = false;
                        var el = $(this)[0];
                        if (el.type == "checkbox" || el.type == "radio") {
                            if (el.checked) {
                                $(this).attr("checked", "checked");
                                bool = true;
                            }
                        }
                        else if (el.localName == "input" || el.localName == "select" || el.localName == "textarea") {
                            if (el.value != "") {
                                $(this).attr("value", $(this).val());
                                bool = true;
                            }
                        }
                        $(this).attr("_fbt_position_id", _position_id++);
                        if (bool) {
                            msg.push(el.outerHTML);
                        }
                        return bool;
                    });
                    if (msg.length > 0) {
                        console.log(msg);
                        sr({ success: true, message: msg });
                    }
                    else {
                        sr({ success: false, message: "No form data to read" });
                    }
                }
            };
            chrome.runtime.onMessage.addListener(this.onMessageEvent);
        }
    }
    FormBotApp.Content = Content;
})(FormBotApp || (FormBotApp = {}));
(function () {
    new FormBotApp.Content();
})();
//# sourceMappingURL=content.js.map