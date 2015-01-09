screenShooter.data = {};

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    var action = message.action;

    if (action === "open-page") {
        switch (message.pageName) {
            case "help":
                chrome.tabs.create({
                    url: chrome.extension.getURL("pages/help.html")
                });
                break;

            case "options":
                chrome.tabs.create({
                    url: chrome.extension.getURL("pages/options.html")
                });
                break;

            case "visible":
                chrome.tabs.captureVisibleTab({
                    format: "png",
                    quality: 100
                }, function (data) {
                    screenShooter.data = data;
                    chrome.tabs.create({
                        url: chrome.extension.getURL("pages/edit.html")
                    });
                });
                break;

            case "selected":
                break;
        }
    }
    else if (action === "get-screenshot-data") {
        sendResponse({ data: screenShooter.data });
    }
});
