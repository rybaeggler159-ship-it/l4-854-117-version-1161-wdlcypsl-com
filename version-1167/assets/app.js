(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function setupMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var menu = document.querySelector('[data-mobile-nav]');
    if (!toggle || !menu) {
      return;
    }
    toggle.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  function setupHero() {
    var sliders = document.querySelectorAll('[data-hero-slider]');
    sliders.forEach(function (slider) {
      var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
      var dots = Array.prototype.slice.call(slider.querySelectorAll('.hero-dot'));
      if (slides.length < 2) {
        return;
      }
      var index = 0;
      function show(next) {
        index = (next + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle('is-active', i === index);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle('is-active', i === index);
        });
      }
      dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
          show(i);
        });
      });
      window.setInterval(function () {
        show(index + 1);
      }, 5200);
    });
  }

  function setupFilters() {
    var panels = document.querySelectorAll('[data-filter-panel]');
    panels.forEach(function (panel) {
      var scope = document.querySelector(panel.getAttribute('data-filter-panel'));
      if (!scope) {
        return;
      }
      var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-title]'));
      var keyword = panel.querySelector('[data-filter-keyword]');
      var region = panel.querySelector('[data-filter-region]');
      var type = panel.querySelector('[data-filter-type]');
      var year = panel.querySelector('[data-filter-year]');
      var empty = document.querySelector('[data-filter-empty]');
      function value(input) {
        return input ? input.value.trim().toLowerCase() : '';
      }
      function update() {
        var q = value(keyword);
        var r = value(region);
        var t = value(type);
        var y = value(year);
        var visible = 0;
        cards.forEach(function (card) {
          var title = (card.getAttribute('data-title') || '').toLowerCase();
          var cardRegion = (card.getAttribute('data-region') || '').toLowerCase();
          var cardType = (card.getAttribute('data-type') || '').toLowerCase();
          var cardYear = (card.getAttribute('data-year') || '').toLowerCase();
          var matched = true;
          if (q && title.indexOf(q) === -1) {
            matched = false;
          }
          if (r && cardRegion.indexOf(r) === -1) {
            matched = false;
          }
          if (t && cardType.indexOf(t) === -1) {
            matched = false;
          }
          if (y && cardYear !== y) {
            matched = false;
          }
          card.style.display = matched ? '' : 'none';
          if (matched) {
            visible += 1;
          }
        });
        if (empty) {
          empty.style.display = visible ? 'none' : 'block';
        }
      }
      [keyword, region, type, year].forEach(function (input) {
        if (input) {
          input.addEventListener('input', update);
          input.addEventListener('change', update);
        }
      });
    });
  }

  function setupImages() {
    document.querySelectorAll('img').forEach(function (img) {
      img.addEventListener('error', function () {
        img.classList.add('image-missing');
      });
    });
  }

  function setupPlayers() {
    document.querySelectorAll('[data-player]').forEach(function (box) {
      var video = box.querySelector('video');
      var button = box.querySelector('[data-play-button]');
      var stream = box.getAttribute('data-stream');
      var started = false;
      if (!video || !button || !stream) {
        return;
      }
      function prepare() {
        if (started) {
          return;
        }
        started = true;
        if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({
            maxBufferLength: 40,
            enableWorker: true
          });
          hls.loadSource(stream);
          hls.attachMedia(video);
          box._hls = hls;
        } else {
          video.src = stream;
        }
      }
      function play() {
        prepare();
        box.classList.add('is-playing');
        var playPromise = video.play();
        if (playPromise && playPromise.catch) {
          playPromise.catch(function () {});
        }
      }
      button.addEventListener('click', play);
      video.addEventListener('click', function () {
        if (video.paused) {
          play();
        } else {
          video.pause();
        }
      });
    });
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupFilters();
    setupImages();
    setupPlayers();
  });
})();
