/* Light/dark theme: respects system by default, remembers an explicit choice. */
(function () {
    var root = document.documentElement;
    var saved = null;
    try { saved = localStorage.getItem("pp-theme"); } catch (e) {}
    if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);

    function current() {
        var attr = root.getAttribute("data-theme");
        if (attr) return attr;
        return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    function render() {
        var btn = document.getElementById("theme-toggle");
        if (btn) {
            var dark = current() === "dark";
            btn.textContent = dark ? "☀" : "☾"; // sun when dark (switch to light), moon when light
            btn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
        }
    }
    function apply(theme) {
        root.setAttribute("data-theme", theme);
        try { localStorage.setItem("pp-theme", theme); } catch (e) {}
        render();
    }
    document.addEventListener("DOMContentLoaded", function () {
        render();
        var btn = document.getElementById("theme-toggle");
        if (btn) btn.addEventListener("click", function () { apply(current() === "dark" ? "light" : "dark"); });

        // Mobile overflow menu.
        var navToggle = document.getElementById("nav-toggle");
        var navLinks = document.getElementById("nav-links");
        if (navToggle && navLinks) {
            navToggle.addEventListener("click", function (e) {
                e.stopPropagation();
                var open = navLinks.classList.toggle("open");
                navToggle.setAttribute("aria-expanded", open ? "true" : "false");
            });
            // Close when a link is tapped or when tapping outside.
            navLinks.addEventListener("click", function (e) {
                if (e.target.tagName === "A") navLinks.classList.remove("open");
            });
            document.addEventListener("click", function (e) {
                if (!navLinks.contains(e.target) && e.target !== navToggle) navLinks.classList.remove("open");
            });
        }
    });
})();
