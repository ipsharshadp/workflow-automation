// Only run inside WordPress admin — not in Vite dev server
if (typeof window.wp !== "undefined" && window.wp.element) {
    window.React = window.wp.element;
    window.ReactDOM = window.wp.element;
}
