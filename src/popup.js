/// <reference path="../typings/select2/select2.d.ts"/>
/// <reference path="../Typings/jquery/jquery.d.ts" />
/// <reference path="../typings/chrome/chrome.d.ts" />
/// <reference path="../typings/es6-promise/es6-promise.d.ts" />
/// <reference path="../Typings/filesystem/filesystem.d.ts" />
/// <reference path="../Typings/filewriter/filewriter.d.ts" />
/// <reference path="../Typings/webrtc/MediaStream.d.ts" />
/* Perfect Scrollbar Definition */
var FormBotApp;
(function (FormBotApp) {
    var CONST = { NEW_DATA: 1, SAVE_DATA: 2 };
    //var message: { message: string, data: { name: string, message: any } }
    var FormBot = (function () {
        function FormBot() {
            var _this = this;
            this.Initialize = function () {
                var self = _this;
                chrome.storage.local.get(function (val) {
                    if (!val.ColorStr) {
                        chrome.storage.local.set({ ColorStr: "#f8ebe9-#c0392b-#df9c95-#ac3326" });
                        self.changeColor("#f8ebe9-#c0392b-#df9c95-#ac3326".split("-"));
                    }
                    else {
                        self.changeColor(val.ColorStr.toString().split("-"));
                    }
                });
                _this.port = chrome.runtime.connect({ name: "readPort" });
                // this.port = chrome.runtime.connect({name: "readPort"});
                // this.port.onMessage.addListener(function(message){
                //     console.log(message);
                // });
            };
            this.InitializeSelect2 = function () {
                $("select").select2();
                $("span.select2.select2-container").attr("style", "width:100%;");
            };
            this.BindEvents = function () {
                var self = _this;
                $("span.select2-selection__arrow").bind("click", _this.select2Expand);
                $(".theme-button").bind("click", _this.themeEvent);
                $(".read").bind("click", _this.readEvent);
                _this.port.onMessage.addListener(function (message) {
                    self.portOnMessage(message);
                });
                $(".toggle-button").bind("click", self.consoleToggleEvent);
                $(".save").bind("click", self.saveEvent);
            };
            this.saveEvent = function (e) {
                e.preventDefault();
                console.log("save");
                if ($(".read-text-input").val() != "") {
                    if (_this.__data != null) {
                        // this.port.postMessage({ message: "save", data: this.__data });
                        _this.port.postMessage({ success: true, message: "save", type: null, data: { name: $(".read-text-input").val(), message: _this.__data } });
                    }
                }
            };
            this.consoleToggleEvent = function (e) {
                //e.preventDefault();
                $(".console").toggleClass("console-height");
                $(_this).toggleClass("toggle-animate");
            };
            this.readEvent = function (e) {
                e.preventDefault();
                console.log("read");
                var el = e.currentTarget;
                _this.loader_old_class = $(el).children("i").attr("class");
                var newClass = "fa fa-spinner fa-pulse fa-3x fa-fw margin-bottom";
                $(el).children("i").attr("class", newClass);
                //var  port = chrome.runtime.connect({name: "readPort"});
                //port.postMessage("read");
                _this.port.postMessage({ success: true, message: "read", type: null, data: { name: "", message: {} } });
            };
            this.portOnMessage = function (obj) {
                console.log(obj);
                if (obj) {
                    if (obj.success) {
                        if (obj.type == CONST.NEW_DATA) {
                            $(".console").html(obj.message);
                            $(".read").children("i").attr("class", _this.loader_old_class);
                            if (!$(".console").hasClass("console-height")) {
                                _this.consoleToggleEvent(null);
                            }
                            _this.__data = obj;
                        }
                    }
                }
            };
            this.themeEvent = function (e) {
                e.preventDefault();
                var theme = $(e.currentTarget).attr("theme_params");
                _this.changeColor(theme.toString().split("-"));
                chrome.storage.local.set({ ColorStr: theme });
            };
            this.select2Expand = function (e) {
                e.preventDefault();
                $(".select2-results__options").perfectScrollbar();
            };
            this.changeColor = function (colors) {
                var base = colors[1];
                var background = colors[0];
                var border = colors[2];
                var hover = colors[3];
                var css = "\n            \n                .container {\n                    background: " + background + ";\n                }\n\n                .header {\n                    background-color: " + base + ";\n                }\n\n                .read-text-input {\n                    border-top: 1px solid " + base + ";\n                    border-bottom: 1px solid " + base + ";\n                    border-left: 1px solid " + base + ";\n                }\n\n                .read {\n                    border-top: 1px solid " + base + ";\n                    border-bottom: 1px solid " + base + ";\n                    border-right: 1px solid " + base + ";\n                    background-color: " + base + ";\n                    color: " + border + ";\n                }\n\n                .read:hover {\n                    background-color: " + hover + ";\n                }\n\n                .save, .discard {\n                    background-color: " + base + ";\n                    color: " + border + ";\n                }\n\n                .save:hover, .discard:hover {\n                    background-color: " + hover + ";\n                }\n\n                .fill-button-container .fill{\n                    color: " + border + ";\n                    background-color: " + base + ";\n                }\n\n                .fill:hover{\n                    background-color: " + hover + ";\n                }\n\n                span.select2-selection.select2-selection--single {\n                    border: 1px solid " + base + ";\n                }\n\n                .select2-container--default .select2-selection--single .select2-selection__arrow b {\n                    border-color: " + base + " transparent transparent transparent;\n                }\n\n                .select2-container--default.select2-container--open .select2-selection--single .select2-selection__arrow b {\n                    border-color: transparent transparent " + base + " transparent;\n                }\n\n                .select2-container--default .select2-results__option--highlighted[aria-selected] {\n                    background-color: " + base + ";\n                }\n\n                .select2-container--default .select2-search--dropdown .select2-search__field {\n                    border: 1px solid " + base + ";\n                }\n                \n                .head{\n                    background-color: " + base + ";  \n                }\n                \n                .console table tr:nth-child(odd){\n                    background-color: " + border + ";\n                }\n\n                .console table tr:nth-child(even){\n                    background-color: " + background + ";\n                }\n            \n            ";
                var head = document.head || document.getElementsByTagName('head')[0];
                //var style = head.getElementsByTagName("style")[0];
                var style = head.getElementsByTagName("style")[0];
                style.type = 'text/css';
                if (style.style) {
                    $(style).html("");
                    $(style).text(css);
                }
                else {
                    $(style).html("");
                    style.appendChild(document.createTextNode(css));
                }
                // head.appendChild(style);
            };
            this.Initialize();
            this.InitializeSelect2();
            this.BindEvents();
            this.__data = null;
        }
        return FormBot;
    }());
    FormBotApp.FormBot = FormBot;
})(FormBotApp || (FormBotApp = {}));
(function () {
    new FormBotApp.FormBot();
})();
