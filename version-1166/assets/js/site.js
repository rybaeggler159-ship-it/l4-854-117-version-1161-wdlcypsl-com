(function () {
    var mobileToggle = document.querySelector('[data-mobile-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (mobileToggle && mobileNav) {
        mobileToggle.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
    var current = 0;
    var timer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }

        current = (index + slides.length) % slides.length;

        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('is-active', slideIndex === current);
        });

        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('is-active', dotIndex === current);
        });
    }

    function startHero() {
        if (slides.length < 2) {
            return;
        }

        timer = window.setInterval(function () {
            showSlide(current + 1);
        }, 5000);
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            if (timer) {
                window.clearInterval(timer);
            }

            showSlide(index);
            startHero();
        });
    });

    showSlide(0);
    startHero();

    var searchInputs = Array.prototype.slice.call(document.querySelectorAll('[data-card-search]'));

    searchInputs.forEach(function (input) {
        var target = input.getAttribute('data-card-search') || 'body';
        var scope = document.querySelector(target) || document;
        var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));

        input.addEventListener('input', function () {
            var keyword = input.value.trim().toLowerCase();

            cards.forEach(function (card) {
                var text = (card.getAttribute('data-search') || card.textContent || '').toLowerCase();
                card.classList.toggle('hidden-card', keyword && text.indexOf(keyword) === -1);
            });
        });
    });

    var filterGroups = Array.prototype.slice.call(document.querySelectorAll('[data-filter-group]'));

    filterGroups.forEach(function (group) {
        var target = group.getAttribute('data-filter-group') || 'body';
        var scope = document.querySelector(target) || document;
        var buttons = Array.prototype.slice.call(group.querySelectorAll('[data-filter]'));
        var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));

        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                var value = button.getAttribute('data-filter');

                buttons.forEach(function (item) {
                    item.classList.toggle('is-active', item === button);
                });

                cards.forEach(function (card) {
                    var groupValue = card.getAttribute('data-group') || '';
                    card.classList.toggle('hidden-card', value !== 'all' && groupValue !== value);
                });
            });
        });
    });
})();
