export const langMap = () => {
  const lang = window.navigator.language || '';
  if (lang.toUpperCase().includes('EN')) {
    return 'en_';
  }
  return '';
}