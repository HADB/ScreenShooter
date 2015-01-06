$(function () {
    $("#help").click(function () {
        chrome.tabs.create({
            url: chrome.extension.getURL("pages/help.html")
        });
        window.close();
    });
});