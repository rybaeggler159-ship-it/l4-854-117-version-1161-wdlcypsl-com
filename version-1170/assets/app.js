(function () {
    function ready(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            fn();
        }
    }

    function setupMenu() {
        var toggle = document.querySelector("[data-menu-toggle]");
        var menu = document.querySelector("[data-mobile-menu]");
        if (!toggle || !menu) {
            return;
        }
        toggle.addEventListener("click", function () {
            var open = menu.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
        });
    }

    function setupHero() {
        var hero = document.querySelector("[data-hero-carousel]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        if (slides.length <= 1) {
            return;
        }
        var index = 0;
        var timer = null;
        function show(next) {
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === index);
            });
        }
        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }
        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }
        dots.forEach(function (dot, i) {
            dot.addEventListener("click", function () {
                show(i);
                start();
            });
        });
        hero.addEventListener("mouseenter", stop);
        hero.addEventListener("mouseleave", start);
        start();
    }

    function setupCatalog() {
        var zones = Array.prototype.slice.call(document.querySelectorAll("[data-catalog-zone]"));
        zones.forEach(function (zone) {
            var input = zone.querySelector("[data-search-input]");
            var filters = Array.prototype.slice.call(zone.querySelectorAll("[data-filter-key]"));
            var cards = Array.prototype.slice.call(zone.querySelectorAll(".catalog-card"));
            var empty = zone.querySelector("[data-empty-state]");
            var form = zone.querySelector("[data-catalog-tools]");
            if (form) {
                form.addEventListener("submit", function (event) {
                    event.preventDefault();
                });
            }
            function apply() {
                var query = input ? input.value.trim().toLowerCase() : "";
                var visible = 0;
                cards.forEach(function (card) {
                    var ok = true;
                    var text = (card.getAttribute("data-search") || "").toLowerCase();
                    if (query && text.indexOf(query) === -1) {
                        ok = false;
                    }
                    filters.forEach(function (filter) {
                        var key = filter.getAttribute("data-filter-key");
                        var value = filter.value;
                        if (value && (card.getAttribute("data-" + key) || "") !== value) {
                            ok = false;
                        }
                    });
                    card.hidden = !ok;
                    if (ok) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.hidden = visible !== 0;
                }
            }
            if (input) {
                input.addEventListener("input", apply);
            }
            filters.forEach(function (filter) {
                filter.addEventListener("change", apply);
            });
            apply();
        });
    }

    window.initMoviePlayer = function (source) {
        var video = document.getElementById("movie-player");
        var trigger = document.getElementById("play-trigger");
        if (!video || !trigger || !source) {
            return;
        }
        var prepared = false;
        var hlsInstance = null;
        function prepare() {
            if (prepared) {
                return;
            }
            prepared = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls();
                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
                hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    video.play().catch(function () {});
                });
            } else {
                video.src = source;
            }
        }
        function start() {
            prepare();
            trigger.classList.add("is-hidden");
            video.controls = true;
            video.play().catch(function () {});
        }
        trigger.addEventListener("click", start);
        video.addEventListener("click", function () {
            if (!prepared) {
                start();
            }
        });
        window.addEventListener("beforeunload", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    };

    ready(function () {
        setupMenu();
        setupHero();
        setupCatalog();
    });
})();
