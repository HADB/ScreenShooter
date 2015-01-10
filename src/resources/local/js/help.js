$(function () {
    document.title = chrome.i18n.getMessage('help') + ' - ScreenShooter';
    $('header .container h2').html(chrome.i18n.getMessage('help'));
    $('.container .page-header.help').html(chrome.i18n.getMessage('help'));
    $('.container .page-header.feedback').html(chrome.i18n.getMessage('feedback'));
    $('#help-content').html(chrome.i18n.getMessage('helpContent'));
    $('#feedback-content').html(chrome.i18n.getMessage('feedbackContent'));
});