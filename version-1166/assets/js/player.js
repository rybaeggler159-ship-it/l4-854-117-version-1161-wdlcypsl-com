(function () {
    var box = document.querySelector('[data-player-box]');

    if (!box) {
        return;
    }

    var video = box.querySelector('video');
    var overlay = box.querySelector('[data-video-overlay]');
    var button = box.querySelector('[data-play-button]');
    var source = box.getAttribute('data-video');
    var active = false;
    var hls = null;

    function bindVideo() {
        if (active || !video || !source) {
            return;
        }

        active = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({ enableWorker: true });
            hls.loadSource(source);
            hls.attachMedia(video);
        } else {
            video.src = source;
        }
    }

    function playVideo() {
        bindVideo();

        if (overlay) {
            overlay.classList.add('is-hidden');
        }

        video.setAttribute('controls', 'controls');
        var result = video.play();

        if (result && result.catch) {
            result.catch(function () {});
        }
    }

    if (overlay) {
        overlay.addEventListener('click', playVideo);
    }

    if (button) {
        button.addEventListener('click', function (event) {
            event.stopPropagation();
            playVideo();
        });
    }

    video.addEventListener('click', function () {
        if (!active || video.paused) {
            playVideo();
        } else {
            video.pause();
        }
    });

    window.addEventListener('pagehide', function () {
        if (hls) {
            hls.destroy();
        }
    });
})();
