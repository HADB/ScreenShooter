$(function () {
    document.title = chrome.i18n.getMessage('options') + ' - ScreenShooter';
    $('header .container h2').html(chrome.i18n.getMessage('options'));

    $('label[for=default-to-email]').html(chrome.i18n.getMessage('defaultToEmail'));
    $('label[for=default-from-email]').html(chrome.i18n.getMessage('defaultFromEmail'));

    $('#default-to-email').attr('placeholder', chrome.i18n.getMessage('defaultToEmailPlaceHolder'));
    $('#default-from-email').attr('placeholder', chrome.i18n.getMessage('defaultFromEmailPlaceHolder'));

    $('#save-button').html(chrome.i18n.getMessage('save'));
    $('#saving-status-message').html(chrome.i18n.getMessage('saved'));
    $('#saveModal .modal-title').html(chrome.i18n.getMessage('message'));

    chrome.storage.local.get('defaultToEmail', function (result) {
        $('#default-to-email').val(result.defaultToEmail);
    });
    chrome.storage.local.get('defaultFromEmail', function (result) {
        $('#default-from-email').val(result.defaultFromEmail);
    });

    $('#save-button').click(function () {
        chrome.storage.local.set({ 'defaultToEmail': $('#default-to-email').val() });
        chrome.storage.local.set({ 'defaultFromEmail': $('#default-from-email').val() });
        $('#saveModal').modal();
    });
});
