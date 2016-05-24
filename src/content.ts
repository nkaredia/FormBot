/// <reference path="../Typings/select2/select2.d.ts"/>
/// <reference path="../Typings/jquery/jquery.d.ts" />
/// <reference path="../Typings/chrome/chrome.d.ts" />
/// <reference path="../Typings/es6-promise/es6-promise.d.ts" />
/// <reference path="../Typings/filesystem/filesystem.d.ts" />
/// <reference path="../Typings/filewriter/filewriter.d.ts" />
/// <reference path="../Typings/webrtc/MediaStream.d.ts" />

module FormBotApp {
    export class Content {
        queryString: string = ":input:visible[type='text'],:input:visible[type='number'],:input:visible[type='checkbox'],:input:visible[type='radio'],:input:visible[type='date'],:input:visible[type='color'],:input:visible[type='range'],:input:visible[type='month'],:input:visible[type='week'],:input:visible[type='time'],:input:visible[type='datetime'],:input:visible[type='datetime-local'],:input:visible[type='email'],:input:visible[type='search'],:input:visible[type='tel'],:input:visible[type='url'],select:visible,textarea:visible";
        constructor() {
            chrome.runtime.onMessage.addListener(this.onMessageEvent);
        }

        onMessageEvent = (request, sender, sr) => {
            var self = this;
            if (request.message == "read") {
                var _position_id = 0;
                var msg = [];
                $(self.queryString).filter(function () {
                    // console.log($(this));
                    var bool = false;
                    var el : any = $(this)[0];
                    if (el.type == "checkbox" || el.type == "radio") {
                        if (el.checked) {
                            $(this).attr("checked", "checked");
                            bool = true;
                        }
                    }
                    else if (el.localName == "input" ||el.localName == "select" || el.localName == "textarea") {
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
                    sr({success: true, message: msg });
                }
                else {
                    sr({success:false, message: "No form data to read" });
                }
            }
        }

    }
}
(function () {
    new FormBotApp.Content();
})();