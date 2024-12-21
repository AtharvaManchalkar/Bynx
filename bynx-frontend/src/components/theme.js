// filepath: /d:/coding/Bynx/bynx-frontend/src/components/theme.js

export const applyTheme = (theme) => {
  const root = document.documentElement;
  root.classList.remove('light-theme', 'dark-theme');
  root.classList.add(theme);
};