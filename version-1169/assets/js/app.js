(function () {
  function all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  var toggle = document.querySelector('[data-nav-toggle]');
  var mobile = document.querySelector('[data-mobile-nav]');
  if (toggle && mobile) {
    toggle.addEventListener('click', function () {
      mobile.classList.toggle('open');
    });
  }

  all('[data-filter-panel]').forEach(function (panel) {
    var search = panel.querySelector('[data-site-search]');
    var year = panel.querySelector('[data-filter-year]');
    var kind = panel.querySelector('[data-filter-kind]');
    var grid = document.querySelector('[data-movie-grid]');
    var empty = document.querySelector('[data-empty-state]');

    function applyFilters() {
      if (!grid) {
        return;
      }
      var q = search ? search.value.trim().toLowerCase() : '';
      var y = year ? year.value : '';
      var k = kind ? kind.value : '';
      var visible = 0;
      all('.movie-card', grid).forEach(function (card) {
        var text = [card.dataset.title, card.dataset.region, card.dataset.kind, card.dataset.year].join(' ').toLowerCase();
        var passText = !q || text.indexOf(q) !== -1;
        var passYear = !y || card.dataset.year === y;
        var passKind = !k || (card.dataset.kind || '').indexOf(k) !== -1;
        var show = passText && passYear && passKind;
        card.style.display = show ? '' : 'none';
        if (show) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('show', visible === 0);
      }
    }

    [search, year, kind].forEach(function (input) {
      if (input) {
        input.addEventListener('input', applyFilters);
        input.addEventListener('change', applyFilters);
      }
    });
  });

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = all('.hero-slide', hero);
    var dots = all('[data-hero-dot]', hero);
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(target) {
      if (!slides.length) {
        return;
      }
      index = (target + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    }

    function start() {
      clearInterval(timer);
      timer = setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
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

    show(0);
    start();
  }
})();
