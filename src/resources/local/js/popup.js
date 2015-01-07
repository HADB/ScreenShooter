$(function () {
    $("#visible").click(function () {
        window.close();
        chrome.runtime.sendMessage({ action: "open-page", pageName: "visible" });
    });

    $("#help").click(function () {
        window.close();
        chrome.tabs.create({
            url: chrome.extension.getURL("pages/help.html")
        });
    });

    $("#options").click(function () {
        window.close();
        chrome.tabs.create({
            url: chrome.extension.getURL("pages/options.html")
        });
    });
});
