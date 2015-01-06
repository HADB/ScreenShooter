$(function () {
    $("#help").click(function () {
        chrome.tabs.create({
            url: chrome.extension.getURL("") + "help.html"
        });
        window.close();
    });
});