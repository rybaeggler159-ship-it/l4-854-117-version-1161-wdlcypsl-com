(function () {
  var mobileToggle = document.querySelector('[data-mobile-toggle]');
  var mobilePanel = document.querySelector('[data-mobile-panel]');

  if (mobileToggle && mobilePanel) {
    mobileToggle.addEventListener('click', function () {
      mobilePanel.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function showSlide(next) {
      current = (next + slides.length) % slides.length;
      slides.forEach(function (slide, index) {
        slide.classList.toggle('is-active', index === current);
      });
      dots.forEach(function (dot, index) {
        dot.classList.toggle('is-active', index === current);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var next = parseInt(dot.getAttribute('data-hero-dot'), 10);
        showSlide(next);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showSlide(current + 1);
      }, 5600);
    }
  }

  var searchInput = document.querySelector('[data-search-input]');
  var yearFilter = document.querySelector('[data-year-filter]');
  var regionFilter = document.querySelector('[data-region-filter]');
  var resetButton = document.querySelector('[data-filter-reset]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
  var emptyResult = document.querySelector('[data-empty-result]');

  function normalize(value) {
    return (value || '').toString().toLowerCase().trim();
  }

  function applyFilters() {
    if (!cards.length) {
      return;
    }

    var query = normalize(searchInput && searchInput.value);
    var year = normalize(yearFilter && yearFilter.value);
    var region = normalize(regionFilter && regionFilter.value);
    var visible = 0;

    cards.forEach(function (card) {
      var text = normalize(card.getAttribute('data-search'));
      var cardYear = normalize(card.getAttribute('data-year'));
      var cardRegion = normalize(card.getAttribute('data-region'));
      var matchQuery = !query || text.indexOf(query) !== -1;
      var matchYear = !year || cardYear.indexOf(year) !== -1;
      var matchRegion = !region || cardRegion.indexOf(region) !== -1;
      var matched = matchQuery && matchYear && matchRegion;

      card.style.display = matched ? '' : 'none';

      if (matched) {
        visible += 1;
      }
    });

    if (emptyResult) {
      emptyResult.classList.toggle('is-visible', visible === 0);
    }
  }

  [searchInput, yearFilter, regionFilter].forEach(function (control) {
    if (control) {
      control.addEventListener('input', applyFilters);
      control.addEventListener('change', applyFilters);
    }
  });

  if (resetButton) {
    resetButton.addEventListener('click', function () {
      if (searchInput) {
        searchInput.value = '';
      }
      if (yearFilter) {
        yearFilter.value = '';
      }
      if (regionFilter) {
        regionFilter.value = '';
      }
      applyFilters();
    });
  }

  if (searchInput) {
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q');

    if (initialQuery) {
      searchInput.value = initialQuery;
      applyFilters();
    }
  }
})();
