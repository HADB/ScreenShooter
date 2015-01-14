screenShooter.data = {};

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    var action = message.action;
    var cropSettings = message.cropSettings;

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
                    screenShooter.cropSettings = null;
                    chrome.tabs.create({
                        url: chrome.extension.getURL("pages/edit.html")
                    });
                });
                break;

            case "selected":
                chrome.tabs.captureVisibleTab({
                    format: "png",
                    quality: 100
                }, function (data) {
                    screenShooter.data = data;
                    screenShooter.cropSettings = cropSettings;
                    chrome.tabs.create({
                        url: chrome.extension.getURL("pages/edit.html")
                    });
                });
                break;
            case "upload":
                chrome.tabs.create({
                    url: chrome.extension.getURL("pages/upload.html")
                });
                break;
        }
    }
    else if (action === "get-screenshot-data") {
        sendResponse({
            data: screenShooter.data,
            cropSettings: screenShooter.cropSettings
        });
    }
    else if (action === "set-screenshot-data") {
        screenShooter.data = message.data;
        screenShooter.cropSettings = message.cropSettings;
        sendResponse({ result: true });
    }
    else if (action === "execute-scripts") {
        console.log('getMessage');
        chrome.tabs.query({ active: true }, function (tab) {
            console.log(tab[0].id);
            executeScripts(tab[0].id);
        });
    }
});

function executeScripts(tabId) {
    chrome.tabs.executeScript(tabId, { file: "resources/third-party/jquery/2.1.1/jquery-2.1.1.min.js" });
    chrome.tabs.executeScript(tabId, { file: "resources/local/js/inject.js" });
    chrome.tabs.insertCSS(tabId, { file: 'resources/third-party/font-awesome/4.2.0/css/font-awesome.min.css' });
    chrome.tabs.insertCSS(tabId, { file: 'resources/local/css/inject.css' });
}
