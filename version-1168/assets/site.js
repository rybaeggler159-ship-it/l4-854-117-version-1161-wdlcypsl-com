document.addEventListener("DOMContentLoaded", function () {
  var menuButton = document.querySelector("[data-menu-toggle]");
  var mobileMenu = document.querySelector("[data-mobile-menu]");

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", function () {
      mobileMenu.classList.toggle("open");
      menuButton.textContent = mobileMenu.classList.contains("open") ? "×" : "☰";
    });
  }

  var hero = document.querySelector("[data-hero]");
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var current = 0;
    var timer = null;

    var showSlide = function (index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === current);
      });
    };

    var start = function () {
      if (slides.length > 1) {
        timer = window.setInterval(function () {
          showSlide(current + 1);
        }, 5000);
      }
    };

    var stop = function () {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    };

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        stop();
        showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
        start();
      });
    });

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    start();
  }

  var forms = Array.prototype.slice.call(document.querySelectorAll("[data-filter-form]"));
  forms.forEach(function (form) {
    var targetSelector = form.getAttribute("data-filter-form");
    var target = document.querySelector(targetSelector);
    if (!target) {
      return;
    }

    var cards = Array.prototype.slice.call(target.querySelectorAll("[data-card]"));
    var input = form.querySelector("[data-filter-input]");
    var region = form.querySelector("[data-filter-region]");
    var year = form.querySelector("[data-filter-year]");
    var emptyState = document.querySelector("[data-empty-state]");
    var activeCategory = "";
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get("q");

    if (initialQuery && input) {
      input.value = initialQuery;
    }

    var applyFilters = function () {
      var query = input ? input.value.trim().toLowerCase() : "";
      var regionValue = region ? region.value : "";
      var yearValue = year ? year.value : "";
      var visibleCount = 0;

      cards.forEach(function (card) {
        var haystack = (card.getAttribute("data-search") || "").toLowerCase();
        var cardRegion = card.getAttribute("data-region") || "";
        var cardYear = card.getAttribute("data-year") || "";
        var cardCategory = card.getAttribute("data-category") || "";
        var matched = true;

        if (query && haystack.indexOf(query) === -1) {
          matched = false;
        }
        if (regionValue && cardRegion !== regionValue) {
          matched = false;
        }
        if (yearValue && cardYear !== yearValue) {
          matched = false;
        }
        if (activeCategory && cardCategory !== activeCategory) {
          matched = false;
        }

        card.style.display = matched ? "block" : "none";
        if (matched) {
          visibleCount += 1;
        }
      });

      if (emptyState) {
        emptyState.classList.toggle("show", visibleCount === 0);
      }
    };

    [input, region, year].forEach(function (control) {
      if (control) {
        control.addEventListener("input", applyFilters);
        control.addEventListener("change", applyFilters);
      }
    });

    var categoryButtons = Array.prototype.slice.call(document.querySelectorAll("[data-category-button]"));
    categoryButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        activeCategory = button.getAttribute("data-category-button") || "";
        categoryButtons.forEach(function (item) {
          item.classList.toggle("active", item === button);
        });
        applyFilters();
      });
    });

    applyFilters();
  });
});
