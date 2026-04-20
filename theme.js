/* ============================================
   THRILL WAVE — THEME MANAGER
   Detects system preference, persists user
   choice in localStorage, exposes global toggle.
   Must run before body renders to prevent FOUC.
   ============================================ */
(function () {
  var mq = window.matchMedia('(prefers-color-scheme: light)');

  function getInitialTheme() {
    var saved = localStorage.getItem('tw-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return mq.matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('tw-theme', theme);
  }

  /* Apply immediately — prevents flash of wrong theme */
  applyTheme(getInitialTheme());

  /* Follow system changes only if the user hasn't set a manual preference */
  mq.addEventListener('change', function (e) {
    if (!localStorage.getItem('tw-theme')) {
      document.documentElement.setAttribute('data-theme', e.matches ? 'light' : 'dark');
    }
  });

  /* Global toggle called by the button in the nav */
  window.twToggleTheme = function () {
    var current = document.documentElement.getAttribute('data-theme') || 'dark';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  };
})();
