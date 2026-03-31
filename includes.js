(function () {
  function load(id, file) {
    var el = document.getElementById(id);
    if (!el) return;
    fetch(file)
      .then(function (r) {
        return r.text();
      })
      .then(function (html) {
        el.innerHTML = html;
      });
  }
  load("site-nav", "/partials/nav.html");
  load("site-footer", "/partials/footer.html");
})();
