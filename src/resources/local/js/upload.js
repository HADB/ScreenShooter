$(function () {
    $('#upload-image').change(function () {
        if (this.files && this.files[0]) {
            var FR = new FileReader();
            FR.onload = function (e) {
                chrome.runtime.sendMessage({ action: 'set-screenshot-data', data: e.target.result }, function (response) {
                    if (response) {
                        chrome.tabs.create({
                            url: chrome.extension.getURL("pages/edit.html")
                        });
                        window.close();
                    }
                });
            };
            FR.readAsDataURL(this.files[0]);
        }
    });
});