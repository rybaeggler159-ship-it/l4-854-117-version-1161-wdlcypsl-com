function initVideoPlayer(videoUrl) {
  var video = document.getElementById("movie-player");
  var trigger = document.querySelector("[data-player-trigger]");
  var player = document.querySelector("[data-player]");
  var ready = false;
  var hlsInstance = null;

  if (!video || !videoUrl) {
    return;
  }

  var hideTrigger = function () {
    if (trigger) {
      trigger.classList.add("hidden");
    }
  };

  var startPlayback = function () {
    hideTrigger();
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {
        if (trigger) {
          trigger.classList.remove("hidden");
        }
      });
    }
  };

  var setup = function () {
    if (ready) {
      startPlayback();
      return;
    }

    ready = true;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoUrl;
      video.load();
      startPlayback();
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({ enableWorker: true });
      hlsInstance.loadSource(videoUrl);
      hlsInstance.attachMedia(video);
      hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, startPlayback);
      startPlayback();
      hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
        if (data && data.fatal) {
          hlsInstance.destroy();
          video.src = videoUrl;
          video.load();
          startPlayback();
        }
      });
      return;
    }

    video.src = videoUrl;
    video.load();
    startPlayback();
  };

  if (trigger) {
    trigger.addEventListener("click", setup);
  }

  if (player) {
    player.addEventListener("click", function (event) {
      if (event.target === video) {
        setup();
      }
    });
  }

  video.addEventListener("play", hideTrigger);
  video.addEventListener("pause", function () {
    if (trigger && video.currentTime === 0) {
      trigger.classList.remove("hidden");
    }
  });
}
