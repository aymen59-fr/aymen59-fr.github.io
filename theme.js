(function () {
  'use strict';
  const key = 'aymen-cv-theme';
  let theme = 'classic';
  try { if (localStorage.getItem(key) === 'aero') theme = 'aero'; } catch (_) {}
  document.documentElement.dataset.theme = theme;
  function applyTheme(next) {
    theme = next === 'aero' ? 'aero' : 'classic';
    document.documentElement.dataset.theme = theme;
    document.querySelectorAll('[data-theme-choice]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.themeChoice === theme));
    });
    document.querySelector('meta[name="theme-color"]').content = theme === 'aero' ? '#a8edea' : '#30312c';
    try { localStorage.setItem(key, theme); } catch (_) {}
  }
  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(theme);
    document.querySelectorAll('[data-theme-choice]').forEach(button => {
      button.addEventListener('click', () => applyTheme(button.dataset.themeChoice));
    });
  });
})();
