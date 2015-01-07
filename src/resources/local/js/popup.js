$(function () {
    $("#visible").click(function () {
        openPage("visible");
    });

    $("#help").click(function () {
        openPage("help");
    });

    $("#options").click(function () {
        openPage("options");
    });
});

function openPage(pageName) {
    window.close();
    chrome.runtime.sendMessage({ action: "open-page", pageName: pageName });
}
