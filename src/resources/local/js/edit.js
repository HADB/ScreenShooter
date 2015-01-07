$(function () {
    chrome.runtime.sendMessage({ action: "get-screenshot-data" }, function (response) {
        if (response.data) {
            setScreenshotImage(response.data);
        }
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
