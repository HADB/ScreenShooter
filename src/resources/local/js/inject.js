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
        var cropLeft = $('.crop-area-center').offset().left;
        var cropTop = $('.crop-area-center').offset().top;
        var cropWidth = $('.crop-area-center').width();
        var cropHeight = $('.crop-area-center').height();
        var cropSettings = { left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight };
        $('.crop-area').remove();
        $('.crop-button').remove();
        $('.screen-mask').remove();
        chrome.runtime.sendMessage({ action: "open-page", pageName: 'selected', cropSettings: cropSettings });
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
}