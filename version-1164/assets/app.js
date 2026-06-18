(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function initMenu() {
    var button = document.querySelector('[data-mobile-toggle]');
    var menu = document.querySelector('[data-mobile-menu]');
    if (!button || !menu) return;
    button.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  function initHero() {
    var root = document.querySelector('[data-hero]');
    if (!root) return;
    var slides = Array.prototype.slice.call(root.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(root.querySelectorAll('[data-hero-dot]'));
    var prev = root.querySelector('[data-hero-prev]');
    var next = root.querySelector('[data-hero-next]');
    if (!slides.length) return;
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) window.clearInterval(timer);
      timer = null;
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }

    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function uniqueValues(cards, key) {
    var values = [];
    cards.forEach(function (card) {
      var value = card.getAttribute(key);
      if (value && values.indexOf(value) === -1) values.push(value);
    });
    return values.sort(function (a, b) {
      if (/^\d+$/.test(a) && /^\d+$/.test(b)) return Number(b) - Number(a);
      return a.localeCompare(b, 'zh-CN');
    });
  }

  function fillSelect(select, values) {
    if (!select) return;
    values.forEach(function (value) {
      var option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  function initFilters() {
    var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));
    panels.forEach(function (panel) {
      var list = panel.parentElement.querySelector('[data-filter-list]');
      if (!list) return;
      var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));
      var keyword = panel.querySelector('[data-filter-keyword]');
      var year = panel.querySelector('[data-filter-year]');
      var type = panel.querySelector('[data-filter-type]');
      var result = panel.querySelector('[data-filter-result]');
      fillSelect(year, uniqueValues(cards, 'data-year'));
      fillSelect(type, uniqueValues(cards, 'data-type'));

      var params = new URLSearchParams(window.location.search);
      var q = params.get('q');
      if (q && keyword) keyword.value = q;

      function apply() {
        var text = keyword ? keyword.value.trim().toLowerCase() : '';
        var selectedYear = year ? year.value : '';
        var selectedType = type ? type.value : '';
        var visible = 0;
        cards.forEach(function (card) {
          var haystack = [
            card.getAttribute('data-title'),
            card.getAttribute('data-region'),
            card.getAttribute('data-type'),
            card.getAttribute('data-genre'),
            card.getAttribute('data-tags'),
            card.getAttribute('data-year')
          ].join(' ').toLowerCase();
          var okText = !text || haystack.indexOf(text) > -1;
          var okYear = !selectedYear || card.getAttribute('data-year') === selectedYear;
          var okType = !selectedType || card.getAttribute('data-type') === selectedType;
          var show = okText && okYear && okType;
          card.classList.toggle('is-hidden', !show);
          if (show) visible += 1;
        });
        if (result) result.textContent = '匹配 ' + visible + ' 部';
      }

      [keyword, year, type].forEach(function (item) {
        if (item) item.addEventListener('input', apply);
        if (item) item.addEventListener('change', apply);
      });
      apply();
    });
  }

  function initPlayers() {
    var shells = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));
    shells.forEach(function (shell) {
      var video = shell.querySelector('video');
      var button = shell.querySelector('[data-play-button]');
      var message = shell.querySelector('[data-player-message]');
      var src = shell.getAttribute('data-src');
      var hls = null;
      if (!video || !src) return;

      function setMessage(text) {
        if (message) message.textContent = text || '';
      }

      function bindSource() {
        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hls.loadSource(src);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.ERROR, function (event, data) {
            if (!data || !data.fatal) return;
            if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
              setMessage('播放加载失败，请稍后再试');
              hls.startLoad();
            } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
              setMessage('播放出现波动，正在恢复');
              hls.recoverMediaError();
            } else {
              setMessage('播放暂时不可用，请稍后再试');
              hls.destroy();
            }
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = src;
        } else {
          setMessage('播放暂时不可用，请使用新版浏览器访问');
        }
      }

      function play() {
        if (!video.src && !hls) bindSource();
        var promise = video.play();
        if (promise && promise.catch) {
          promise.catch(function () {
            setMessage('点击视频区域即可继续播放');
          });
        }
      }

      if (button) {
        button.addEventListener('click', play);
      }

      video.addEventListener('click', function () {
        if (video.paused) play();
        else video.pause();
      });

      video.addEventListener('play', function () {
        shell.classList.add('is-playing');
        setMessage('');
      });

      video.addEventListener('pause', function () {
        shell.classList.remove('is-playing');
      });

      bindSource();
    });
  }

  ready(function () {
    initMenu();
    initHero();
    initFilters();
    initPlayers();
  });
})();
