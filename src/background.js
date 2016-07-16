/// <reference path="../typings/select2/select2.d.ts"/>
/// <reference path="../Typings/jquery/jquery.d.ts" />
/// <reference path="../typings/chrome/chrome.d.ts" />
/// <reference path="../Typings/filesystem/filesystem.d.ts" />
/// <reference path="../Typings/filewriter/filewriter.d.ts" />
/// <reference path="../Typings/webrtc/MediaStream.d.ts" />
const CONST = { NEW_DATA: 1, SAVE_DATA: 2, SAVED_DATA: 3 };
// import {CONST} from "./def";
var FormBotApp;
(function (FormBotApp) {
    //const CONST: { NEW_DATA: number, SAVE_DATA: number } =
    //    { NEW_DATA: 1, SAVE_DATA: 2 };
    class Background {
        constructor() {
            this.BindEvents = () => {
                var self = this;
                chrome.runtime.onConnect.addListener(self.Connect);
            };
            this.Connect = (port) => {
                var self = this;
                self.port = port;
                self.connected = true;
                self.MessageListener();
                port.onDisconnect.addListener(self.Disconnect);
            };
            this.Disconnect = () => {
                var self = this;
                self.response_data = null;
                self.connected = false;
                self.port = null;
            };
            this.MessageListener = () => {
                var self = this;
                this.port.onMessage.addListener(function (message) {
                    if (message.message == "read") {
                        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                            chrome.tabs.sendMessage(tabs[0].id, { message: "read" }, function (response) {
                                console.log(response);
                                if (response.success != false) {
                                    self.response_data = response.message;
                                    var sendDom = self.makeDOM(response.message);
                                    //self.port.postMessage({ success: true, message: sendDom, data: response, type: CONST.NEW_DATA });
                                    self.port.postMessage({ success: true, message: sendDom, type: CONST.NEW_DATA, data: { name: "response", message: response } });
                                }
                                else {
                                    //self.port.postMessage({ success: false, message: response.message });
                                    self.port.postMessage({ success: false, message: response.message, type: null, data: { name: "Error", message: response.message } });
                                }
                            });
                        });
                    }
                    else if (message.message == "save") {
                        chrome.storage.local.get(function (items) {
                            let data = items.userData ? items.userData : [];
                            data.push({ name: message.data.name, data: message.data.message });
                            chrome.storage.local.set({ userData: data });
                            self.port.postMessage({ success: true, message: "From Saved", type: CONST.SAVED_DATA, data: { name: null, message: null } });
                        });
                    }
                });
            };
            this.BindEvents();
            this.connected = false;
            chrome.storage.local.get(function (data) {
                console.log("localstorage", data);
            });
        }
        makeDOM(inputs) {
            var dom = "<table class='preview_window_table'>";
            for (var i = 0; i < inputs.length; i++) {
                dom += this.makeRow($(inputs[i]));
            }
            return dom + "</table>";
        }
        makeRow(input) {
            var value = "";
            if (input[0].type == "checkbox" || input[0].type == "radio") {
                value = input[0].checked;
            }
            else if (input[0].type == "select-multiple" || input[0].type == "select-one" || input[0].type == "textarea") {
                value = $(input).attr("value");
            }
            else {
                value = input[0].value;
            }
            return "<tr>" + this.makeCol(input[0].type, value) + "</tr>";
        }
        makeCol(key, value) {
            return "<td>" + key + "</td><td>" + value + "</td>";
        }
    }
    FormBotApp.Background = Background;
})(FormBotApp || (FormBotApp = {}));
(function () {
    new FormBotApp.Background();
})();
//# sourceMappingURL=background.js.map