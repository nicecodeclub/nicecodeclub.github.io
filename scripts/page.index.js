$(function () {
    var MobileUA = (function () {
        var ua = navigator.userAgent.toLowerCase();
        var mua = {
            IOS: /ipod|iphone|ipad/.test(ua), //iOS
            IPHONE: /iphone/.test(ua), //iPhone
            IPAD: /ipad/.test(ua), //iPad
            ANDROID: /android/.test(ua), //Android Device
            WINDOWS: /windows/.test(ua), //Windows Device
            TOUCH_DEVICE: ('ontouchstart' in window) || /touch/.test(ua), //Touch Device
            MOBILE: /mobile/.test(ua), //Mobile Device (iPad)
            ANDROID_TABLET: false, //Android Tablet
            WINDOWS_TABLET: false, //Windows Tablet
            TABLET: false, //Tablet (iPad, Android, Windows)
            SMART_PHONE: false //Smart Phone (iPhone, Android)
        };

        mua.ANDROID_TABLET = mua.ANDROID && !mua.MOBILE;
        mua.WINDOWS_TABLET = mua.WINDOWS && /tablet/.test(ua);
        mua.TABLET = mua.IPAD || mua.ANDROID_TABLET || mua.WINDOWS_TABLET;
        mua.SMART_PHONE = mua.MOBILE && !mua.TABLET;

        return mua;
    }());
    var musiccontrols = $("#music-controls");
    var btnPlay = $("#btnPlay");
    var loadcompleted = false;
    var timeoutHide;
    if (MobileUA.SMART_PHONE) {
        musiccontrols.height(200);
        var winH = $(window).height();
        $("#wrapper").css("margin-top", (winH / 4 - 108) + "px");
    }
    else {
        musiccontrols.height(80);

        var winH = $(window).height();
        var pageH = $(document.body).height();
        var scrollT = 0;
        $(window).scroll(function () {
            scrollT = $(window).scrollTop();
        });
        function mousePositionY(ev) {
            if (ev.pageY) {
                return ev.pageY;
            }
            return ev.clientY + document.body.scrollTop - document.body.clientTop;
        };
        var mcShow = false;
        document.onmousemove = function (ev) {
            if (!loadcompleted) return;
            if (winH + scrollT - mousePositionY(ev) <= 100) {
                if (!mcShow) {
                    mcShow = true;
                    musiccontrols.fadeIn();
                    if (timeoutHide) {
                        clearTimeout(timeoutHide);
                    }
                }
            }
            else if (mcShow) {
                mcShow = false;
                musiccontrols.fadeOut();
            }
        }
    }
    $("#btnPlay").on("click", function () {
        var self = $(this);
        if (self.attr("data-action") == "play") {
            playSound.play();
        }
        else {
            playSound.pause();
        }
    });
    var playSound = function () {
        var blAudio = false;
        var audio;
        var mp3Url = "resource/music/Asher Book-Try.mp3";
        var borswer = window.navigator.userAgent.toLowerCase();
        if (borswer.indexOf("ie") >= 0) {
            $("body").append('<embed name="embedPlay" src="' + mp3Url + '" autostart="true" hidden="true" loop="false"></embed>');
            audio = document.embedPlay;
        }
        else {
            $("body").append("<audio id='audioPlay' src='" + mp3Url + "' hidden='true' >");
            audio = document.getElementById("audioPlay");
            audio.addEventListener("canplaythrough", function () {
                ino.play();
                loadcompleted = true;
                $("#music-loading").hide();
                $("#music-play").show();
                if (!MobileUA.SMART_PHONE) {
                    timeoutHide = setTimeout(function () {
                        musiccontrols.fadeOut();
                    }, 2000);
                }
            }, false);
            audio.addEventListener('ended', function () {
                uiPlay();
            }, false);
            audio.loop = true;
            audio.load();
            blAudio = true;
        }
        var uiPlay = function () {
            btnPlay.removeClass("fa-play-circle-o");
            btnPlay.addClass("fa-pause-circle-o");
            btnPlay.attr("data-action", "pause");
        }
        var uiPause = function () {
            btnPlay.addClass("fa-play-circle-o");
            btnPlay.removeClass("fa-pause-circle-o");
            btnPlay.attr("data-action", "play");
        }
        var ino = {};
        ino.play = function () {
            try {
                if (audio.paused) {
                    audio.play();
                    uiPlay();
                }
            } catch (e) {
                console.log(e);
            }
        };
        ino.pause = function () {
            try {
                audio.pause();
                uiPause();
            } catch (e) {
                console.log(e);
            }
        };

        return ino;
    }();
    

});