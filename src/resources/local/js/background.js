var screenShooter = {
    dataUrl: {}
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    var name = request.name;
    var action = request.action;
    if (name === "log") {
        console.log("log");
    }

    if (action === "open-page") {
        if (request.pageName === "visible") {
            chrome.tabs.captureVisibleTab({ format: "png", quality: 100 }, function (dataUrl) {
                screenShooter.dataUrl = dataUrl;
                chrome.tabs.create({
                    url: chrome.extension.getURL("pages/edit.html")
                });
            });
        }
    }

    if (action === "get-screenshot-data") {
        sendResponse({ dataUrl: screenShooter.dataUrl });
    }
});
