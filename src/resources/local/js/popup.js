$(function () {
    $("#help").click(function () {
        chrome.tabs.create({
            url: chrome.extension.getURL("pages/help.html")
        });
        window.close();
    });
    $("#options").click(function () {
        chrome.tabs.create({
            url: chrome.extension.getURL("pages/options.html")
        });
        window.close();
    });
});