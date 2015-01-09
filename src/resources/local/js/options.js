$(function () {
    chrome.storage.local.get('defaultToEmail', function (result) {
        $('#default-to-email').val(result.defaultToEmail);
    });
    chrome.storage.local.get('defaultFromEmail', function (result) {
        $('#default-from-email').val(result.defaultFromEmail);
    });

    $('#save-button').click(function () {
        chrome.storage.local.set({ 'defaultToEmail': $('#default-to-email').val() });
        chrome.storage.local.set({ 'defaultFromEmail': $('#default-from-email').val() });
        alert('保存完毕！');
    });
});
