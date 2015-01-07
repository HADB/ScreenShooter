$(function () {
    chrome.runtime.sendMessage({ action: "get-screenshot-data" }, function (response) {
        if (response.data) {
            setScreenshotImage(response.data);
        }
    });

    $(".save-to-file").click(function () {
        saveToFile();
    });
});

function setScreenshotImage(data) {

    var image = new Image();
    image.src = data;
    image.onload = function () {
        var canvas = $("#screenshot")[0];
        canvas.width = image.width;
        canvas.height = image.height;
        var context = canvas.getContext("2d");
        context.drawImage(image, 0, 0);
    };
}

function saveToFile() {
    var link = document.createElement('a');
    var date = new Date();
    var dateStr = $.format.date(date, 'yyyyMMddHHmmss');
    link.download = dateStr + ".png";
    link.href = $("#screenshot")[0].toDataURL();
    link.click();
}
