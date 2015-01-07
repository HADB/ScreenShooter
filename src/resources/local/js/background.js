var screenShooter = {
    data: {}
};

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    var action = message.action;

    if (action === "open-page") {
        if (message.pageName === "help") {
            chrome.tabs.create({
                url: chrome.extension.getURL("pages/help.html")
            });
        }

        else if (message.pageName === "options") {
            chrome.tabs.create({
                url: chrome.extension.getURL("pages/options.html")
            });
        }

        else if (message.pageName === "visible") {
            chrome.tabs.captureVisibleTab({
                format: "png",
                quality: 100
            }, function (data) {
                screenShooter.data = data;
                chrome.tabs.create({
                    url: chrome.extension.getURL("pages/edit.html")
                });
            });
        }
    }

    else if (action === "get-screenshot-data") {
        sendResponse({ data: screenShooter.data });
    }
});
