/**
 * Theme Toggle Handler
 * =============================================================================
 * Manages switching between warm-light and dark themes.
 * Persists user preference in localStorage and updates the DOM accordingly.
 *
 * Usage:
 * - Automatically initializes when page loads
 * - Looks for element with id="theme-toggle" to attach click handler
 * - Updates data-theme attribute on document root
 * - Swaps sun/moon icon based on active theme
 */

(function() {
  'use strict';

  const THEME_KEY = 'theme';
  const THEME_LIGHT = 'warm-light';
  const THEME_DARK = 'dark';

  /**
   * Get current theme from localStorage, defaulting to light theme
   */
  function getTheme() {
    return localStorage.getItem(THEME_KEY) || THEME_LIGHT;
  }

  /**
   * Set theme and persist to localStorage
   */
  function setTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
    updateIcon(theme);
  }

  /**
   * Update the theme toggle icon to match current theme
   */
  function updateIcon(theme) {
    const container = document.querySelector('.icon-container');
    if (!container) return;

    const icon = theme === THEME_DARK ? '☾' : '☀';
    const className = theme === THEME_DARK ? 'icon-moon' : 'icon-sun';
    container.innerHTML = `<span class="${className}">${icon}</span>`;
  }

  /**
   * Toggle between light and dark themes
   */
  function toggleTheme() {
    const currentTheme = getTheme();
    const newTheme = currentTheme === THEME_DARK ? THEME_LIGHT : THEME_DARK;
    setTheme(newTheme);
  }

  /**
   * Initialize theme system
   */
  function init() {
    // Apply saved theme or default
    const theme = getTheme();
    setTheme(theme);

    // Attach click handler to toggle button
    const button = document.getElementById('theme-toggle');
    if (button) {
      button.addEventListener('click', toggleTheme);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
