(function () {
    const menuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('is-open');
        });
    }

    const slider = document.querySelector('[data-hero-slider]');
    if (slider) {
        const slides = Array.from(slider.querySelectorAll('.hero-slide'));
        const dots = Array.from(slider.querySelectorAll('.hero-dot'));
        let current = 0;

        function showSlide(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                showSlide(index);
            });
        });

        if (slides.length > 1) {
            setInterval(function () {
                showSlide(current + 1);
            }, 5000);
        }
    }

    const scope = document.querySelector('[data-filter-scope]');
    if (scope) {
        const input = scope.querySelector('[data-filter-input]');
        const region = scope.querySelector('[data-region-filter]');
        const items = Array.from(scope.querySelectorAll('.search-item'));
        const grid = scope.querySelector('.searchable-grid');
        const query = new URLSearchParams(window.location.search).get('q') || '';

        if (input && query) {
            input.value = query;
        }

        function normalize(value) {
            return String(value || '').trim().toLowerCase();
        }

        function itemText(item) {
            return normalize([
                item.dataset.title,
                item.dataset.region,
                item.dataset.year,
                item.dataset.genre,
                item.dataset.tags
            ].join(' '));
        }

        function applyFilter() {
            const keyword = normalize(input ? input.value : '');
            const regionValue = normalize(region ? region.value : '');
            items.forEach(function (item) {
                const matchKeyword = !keyword || itemText(item).indexOf(keyword) !== -1;
                const matchRegion = !regionValue || normalize(item.dataset.region).indexOf(regionValue) !== -1;
                item.classList.toggle('is-hidden', !(matchKeyword && matchRegion));
            });
        }

        if (input) {
            input.addEventListener('input', applyFilter);
        }
        if (region) {
            region.addEventListener('change', applyFilter);
        }

        scope.querySelectorAll('[data-sort]').forEach(function (button) {
            button.addEventListener('click', function () {
                const mode = button.dataset.sort;
                const sorted = items.slice().sort(function (a, b) {
                    if (mode === 'year') {
                        return Number(b.dataset.year || 0) - Number(a.dataset.year || 0);
                    }
                    return Number(b.dataset.score || 0) - Number(a.dataset.score || 0);
                });
                sorted.forEach(function (item) {
                    grid.appendChild(item);
                });
                applyFilter();
            });
        });

        applyFilter();
    }
}());
