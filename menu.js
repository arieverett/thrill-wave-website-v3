document.addEventListener("click", function (e) {
  var btn = e.target.closest("#nav-burger");
  if (!btn) return;
  btn.classList.toggle("open");
  document.getElementById("nav-links").classList.toggle("open");
});
