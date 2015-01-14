screenShooterInject = {
    isMouseOver: false,
    startX: 0,
    startY: 0,
    cropCenterMouseDown: false,
    cropCenterMouseDownPoint: { x: 0, y: 0 },
    cropCenterAreaStart: { left: 0, top: 0 },
    cropLeftAreaStart: { left: 0, top: 0, width: 0, height: 0 },
    cropRightAreaStart: { left: 0, top: 0, width: 0, height: 0 },
    cropTopAreaStart: { left: 0, width: 0, height: 0 },
    cropBottomAreaStart: { left: 0, width: 0, top: 0, height: 0 },
};

$(function () {
    showCropArea();
    bindCropEvents();
});

function showCropArea() {
    $('body').append('<div class="crop-area crop-area-top"></div><div class="crop-area crop-area-bottom"></div><div class="crop-area crop-area-left"></div><div class="crop-area crop-area-right"></div><div class="crop-area crop-area-center"><div class="crop-button" style="display:none"><i class="fa fa-scissors"></i> 剪裁</div></div>');
    $('body').append('<div class="screen-mask"></div>');
}

function bindCropEvents() {
    $('.screen-mask,.crop-area').mousedown(function (e) {
        screenShooterInject.isMouseDown = true;
        $('.crop-area').show();
        $('.crop-button').hide();
        screenShooterInject.startX = e.pageX;
        screenShooterInject.startY = e.pageY;
        console.log('start:(' + e.pageX + "," + e.pageY + ")");
    });

    $('.screen-mask,.crop-area').mouseup(function (e) {
        screenShooterInject.isMouseDown = false;
        $('.crop-button').css('display', 'inline-block');
        console.log('mouseup');
    });

    $('.screen-mask,.crop-area').mousemove(function (e) {
        if (screenShooterInject.isMouseDown && !screenShooterInject.cropCenterMouseDown) {
            console.log('move:(' + e.pageX + "," + e.pageY + ")");
            $('.screen-mask').css('opacity', 0);
            var documentHeight = $('body').height();
            var documentWidth = $('body').width();
            $('.crop-area-top').css('height', screenShooterInject.startY);
            $('.crop-area-bottom').css('top', e.pageY);
            $('.crop-area-bottom').css('height', documentHeight - e.pageY);
            $('.crop-area-left').css('height', e.pageY - screenShooterInject.startY);
            $('.crop-area-left').css('top', screenShooterInject.startY);
            $('.crop-area-left').css('width', screenShooterInject.startX);
            $('.crop-area-right').css('height', e.pageY - screenShooterInject.startY);
            $('.crop-area-right').css('top', screenShooterInject.startY);
            $('.crop-area-right').css('left', e.pageX);
            $('.crop-area-right').css('width', documentWidth - e.pageX);
            $('.crop-area-center').css('top', screenShooterInject.startY);
            $('.crop-area-center').css('left', screenShooterInject.startX);
            $('.crop-area-center').css('height', e.pageY - screenShooterInject.startY);
            $('.crop-area-center').css('width', e.pageX - screenShooterInject.startX);
        }
    });

    $('.crop-area-center').mousedown(function (e) {
        console.log(1);
        screenShooterInject.cropCenterMouseDown = true;
        screenShooterInject.cropCenterMouseDownPoint.x = e.pageX;
        screenShooterInject.cropCenterMouseDownPoint.y = e.pageY;
        screenShooterInject.cropCenterAreaStart.left = $('.crop-area-center').offset().left;
        screenShooterInject.cropCenterAreaStart.top = $('.crop-area-center').offset().top;
        screenShooterInject.cropTopAreaStart.height = $('.crop-area-top').height();
        screenShooterInject.cropBottomAreaStart.top = $('.crop-area-bottom').offset().top;
        screenShooterInject.cropBottomAreaStart.height = $('.crop-area-bottom').height();
        screenShooterInject.cropLeftAreaStart.top = $('.crop-area-left').offset().top;
        screenShooterInject.cropLeftAreaStart.width = $('.crop-area-left').width();
        screenShooterInject.cropRightAreaStart.left = $('.crop-area-right').offset().left;
        screenShooterInject.cropRightAreaStart.top = $('.crop-area-right').offset().top;
        screenShooterInject.cropRightAreaStart.width = $('.crop-area-right').width();

        if ($(e.target).hasClass('crop-button')) {
            var cropLeft = $('.crop-area-center').offset().left;
            var cropTop = $('.crop-area-center').offset().top;
            var cropWidth = $('.crop-area-center').width();
            var cropHeight = $('.crop-area-center').height();

            var cropSettings = { left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight };
            chrome.runtime.sendMessage({ action: "open-page", pageName: 'selected', cropSettings: cropSettings });

            $('.crop-area').remove();
            $('.crop-button').remove();
            $('.screen-mask').remove();
        }
    });
    $('.crop-area-center').mouseup(function () {
        screenShooterInject.cropCenterMouseDown = false;
        console.log(3);
    });
    $('.crop-area-center').mousemove(function (e) {
        if (screenShooterInject.cropCenterMouseDown) {
            console.log(2);
            var moveX = e.pageX - screenShooterInject.cropCenterMouseDownPoint.x;
            var moveY = e.pageY - screenShooterInject.cropCenterMouseDownPoint.y;
            var documentHeight = $('body').height();
            var documentWidth = $('body').width();
            var centerAfterLeft = screenShooterInject.cropCenterAreaStart.left + moveX;
            var centerAfterTop = screenShooterInject.cropCenterAreaStart.top + moveY;
            var centerWidth = $('.crop-area-center').width();
            var centerHeight = $('.crop-area-center').height();

            $('.crop-area-center').css('left', screenShooterInject.cropCenterAreaStart.left + moveX);
            $('.crop-area-top').css('left', 0);
            $('.crop-area-bottom').css('left', 0);
            $('.crop-area-left').css('left', 0);
            $('.crop-area-left').css('width', screenShooterInject.cropLeftAreaStart.width + moveX);
            $('.crop-area-right').css('left', screenShooterInject.cropRightAreaStart.left + moveX);
            $('.crop-area-right').css('width', 0 + documentWidth - screenShooterInject.cropRightAreaStart.left - moveX);
            if (centerAfterLeft < 0) {
                $('.crop-area-center').css('left', 0);
                $('.crop-area-left').css('left', 0);
                $('.crop-area-left').css('width', 0);
                $('.crop-area-right').css('left', centerWidth);
                $('.crop-area-right').css('width', documentWidth - centerWidth);
            }
            if (centerAfterLeft > documentWidth - centerWidth) {
                $('.crop-area-center').css('left', documentWidth - centerWidth);
                $('.crop-area-left').css('left', 0);
                $('.crop-area-left').css('width', documentWidth - centerWidth);
                $('.crop-area-right').css('left', documentWidth);
                $('.crop-area-right').css('width', 0);
            }

            $('.crop-area-center').css('top', screenShooterInject.cropCenterAreaStart.top + moveY);
            $('.crop-area-top').css('height', screenShooterInject.cropTopAreaStart.height + moveY);
            $('.crop-area-bottom').css('top', screenShooterInject.cropBottomAreaStart.top + moveY);
            $('.crop-area-bottom').css('height', screenShooterInject.cropBottomAreaStart.height - moveY);
            $('.crop-area-left').css('top', screenShooterInject.cropLeftAreaStart.top + moveY);
            $('.crop-area-right').css('top', screenShooterInject.cropRightAreaStart.top + moveY);
            if (centerAfterTop < 0) {
                $('.crop-area-center').css('top', 0);
                $('.crop-area-top').css('height', 0);
                $('.crop-area-bottom').css('top', $('.crop-area-center').height());
                $('.crop-area-bottom').css('height', documentHeight - $('.crop-area-center').height());
                $('.crop-area-left').css('top', 0);
                $('.crop-area-right').css('top', 0);
            }
            if (centerAfterTop > documentHeight - $('.crop-area-center').height()) {
                $('.crop-area-center').css('top', documentHeight - $('.crop-area-center').height());
                $('.crop-area-top').css('height', documentHeight - $('.crop-area-center').height());
                $('.crop-area-bottom').css('top', documentHeight);
                $('.crop-area-bottom').css('height', 0);
                $('.crop-area-left').css('top', documentHeight - $('.crop-area-center').height());
                $('.crop-area-right').css('top', documentHeight - $('.crop-area-center').height());
            }
        }
    });
}