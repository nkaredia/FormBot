/*chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.greeting === "GetURL") {
        var tabURL = "Not set yet";
        chrome.tabs.query({ active: true }, function (tabs) {
            if (tabs.length === 0) {
                sendResponse({});
                return;
            }
            tabURL = tabs[0].url;
            sendResponse({ navURL: tabURL });
        });
    }
});
*/
function read() {
    res = {};
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { message: "read" }, function (response) {
            console.log(response.res);
        });
    });
    
}