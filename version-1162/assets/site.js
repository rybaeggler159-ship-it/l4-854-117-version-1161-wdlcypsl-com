const Hls = window.Hls;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function setupMenu() {
  const button = $('[data-menu-toggle]');
  const nav = $('[data-mobile-nav]');
  if (!button || !nav) {
    return;
  }
  button.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}

function setupBrokenImages() {
  $$('img').forEach((image) => {
    image.addEventListener('error', () => {
      image.classList.add('image-hidden');
    }, { once: true });
  });
}

function setupHero() {
  const hero = $('[data-hero]');
  if (!hero) {
    return;
  }
  const slides = $$('[data-hero-slide]', hero);
  const dots = $$('[data-hero-dot]', hero);
  const next = $('[data-hero-next]', hero);
  const prev = $('[data-hero-prev]', hero);
  let index = 0;
  let timer = null;

  const show = (nextIndex) => {
    if (!slides.length) {
      return;
    }
    index = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  };

  const restart = () => {
    if (timer) {
      clearInterval(timer);
    }
    timer = setInterval(() => show(index + 1), 5600);
  };

  next?.addEventListener('click', () => {
    show(index + 1);
    restart();
  });
  prev?.addEventListener('click', () => {
    show(index - 1);
    restart();
  });
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      show(Number(dot.dataset.heroDot || 0));
      restart();
    });
  });
  show(0);
  restart();
}

function setupFilters() {
  $$('[data-filter-scope]').forEach((scope) => {
    const input = $('[data-search-input]', scope);
    const selects = $$('[data-filter-select]', scope);
    const cards = $$('[data-movie-card]', scope);
    const empty = $('[data-empty-state]', scope);

    const apply = () => {
      const keyword = (input?.value || '').trim().toLowerCase();
      const filters = new Map(selects.map((select) => [select.dataset.filterSelect, select.value]));
      let visible = 0;

      cards.forEach((card) => {
        const haystack = (card.dataset.search || '').toLowerCase();
        const keywordMatched = !keyword || haystack.includes(keyword);
        const filterMatched = Array.from(filters.entries()).every(([key, value]) => {
          return !value || String(card.dataset[key] || '') === value;
        });
        const matched = keywordMatched && filterMatched;
        card.hidden = !matched;
        if (matched) {
          visible += 1;
        }
      });

      empty?.classList.toggle('show', visible === 0);
    };

    input?.addEventListener('input', apply);
    selects.forEach((select) => select.addEventListener('change', apply));
  });
}

function setupPlayer() {
  const button = $('[data-video-url]');
  if (!button) {
    return;
  }
  const shell = button.closest('.video-shell');
  const video = shell?.querySelector('video');
  const message = $('[data-player-message]', shell || document);
  let hls = null;

  const showMessage = (text) => {
    if (!message) {
      return;
    }
    message.textContent = text;
    message.classList.add('show');
  };

  const prepare = () => {
    if (!video || video.dataset.ready === 'yes') {
      return;
    }
    const url = button.dataset.videoUrl;
    if (!url) {
      showMessage('播放暂时不可用，请稍后再试');
      return;
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
    } else if (Hls && Hls.isSupported()) {
      hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data && data.fatal) {
          showMessage('播放暂时不可用，请稍后再试');
        }
      });
    } else {
      showMessage('播放暂时不可用，请稍后再试');
      return;
    }
    video.dataset.ready = 'yes';
  };

  button.addEventListener('click', () => {
    prepare();
    button.classList.add('hide');
    video?.play().catch(() => {
      button.classList.remove('hide');
    });
  });

  video?.addEventListener('play', () => button.classList.add('hide'));
  video?.addEventListener('pause', () => {
    if (video.currentTime === 0 || video.ended) {
      button.classList.remove('hide');
    }
  });

  window.addEventListener('beforeunload', () => {
    if (hls) {
      hls.destroy();
    }
  });
}

setupMenu();
setupBrokenImages();
setupHero();
setupFilters();
setupPlayer();
