(function () {
  function initPlayer(box) {
    var video = box.querySelector('video');
    var button = box.querySelector('.play-overlay');
    var source = video ? video.getAttribute('data-hls') : '';
    var hlsInstance = null;
    var attached = false;

    function attachSource() {
      if (!video || !source || attached) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
      } else {
        video.src = source;
      }

      attached = true;
    }

    function playVideo() {
      attachSource();
      box.classList.add('is-playing');
      video.setAttribute('controls', 'controls');
      var playTask = video.play();

      if (playTask && typeof playTask.catch === 'function') {
        playTask.catch(function () {
          box.classList.remove('is-playing');
        });
      }
    }

    if (button) {
      button.addEventListener('click', playVideo);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          playVideo();
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.slice.call(document.querySelectorAll('.player-box')).forEach(initPlayer);
  });
})();
