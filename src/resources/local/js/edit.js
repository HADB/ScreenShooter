$(function () {
    chrome.runtime.sendMessage({ action: 'get-screenshot-data' }, function (response) {
        if (response.data) {
            setScreenshotImage(response.data);
        }
    });

    $('#user-agent').val(navigator.userAgent);

    $('.save-to-file').click(function () {
        saveToFile();
    });

    $('.save-and-email').click(function () {
        saveAndEmail();
    });

    $('.send-email').click(function () {
        var toUser = $('#to-user').val();
        var fromUser = $('#from-user').val();
        var content = $('#content').val();
        var subject = $('#email-title').val();
        var userAgent = $('#user-agent').val();
        var imgData = $('#saved-screenshot').attr("src");
        var body = '<html><body><div><h3>Content:</h3><p>' + content + '</p></div>';
        body += '<div><h3>User-Agent:</h3><p>' + userAgent + '</p></div>';
        body += '<div><h3>ScreenShot:</h3><img src="' + imgData + '" /></div></body></html>';
        $.ajax({
            url: 'http://nesc.newegg.com.cn/SendEmail',
            type: 'POST',
            dataType: "JSON",
            data: {
                'fromUser': fromUser,
                'toUser': toUser,
                'subject': subject,
                'body': body
            },
            success: function (data) {
                if (data.Success) {
                    alert('发送成功！');
                    console.log('Success!');
                }
                else {
                    consolog.log(data.Message);
                }
            },
            error: function () {
                console.log('Error!');
            }
        });
    });
});

function setScreenshotImage(data) {

    var image = new Image();
    image.src = data;
    image.onload = function () {
        var canvas = $('#screenshot')[0];
        canvas.width = image.width;
        canvas.height = image.height;
        var context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);
    };
}

function saveToFile() {
    var link = document.createElement('a');
    var date = new Date();
    var dateStr = $.format.date(date, 'yyyyMMddHHmmss');
    link.download = dateStr + '.png';
    link.href = $('#screenshot')[0].toDataURL();
    link.click();
}

function saveAndEmail() {
    $('.tools').hide();
    $('#screenshot').hide();
    $('.save-to-file').hide();
    $('.save-and-email').hide();
    $('.body .email').show();
    $('.send-email').show();
    $('#saved-screenshot').attr('src', $('#screenshot')[0].toDataURL());
}