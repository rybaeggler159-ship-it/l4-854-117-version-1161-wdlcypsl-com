(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var holder = document.querySelector('[data-player]');
    if (!holder) {
      return;
    }
    var video = holder.querySelector('video');
    var cover = holder.querySelector('.play-cover');
    var streamUrl = holder.getAttribute('data-stream');
    var attached = false;

    function attach() {
      if (!video || !streamUrl || attached) {
        return;
      }
      attached = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
        video.play();
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls();
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          video.play();
        });
        return;
      }
      video.src = streamUrl;
      video.play();
    }

    function play() {
      if (cover) {
        cover.classList.add('is-hidden');
      }
      attach();
      if (video) {
        video.play();
      }
    }

    if (cover) {
      cover.addEventListener('click', play);
    }

    if (video) {
      video.addEventListener('play', function () {
        if (cover) {
          cover.classList.add('is-hidden');
        }
      });
      video.addEventListener('click', function () {
        if (!attached) {
          play();
        }
      });
    }
  });
})();
