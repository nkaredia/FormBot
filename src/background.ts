/// <reference path="../typings/select2/select2.d.ts"/>
/// <reference path="../Typings/jquery/jquery.d.ts" />
/// <reference path="../typings/chrome/chrome.d.ts" />
/// <reference path="../Typings/filesystem/filesystem.d.ts" />
/// <reference path="../Typings/filewriter/filewriter.d.ts" />
/// <reference path="../Typings/webrtc/MediaStream.d.ts" />


const CONST: { NEW_DATA: number, SAVE_DATA: number } =
        { NEW_DATA: 1, SAVE_DATA: 2 };
        
/**
 * 
 * Message Passing Object - Always use this definition for message passing
 */
export interface message{
  success:boolean,
  message: string,
  type:any,
  data: data  
}

interface data{
  name: string,
  message:any
}



// import {CONST} from "./def";


module FormBotApp {

    //const CONST: { NEW_DATA: number, SAVE_DATA: number } =
    //    { NEW_DATA: 1, SAVE_DATA: 2 };


    export class Background {
        port: chrome.runtime.Port;
        connected: boolean;
        response_data: any;
        constructor() {
            this.BindEvents();
            this.connected = false;
            chrome.storage.local.get(function (data) {
                console.log("localstorage", data);
            })
        }

        BindEvents = () => {
            var self = this;
            chrome.runtime.onConnect.addListener(function (port: chrome.runtime.Port) {
                self.port = port;
                self.connected = true;
                self.MessageListener();
                port.onDisconnect.addListener(function () {
                    self.response_data = null;
                    self.connected = false;
                    self.port = null;
                })
            });


        }

        MessageListener = () => {
            var self = this;
            this.port.onMessage.addListener(function (message: { success: boolean, message: string, type: any, data: { name: string, message: any } }) {
                if (message.message == "read") {
                    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs: chrome.tabs.Tab[]) {
                        chrome.tabs.sendMessage(tabs[0].id, { message: "read" }, function (response: any) {
                            console.log(response);
                            if (response.success != false) {
                                self.response_data = response.message;
                                var sendDom = self.makeDOM(response.message);
                                //self.port.postMessage({ success: true, message: sendDom, data: response, type: CONST.NEW_DATA });
                                self.port.postMessage({ success: true, message: sendDom, type: CONST.NEW_DATA, data: { name: "response", message: response } })
                            }
                            else {
                                //self.port.postMessage({ success: false, message: response.message });
                                self.port.postMessage({ success: false, message: response.message, type: null, data: { name: "Error", message: response.message } });
                            }
                        });
                    })
                }
                else if (message.message == "save") {
                    // chrome.storage.local.get(function (items: any) {
                    //     var _data = [];
                    //     if (items.data != undefined) {
                    //         _data = items.data;
                    //     }
                    //     console.log("save-message", message);
                    //     _data.push({name: message.data.name, item: message.data.message});
                    //     chrome.storage.local.set({ data: _data });
                    //     self.port.postMessage({ success: true, message: message.data.name + " Saved" });
                    // });
                    chrome.storage.local.get(function (items: { ColorStr: string, userData: [{ name: string, data: any }] }) {
                        let data = items.userData ? items.userData : [];
                        data.push({ name: message.data.name, data: message.data.message });
                        chrome.storage.local.set({ userData: data });
                    })

                }
            });
        }

        makeDOM(inputs) {
            var dom = "<table class='preview_window_table'>";
            for (var i = 0; i < inputs.length; i++) {
                dom += this.makeRow($(inputs[i]));
            }
            return dom + "</table>"
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
}
(function () {
    new FormBotApp.Background();
})();