/// <reference path="../typings/select2/select2.d.ts"/>
/// <reference path="../Typings/jquery/jquery.d.ts" />
/// <reference path="../typings/chrome/chrome.d.ts" />
/// <reference path="../Typings/filesystem/filesystem.d.ts" />
/// <reference path="../Typings/filewriter/filewriter.d.ts" />
/// <reference path="../Typings/webrtc/MediaStream.d.ts" />
/// <reference path="./def.ts" />
const CONST = { NEW_DATA: 1, SAVE_DATA: 2 };
// import {CONST} from "./def";
// import {message} from "./def";
var FormBotApp;
(function (FormBotApp) {
    class FormBot {
        constructor() {
            this.Initialize = () => {
                var self = this;
                chrome.storage.local.get(function (val) {
                    if (!val.ColorStr) {
                        chrome.storage.local.set({ ColorStr: "#f8ebe9-#c0392b-#df9c95-#ac3326" });
                        self.changeColor("#f8ebe9-#c0392b-#df9c95-#ac3326".split("-"));
                    }
                    else {
                        self.changeColor(val.ColorStr.toString().split("-"));
                    }
                });
                this.port = chrome.runtime.connect({ name: "readPort" });
                // this.port = chrome.runtime.connect({name: "readPort"});
                // this.port.onMessage.addListener(function(message){
                //     console.log(message);
                // });
            };
            this.InitializeSelect2 = () => {
                $("select").select2();
                $("span.select2.select2-container").attr("style", "width:100%;");
            };
            this.BindEvents = () => {
                var self = this;
                $("span.select2-selection__arrow").bind("click", this.select2Expand);
                $(".theme-button").bind("click", this.themeEvent);
                $(".read").bind("click", this.readEvent);
                this.port.onMessage.addListener(function (message) {
                    self.portOnMessage(message);
                });
                $(".toggle-button").bind("click", self.consoleToggleEvent);
                $(".save").bind("click", self.saveEvent);
            };
            this.saveEvent = (e) => {
                e.preventDefault();
                console.log("save");
                if ($(".read-text-input").val() != "") {
                    if (this.__data != null) {
                        // this.port.postMessage({ message: "save", data: this.__data });
                        this.port.postMessage({ success: true, message: "save", type: null, data: { name: $(".read-text-input").val(), message: this.__data } });
                    }
                }
            };
            this.consoleToggleEvent = (e) => {
                //e.preventDefault();
                $(".console").toggleClass("console-height");
                $(this).toggleClass("toggle-animate");
            };
            this.readEvent = (e) => {
                e.preventDefault();
                console.log("read");
                var el = e.currentTarget;
                this.loader_old_class = $(el).children("i").attr("class");
                var newClass = "fa fa-spinner fa-pulse fa-3x fa-fw margin-bottom";
                $(el).children("i").attr("class", newClass);
                //var  port = chrome.runtime.connect({name: "readPort"});
                //port.postMessage("read");
                this.port.postMessage({ success: true, message: "read", type: null, data: { name: "", message: {} } });
            };
            this.portOnMessage = (obj) => {
                console.log(obj);
                if (obj) {
                    if (obj.success) {
                        if (obj.type == CONST.NEW_DATA) {
                            $(".console").html(obj.message);
                            $(".read").children("i").attr("class", this.loader_old_class);
                            if (!$(".console").hasClass("console-height")) {
                                this.consoleToggleEvent(null);
                            }
                            this.__data = obj;
                        }
                    }
                }
            };
            this.themeEvent = (e) => {
                e.preventDefault();
                var theme = $(e.currentTarget).attr("theme_params");
                this.changeColor(theme.toString().split("-"));
                chrome.storage.local.set({ ColorStr: theme });
            };
            this.select2Expand = (e) => {
                e.preventDefault();
                $(".select2-results__options").perfectScrollbar();
            };
            this.changeColor = (colors) => {
                var base = colors[1];
                var background = colors[0];
                var border = colors[2];
                var hover = colors[3];
                var css = `
            
                .container {
                    background: ` + background + `;
                }

                .header {
                    background-color: ` + base + `;
                }

                .read-text-input {
                    border-top: 1px solid ` + base + `;
                    border-bottom: 1px solid ` + base + `;
                    border-left: 1px solid ` + base + `;
                }

                .read {
                    border-top: 1px solid ` + base + `;
                    border-bottom: 1px solid ` + base + `;
                    border-right: 1px solid ` + base + `;
                    background-color: ` + base + `;
                    color: ` + border + `;
                }

                .read:hover {
                    background-color: ` + hover + `;
                }

                .save, .discard {
                    background-color: ` + base + `;
                    color: ` + border + `;
                }

                .save:hover, .discard:hover {
                    background-color: ` + hover + `;
                }

                .fill-button-container .fill{
                    color: ` + border + `;
                    background-color: ` + base + `;
                }

                .fill:hover{
                    background-color: ` + hover + `;
                }

                span.select2-selection.select2-selection--single {
                    border: 1px solid ` + base + `;
                }

                .select2-container--default .select2-selection--single .select2-selection__arrow b {
                    border-color: ` + base + ` transparent transparent transparent;
                }

                .select2-container--default.select2-container--open .select2-selection--single .select2-selection__arrow b {
                    border-color: transparent transparent ` + base + ` transparent;
                }

                .select2-container--default .select2-results__option--highlighted[aria-selected] {
                    background-color: ` + base + `;
                }

                .select2-container--default .select2-search--dropdown .select2-search__field {
                    border: 1px solid ` + base + `;
                }
                
                .head{
                    background-color: ` + base + `;  
                }
                
                .console table tr:nth-child(odd){
                    background-color: ` + border + `;
                }

                .console table tr:nth-child(even){
                    background-color: ` + background + `;
                }
            
            `;
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
    }
    FormBotApp.FormBot = FormBot;
})(FormBotApp || (FormBotApp = {}));
(function () {
    new FormBotApp.FormBot();
})();
//# sourceMappingURL=popup.js.map