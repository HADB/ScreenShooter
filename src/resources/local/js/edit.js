screenShooter.edit = {
    tool: {},
    canvas: {},
    isMouseOver: false,
    isEditing: false
};

$(function () {
    chrome.runtime.sendMessage({ action: 'get-screenshot-data' }, function (response) {
        if (response.data) {
            initCanvas(response.data);
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

    $('.tool.rectangle').click(function () {
        screenShooter.edit.tool = screenShooter.tools.rectangle;
        $('.tool').removeClass('selected');
        $('.tool.rectangle').addClass('selected');
        resetCanvas();
    });

    $('.tool.ellipse').click(function () {
        screenShooter.edit.tool = screenShooter.tools.ellipse;
        $('.tool').removeClass('selected');
        $('.tool.ellipse').addClass('selected');
        resetCanvas();
    });

    $('.tool.text').click(function () {
        screenShooter.edit.tool = screenShooter.tools.text;
        $('.tool').removeClass('selected');
        $('.tool.text').addClass('selected');
        resetCanvas();
        screenShooter.edit.canvas.forEachObject(function (obj) {
            if (obj.get('type') === 'i-text') {
                obj.set('selectable', true);
            }
        });
    });

    $('.tool.arrow').click(function () {
        screenShooter.edit.tool = screenShooter.tools.arrow;
        $('.tool').removeClass('selected');
        $('.tool.arrow').addClass('selected');
        resetCanvas();
    });

    $('.tool.line').click(function () {
        screenShooter.edit.tool = screenShooter.tools.line;
        $('.tool').removeClass('selected');
        $('.tool.line').addClass('selected');
        resetCanvas();
    });

    $('.tool.free').click(function () {
        screenShooter.edit.tool = screenShooter.tools.free;
        $('.tool').removeClass('selected');
        $('.tool.free').addClass('selected');
        resetCanvas();
        screenShooter.edit.canvas.isDrawingMode = true;
        screenShooter.edit.canvas.freeDrawingBrush.color = 'red';
        screenShooter.edit.canvas.freeDrawingBrush.width = 3;
    });

    $('.tool.move').click(function () {
        screenShooter.edit.tool = screenShooter.tools.move;
        $('.tool').removeClass('selected');
        $('.tool.move').addClass('selected');
        resetCanvas();
        setSelectable(true);
    });

    $('.tool.crop').click(function () {
        screenShooter.edit.tool = screenShooter.tools.crop;
        $('.tool').removeClass('selected');
        $('.tool.crop').addClass('selected');
        resetCanvas();
    });
});

function initCanvas(data) {
    screenShooter.edit.canvas = new fabric.Canvas('screenshot', {
        selection: false,
    });
    var canvas = screenShooter.edit.canvas;
    var image = new Image();
    image.src = data;
    image.onload = function () {
        var bgImage = new fabric.Image(image);
        canvas.setDimensions({
            width: bgImage.getWidth(),
            height: bgImage.getHeight()
        });
        canvas.setBackgroundImage(bgImage, canvas.renderAll.bind(canvas));
    };

    var obj;
    var isDown;
    var startX;
    var startY;
    var canvas = screenShooter.edit.canvas;

    canvas.on('mouse:over', function (e) {
        if (e.target.get('type') === 'i-text') {
            screenShooter.edit.isMouseOver = true;
        }
    });

    canvas.on('mouse:out', function (e) {
        if (e.target.get('type') === 'i-text') {
            screenShooter.edit.isMouseOver = false;
        }
    });

    canvas.on('mouse:down', function (o) {
        if (!screenShooter.edit.isMouseOver && screenShooter.edit.isEditing === true) {
            screenShooter.edit.isEditing = false;
            return;
        }

        isDown = true;
        var pointer = canvas.getPointer(o.e);
        startX = pointer.x;
        startY = pointer.y;
        var points = [pointer.x, pointer.y, pointer.x, pointer.y];
        switch (screenShooter.edit.tool) {
            case screenShooter.tools.line:
                obj = new fabric.Line(points, {
                    originX: 'center',
                    originY: 'center',
                    stroke: 'red',
                    strokeWidth: 3,
                    fill: 'red'
                });
                break;
            case screenShooter.tools.rectangle:
                obj = new fabric.Rect({
                    left: pointer.x,
                    top: pointer.y,
                    originX: 'left',
                    originY: 'top',
                    width: 0,
                    height: 0,
                    angle: 0,
                    fill: null,
                    stroke: 'red',
                    strokeWidth: 3
                });
                break;
            case screenShooter.tools.ellipse:
                obj = new fabric.Ellipse({
                    left: pointer.x,
                    top: pointer.y,
                    originX: 'left',
                    originY: 'top',
                    rx: 0,
                    ry: 0,
                    angle: 0,
                    fill: null,
                    stroke: 'red',
                    strokeWidth: 3
                });
                break;
            case screenShooter.tools.text:
                if (screenShooter.edit.isMouseOver) {
                    return;
                }
                obj = new fabric.IText('双击输入文字(不支持输入法)', {
                    fontFamily: 'Microsoft Yahei',
                    left: pointer.x,
                    top: pointer.y,
                    hasControls: false
                });

                obj.on('editing:entered', function (e) {
                    screenShooter.edit.isEditing = true;
                });
                break;

            case screenShooter.tools.arrow:
                //TODO:添加箭头功能
                break;
        }

        if (obj) {
            canvas.add(obj);
        }
    });

    canvas.on('mouse:move', function (o) {
        if (isDown && obj) {
            var pointer = canvas.getPointer(o.e);
            switch (screenShooter.edit.tool) {
                case screenShooter.tools.line:
                    obj.set({ x2: pointer.x, y2: pointer.y });

                    break;

                case screenShooter.tools.rectangle:
                    if (startX > pointer.x) {
                        obj.set({ left: Math.abs(pointer.x) });
                    }
                    if (startY > pointer.y) {
                        obj.set({ top: Math.abs(pointer.y) });
                    }

                    obj.set({ width: Math.abs(startX - pointer.x) });
                    obj.set({ height: Math.abs(startY - pointer.y) });
                    break;

                case screenShooter.tools.ellipse:
                    if (startX > pointer.x) {
                        obj.set({ left: Math.abs(pointer.x) });
                    }
                    if (startY > pointer.y) {
                        obj.set({ top: Math.abs(pointer.y) });
                    }

                    obj.set({ rx: Math.abs((startX - pointer.x) / 2) });
                    obj.set({ ry: Math.abs((startY - pointer.y) / 2) });
                    break;

                case screenShooter.tools.move:
                    break;
                case screenShooter.tools.text:

                    break;
            }
            canvas.renderAll();
        }
    });

    canvas.on('mouse:up', function (o) {
        isDown = false;
        if (obj) {
            obj.setCoords();
            if (screenShooter.edit.tool != screenShooter.tools.text) {
                obj.set('selectable', false);
            }
            obj = null;
        }
    });

    document.onkeydown = function (e) {
        if (e.keyCode === 46) {
            canvas.remove(canvas.getActiveObject());
        }
    }
}

function resetCanvas() {
    screenShooter.edit.canvas.isDrawingMode = false;
    screenShooter.edit.canvas.forEachObject(function (obj) {
        obj.hasControls = false;
        obj.hasBorders = false;
        if (obj.get('type') === 'i-text') {
            obj.exitEditing();
            obj.hasBorders = true;
        }
    });
    setSelectable(false);
    screenShooter.edit.isEditing = false;
}

function setSelectable(selectable) {
    screenShooter.edit.canvas.forEachObject(function (obj) {
        obj.set('selectable', selectable);
    });
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
    $('.canvas-container').hide();
    $('.save-to-file').hide();
    $('.save-and-email').hide();
    $('.body .email').show();
    $('.send-email').show();
    $('#saved-screenshot').attr('src', $('#screenshot')[0].toDataURL());
}
