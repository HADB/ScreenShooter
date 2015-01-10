$(function () {
    $('#visible').html(chrome.i18n.getMessage('menuVisible'));
    $('#selected').html(chrome.i18n.getMessage('menuSelected'));
    $('#entire').html(chrome.i18n.getMessage('menuEntire'));
    $('#upload').html(chrome.i18n.getMessage('menuUpload'));
    $('#help').html(chrome.i18n.getMessage('menuHelpAndFeedback'));
    $('#options').html(chrome.i18n.getMessage('menuOptions'));

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
